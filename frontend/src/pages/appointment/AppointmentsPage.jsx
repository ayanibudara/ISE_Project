import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Users, Package, FileText, Check, X, Eye, Download, Search, Filter, UserCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const AppointmentsPage = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const isPackageProvider = authState.user?.role === 'PackageProvider';
  const isGuide = authState.user?.role === 'Guide';

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return {
      date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      fullDate: date.toISOString().split('T')[0]
    };
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!authState.isAuthenticated) {
        setError('You must be logged in to view appointments.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let response;

        if (isGuide) {
          response = await api.get('api/appointments');
        } else {
          response = await api.get('api/appointments/my');
        }

        const data = response.data;
        let rawAppointments = Array.isArray(data)
          ? data
          : Array.isArray(data.appointments)
          ? data.appointments
          : Array.isArray(data.upcoming)
          ? data.upcoming
          : [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const processedAppointments = rawAppointments
          .filter(app => new Date(app.startDate) >= today)
          .map(app => ({
            id: app._id,
            userName: app.userName,
            membersCount: app.membersCount,
            packageType: app.packageType,
            note: app.note || '',
            startDate: app.startDate,
            endDate: app.endDate,
            status: app.status,
            createdAt: app.createdAt,
            needsGuide: app.needsGuide || false,
            guideId: app.guideId || null,
            formattedDate: formatDate(app.startDate),
            createdDate: formatDate(app.createdAt)
          }))
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        setAppointments(processedAppointments);
        setFilteredAppointments(processedAppointments);
        setError(null);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError(err.response?.data?.message || 'Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [authState.isAuthenticated, isGuide]);

  const handleConfirm = async (id) => {
    try {
      await api.put(`/api/appointments/${id}/confirm`, { status: 'confirmed' });
      const updatedAppointments = appointments.map(app =>
        app.id === id ? { ...app, status: 'confirmed' } : app
      );
      setAppointments(updatedAppointments);
    } catch (err) {
      console.error('Failed to confirm appointment:', err);
      setError(err.response?.data?.message || 'Failed to confirm appointment');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/api/appointments/${id}/reject`, { status: 'rejected' });
      const updatedAppointments = appointments.map(app =>
        app.id === id ? { ...app, status: 'rejected' } : app
      );
      setAppointments(updatedAppointments);
    } catch (err) {
      console.error('Failed to reject appointment:', err);
      setError(err.response?.data?.message || 'Failed to reject appointment');
    }
  };

  const openDetailsModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedAppointment(null);
  };

  /*const generateReport = () => {
    const csvContent = "text/csv;charset=utf-8," +
      "ID,Name,Members,Package,Date,Time,Status,Needs Guide,Assigned Guide,Note,Created\n" +
      filteredAppointments.map(app => 
        `${app.id},"${app.userName}",${app.membersCount},"${app.packageType}","${app.formattedDate.date}","${app.formattedDate.time}","${app.status}","${app.needsGuide ? 'Yes' : 'No'}","${app.guideId || 'None'}","${app.note}","${app.createdDate.date}"`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "appointments_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };*/

  const generateReport = () => {
  // CSV header එක
  const csvContent =
    "ID,Name,Members,Package,Date,Time,Status,Needs Guide,Assigned Guide,Note,Created\n" +
    filteredAppointments
      .map(app =>
        `${app.id},"${app.userName}",${app.membersCount},"${app.packageType}","${app.formattedDate.date}","${app.formattedDate.time}","${app.status}","${app.needsGuide ? 'Yes' : 'No'}","${app.guideId || 'None'}","${app.note}","${app.createdDate.date}"`
      )
      .join("\n");

  // ✅ Blob object එකක් create කරලා Excel-friendly CSV file එකක් කරන්න
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Download link එක create කරන්න
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "appointments_report.csv");

  // Trigger the download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};


  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'booked': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPackageColor = (packageType) => {
    switch (packageType?.toLowerCase()) {
      case 'vip': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'premium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'standard': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getGuideStatus = (appointment) => {
    if (appointment.guideId) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded">
          <UserCheck className="w-3 h-3" />
          Assigned
        </span>
      );
    } else if (appointment.needsGuide) {
      return (
        <span className="text-xs text-orange-600">Needs Guide</span>
      );
    } else {
      return (
        <span className="text-xs text-gray-500">No guide</span>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center">
          <div className="mb-4 text-xl text-red-600">⚠️</div>
          <p className="font-medium text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="p-6 mb-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                {isGuide ? "All Appointments" : "My Appointments"}
              </h1>
              <p className="text-gray-600">
                {isGuide 
                  ? "View and manage all tour appointments" 
                  : "Manage and track your upcoming appointments"}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Total Appointments</div>
              <div className="text-2xl font-bold text-blue-600">{filteredAppointments.length}</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-6 mb-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="booked">Booked</option>
                <option value="confirmed">Confirmed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div className="relative">
              <Calendar className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={generateReport}
              className="flex items-center justify-center gap-2 px-4 py-2 text-white transition-colors duration-200 bg-green-600 rounded-lg hover:bg-green-700"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Appointments Grid */}
        <div className="grid gap-6">
          {filteredAppointments.length === 0 ? (
            <div className="p-12 text-center bg-white border border-gray-200 shadow-sm rounded-xl">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">No appointments found</h3>
              <p className="text-gray-500">No upcoming appointments match your current filters.</p>
            </div>
          ) : (
            filteredAppointments.map(appointment => (
              <div key={appointment.id} className="p-6 transition-shadow duration-200 bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{appointment.userName}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {appointment.formattedDate.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {appointment.formattedDate.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {appointment.membersCount} member{appointment.membersCount !== 1 ? 's' : ''}
                        </div>
                        {getGuideStatus(appointment)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPackageColor(appointment.packageType)}`}>
                      <Package className="inline w-3 h-3 mr-1" />
                      {appointment.packageType}
                    </span>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      {/* ✅ STYLED Assign Guide Button */}
                      <button
                        onClick={() => navigate(`/assign-guide/${appointment.id}`)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 active:scale-95"
                      >
                        <UserCheck className="w-4 h-4" />
                        Assign Guide
                      </button>

                      <button
                        onClick={() => openDetailsModal(appointment)}
                        className="p-2 text-gray-600 transition-colors duration-200 rounded-lg hover:text-blue-600 hover:bg-blue-50"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* PackageProvider Actions */}
                      {isPackageProvider && appointment.status === 'booked' && (
                        <>
                          <button
                            onClick={() => handleConfirm(appointment.id)}
                            className="p-2 text-green-600 transition-colors duration-200 rounded-lg hover:text-green-700 hover:bg-green-50"
                            title="Confirm Appointment"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(appointment.id)}
                            className="p-2 text-red-600 transition-colors duration-200 rounded-lg hover:text-red-700 hover:bg-red-50"
                            title="Reject Appointment"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {/* GUIDE-ONLY: Assign Guide */}
                      {isGuide && appointment.needsGuide && !appointment.guideId && (
                        <button
                          onClick={() => navigate(`/assign-guide/${appointment.id}`)}
                          className="p-2 text-indigo-600 transition-colors duration-200 rounded-lg hover:text-indigo-700 hover:bg-indigo-50"
                          title="Assign Guide"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {appointment.note && (
                  <div className="p-3 mt-4 rounded-lg bg-gray-50">
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                      <p className="text-sm text-gray-600">{appointment.note}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md overflow-y-auto bg-white shadow-xl rounded-xl max-h-90vh">
            <div className="p-6">
              {/* ... modal content remains unchanged ... */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;