import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Users,
  Package,
  FileText,
  Check,
  X,
  Eye,
  Printer,
  Search,
  Filter,
  UserCheck,
  MapPin,
  ChevronDown,
  MoreVertical,
  Grid,
  List,
  TrendingUp,
  Activity,
  Edit,
  Trash2,
} from 'lucide-react';
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
  const [viewMode, setViewMode] = useState('grid');
  const [expandedCard, setExpandedCard] = useState(null);

  const isPackageProvider = authState.user?.role === 'PackageProvider';
  const isGuide = authState.user?.role === 'Guide';
  const isAdmin = authState.user?.role === 'Admin';
  const isTourist = authState.user?.role === 'Tourist';
  const canManage = isAdmin || isPackageProvider;

  const formatDate = (isoDate) => {
    if (!isoDate) return { date: 'N/A', time: 'N/A', fullDate: '' };
    const date = new Date(isoDate);
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      fullDate: date.toISOString().split('T')[0],
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
        let rawAppointments = [];
        if (Array.isArray(data)) {
          rawAppointments = data;
        } else if (data && typeof data === 'object') {
          if (Array.isArray(data.appointments)) {
            rawAppointments = data.appointments;
          } else {
            rawAppointments = [
              ...(Array.isArray(data.upcoming) ? data.upcoming : []),
              ...(Array.isArray(data.past) ? data.past : []),
            ];
          }
        }
        const processedAppointments = rawAppointments
          .map((app) => {
            const isOwn = app.userId?._id === authState.user?._id;
            return {
              id: app._id,
              userName: app.userName || `${app.userId?.firstName || ''} ${app.userId?.lastName || ''}`.trim() || 'Unknown User',
              membersCount: app.membersCount || 1,
              packageType: app.selectedTier || app.packageType || 'Standard',
              packageName: app.packageId?.packageName || 'N/A',
              note: app.note || '',
              startDate: app.startDate,
              endDate: app.endDate,
              status: app.status || 'booked',
              createdAt: app.createdAt,
              needsGuide: app.needsGuide || false,
              guideId: app.guideId || null,
              formattedDate: formatDate(app.startDate),
              createdDate: formatDate(app.createdAt),
              isOwn,
            };
          })
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

  useEffect(() => {
    let result = [...appointments];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (app) =>
          app.userName.toLowerCase().includes(term) ||
          app.packageType.toLowerCase().includes(term) ||
          app.packageName.toLowerCase().includes(term) ||
          app.id.toLowerCase().includes(term)
      );
    }
    if (filterStatus !== 'all') {
      result = result.filter((app) => app.status === filterStatus);
    }
    if (filterDate) {
      result = result.filter((app) => app.formattedDate.fullDate === filterDate);
    }
    setFilteredAppointments(result);
  }, [searchTerm, filterStatus, filterDate, appointments]);

  const handleConfirm = async (id) => {
    try {
      await api.put(`/api/appointments/${id}/confirm`, { status: 'confirmed' });
      setAppointments((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: 'confirmed' } : app))
      );
    } catch (err) {
      console.error('Failed to confirm appointment:', err);
      setError(err.response?.data?.message || 'Failed to confirm appointment');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/api/appointments/${id}/reject`, { status: 'rejected' });
      setAppointments((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: 'rejected' } : app))
      );
    } catch (err) {
      console.error('Failed to reject appointment:', err);
      setError(err.response?.data?.message || 'Failed to reject appointment');
    }
  };

  const handleUpdate = (id) => {
    navigate(`/appointments/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await api.delete(`/api/appointments/${id}`);
      setAppointments((prev) => prev.filter((app) => app.id !== id));
      setFilteredAppointments((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      setError(err.response?.data?.message || 'Failed to delete appointment');
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

  const generateReport = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Appointments Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              background: white;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 3px solid #2563eb;
              padding-bottom: 15px;
            }
            .header h1 {
              color: #1e40af;
              margin: 0 0 10px 0;
            }
            .report-info {
              color: #6b7280;
              font-size: 14px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            th {
              background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
              color: white;
              padding: 12px 8px;
              text-align: left;
              font-weight: 600;
              font-size: 13px;
            }
            td {
              padding: 10px 8px;
              border-bottom: 1px solid #e5e7eb;
              font-size: 12px;
            }
            tr:nth-child(even) {
              background-color: #f9fafb;
            }
            tr:hover {
              background-color: #f3f4f6;
            }
            .status-confirmed {
              background: #d1fae5;
              color: #065f46;
              padding: 3px 8px;
              border-radius: 12px;
              font-weight: 600;
              font-size: 11px;
            }
            .status-booked, .status-pending {
              background: #fef3c7;
              color: #92400e;
              padding: 3px 8px;
              border-radius: 12px;
              font-weight: 600;
              font-size: 11px;
            }
            .status-rejected {
              background: #fee2e2;
              color: #991b1b;
              padding: 3px 8px;
              border-radius: 12px;
              font-weight: 600;
              font-size: 11px;
            }
            .package-vip {
              background: #f3e8ff;
              color: #6b21a8;
              padding: 3px 8px;
              border-radius: 12px;
              font-weight: 600;
              font-size: 11px;
            }
            .package-premium {
              background: #dbeafe;
              color: #1e40af;
              padding: 3px 8px;
              border-radius: 12px;
              font-weight: 600;
              font-size: 11px;
            }
            .package-standard {
              background: #f3f4f6;
              color: #374151;
              padding: 3px 8px;
              border-radius: 12px;
              font-weight: 600;
              font-size: 11px;
            }
            .guide-status {
              color: #059669;
              font-weight: 600;
            }
            .needs-guide {
              color: #ea580c;
              font-weight: 600;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              color: #6b7280;
              font-size: 12px;
              padding-top: 15px;
              border-top: 1px solid #e5e7eb;
            }
            @media print {
              body { padding: 0; }
              .header { page-break-after: avoid; }
              tr { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📅 Appointments Report</h1>
            <div class="report-info">
              Generated on ${new Date().toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            <div class="report-info">Total Appointments: ${filteredAppointments.length}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer Name</th>
                <th>Package</th>
                <th>Package Name</th>
                <th>Members</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Guide Status</th>
                <th>Note</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              ${filteredAppointments.map(app => `
                <tr>
                  <td>${app.id.slice(-6)}</td>
                  <td><strong>${app.userName}</strong></td>
                  <td><span class="package-${app.packageType.toLowerCase()}">${app.packageType}</span></td>
                  <td>${app.packageName}</td>
                  <td>${app.membersCount}</td>
                  <td>${app.formattedDate.date}</td>
                  <td>${app.formattedDate.time}</td>
                  <td><span class="status-${app.status}">${app.status.charAt(0).toUpperCase() + app.status.slice(1)}</span></td>
                  <td>${app.guideId ? '<span class="guide-status">✓ Assigned</span>' : app.needsGuide ? '<span class="needs-guide">Needs Guide</span>' : 'Not required'}</td>
                  <td>${app.note || '-'}</td>
                  <td>${app.createdDate.date}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p><strong>Summary:</strong> 
              Confirmed: ${filteredAppointments.filter(a => a.status === 'confirmed').length} | 
              Booked: ${filteredAppointments.filter(a => a.status === 'booked').length} | 
              Rejected: ${filteredAppointments.filter(a => a.status === 'rejected').length}
            </p>
          </div>
        </body>
      </html>
    `;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'booked':
      case 'pending':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'rejected':
        return 'bg-rose-100 text-rose-700 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getPackageColor = (packageType) => {
    switch (packageType?.toLowerCase()) {
      case 'vip':
        return 'bg-gradient-to-br from-purple-500 to-pink-500';
      case 'premium':
        return 'bg-gradient-to-br from-blue-500 to-cyan-500';
      case 'standard':
        return 'bg-gradient-to-br from-slate-500 to-slate-600';
      default:
        return 'bg-gradient-to-br from-gray-500 to-gray-600';
    }
  };

  const getGuideStatus = (appointment) => {
    if (appointment.guideId) {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">
          <UserCheck className="w-3.5 h-3.5" />
          Guide Assigned
        </div>
      );
    } else if (appointment.needsGuide) {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-700 bg-orange-50 rounded-full border border-orange-200">
          <Activity className="w-3.5 h-3.5" />
          Needs Guide
        </div>
      );
    }
    return null;
  };

  const getStats = () => {
    return {
      total: filteredAppointments.length,
      confirmed: filteredAppointments.filter(a => a.status === 'confirmed').length,
      booked: filteredAppointments.filter(a => a.status === 'booked').length,
      rejected: filteredAppointments.filter(a => a.status === 'rejected').length,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 rounded-full border-t-blue-600 animate-spin"></div>
          </div>
          <p className="text-lg font-medium text-slate-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-pink-50">
        <div className="max-w-md p-8 text-center bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-slate-900">Error Loading Appointments</h3>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="relative p-8 overflow-hidden bg-white shadow-xl rounded-3xl">
            <div className="absolute top-0 right-0 w-64 h-64 transform translate-x-32 -translate-y-32 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 transform -translate-x-24 translate-y-24 rounded-full bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 blur-3xl"></div>
            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="mb-3 text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text">
                    {isGuide ? 'All Appointments' : 'My Appointments'}
                  </h1>
                  <p className="text-lg text-slate-600">
                    {isGuide
                      ? 'Manage and track all tour appointments'
                      : 'View and manage your booking appointments'}
                  </p>
                </div>
                <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 rounded-lg transition-all ${
                      viewMode === 'grid'
                        ? 'bg-white shadow-md text-blue-600'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 rounded-lg transition-all ${
                      viewMode === 'list'
                        ? 'bg-white shadow-md text-blue-600'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8 md:grid-cols-4">
                <div className="p-4 border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total</p>
                      <p className="mt-1 text-3xl font-bold text-blue-700">{stats.total}</p>
                    </div>
                    <div className="p-3 bg-blue-200 rounded-xl">
                      <Calendar className="w-6 h-6 text-blue-700" />
                    </div>
                  </div>
                </div>
               {/* <div className="p-4 border bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-600">Confirmed</p>
                      <p className="mt-1 text-3xl font-bold text-emerald-700">{stats.confirmed}</p>
                    </div>
                    <div className="p-3 bg-emerald-200 rounded-xl">
                      <Check className="w-6 h-6 text-emerald-700" />
                    </div>
                  </div>
                </div>*/}
                <div className="p-4 border bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl border-amber-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-amber-600">Booked</p>
                      <p className="mt-1 text-3xl font-bold text-amber-700">{stats.booked}</p>
                    </div>
                    <div className="p-3 bg-amber-200 rounded-xl">
                      <Clock className="w-6 h-6 text-amber-700" />
                    </div>
                  </div>
                </div>
              {/*}  <div className="p-4 border bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl border-rose-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-rose-600">Rejected</p>
                      <p className="mt-1 text-3xl font-bold text-rose-700">{stats.rejected}</p>
                    </div>
                    <div className="p-3 bg-rose-200 rounded-xl">
                      <X className="w-6 h-6 text-rose-700" />
                    </div>
                  </div>
                </div>*/}
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="p-6 mb-8 bg-white shadow-lg rounded-2xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute w-5 h-5 text-slate-400 left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search by name, package, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pr-4 transition-all border-2 pl-11 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>
            <div className="relative">
              <Filter className="absolute w-5 h-5 text-slate-400 left-3.5 top-3.5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full py-3 pr-4 transition-all border-2 appearance-none pl-11 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400"
              >
                <option value="all">All Statuses</option>
                <option value="booked">Booked</option>
                <option value="confirmed">Confirmed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="relative">
              <Calendar className="absolute w-5 h-5 text-slate-400 left-3.5 top-3.5" />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full py-3 pr-4 transition-all border-2 pl-11 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>
            <button
              onClick={generateReport}
              className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 transform rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <Printer className="w-5 h-5" />
              Print Report
            </button>
          </div>
        </div>

        {/* Appointments Grid/List */}
        {filteredAppointments.length === 0 ? (
          <div className="p-16 text-center bg-white shadow-lg rounded-3xl">
            <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200">
              <Calendar className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-slate-900">No appointments found</h3>
            <p className="text-lg text-slate-500">Try adjusting your filters to see more results.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-6'}>
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="relative overflow-hidden transition-all duration-300 bg-white shadow-lg group rounded-2xl hover:shadow-2xl hover:-translate-y-1"
              >
                <div className={`h-2 ${getPackageColor(appointment.packageType)}`}></div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${getPackageColor(appointment.packageType)} text-white shadow-lg`}>
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{appointment.userName}</h3>
                        <p className="text-sm text-slate-500">ID: #{appointment.id.slice(-6)}</p>
                        <p className="mt-1 text-sm font-medium text-slate-700">
                          <span className="font-bold">Package:</span> {appointment.packageName}
                        </p>
                      </div>
                    </div>
                    <button 
                      className="p-2 transition-colors rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      onClick={() => setExpandedCard(expandedCard === appointment.id ? null : appointment.id)}
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white ${getPackageColor(appointment.packageType)} shadow-md`}>
                      <Package className="w-3.5 h-3.5" />
                      {appointment.packageType}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border-2 ${getStatusColor(appointment.status)}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-4 mb-4 rounded-xl bg-slate-50">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500">Date</p>
                        <p className="text-sm font-bold text-slate-900">{appointment.formattedDate.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Clock className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500">Time</p>
                        <p className="text-sm font-bold text-slate-900">{appointment.formattedDate.time}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50">
                      <Users className="w-4 h-4 text-slate-600" />
                      <span className="text-sm font-semibold text-slate-700">
                        {appointment.membersCount} {appointment.membersCount === 1 ? 'Member' : 'Members'}
                      </span>
                    </div>
                    {getGuideStatus(appointment)}
                  </div>

                  {appointment.note && (
                    <div className="p-3 mb-4 border-l-4 border-blue-400 rounded-r-lg bg-blue-50">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 mt-0.5 text-blue-600" />
                        <p className="text-sm text-slate-700">{appointment.note}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                    {isAdmin && (
                      <button
                        onClick={() => navigate(`/assign-guide/${appointment.id}`)}
                        className="flex items-center justify-center flex-1 gap-2 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 transform rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:scale-105 active:scale-95"
                      >
                        <UserCheck className="w-4 h-4" />
                        Assign Guide
                      </button>
                    )}
                    <button
                      onClick={() => openDetailsModal(appointment)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-300 bg-slate-100 rounded-xl hover:bg-slate-200"
                    >
                      <Eye className="w-4 h-4" />
                      Details
                    </button>
                    {isPackageProvider && appointment.status === 'booked' && (
                      <>
                        <button
                          onClick={() => handleConfirm(appointment.id)}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 transform bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl hover:shadow-lg hover:scale-105 active:scale-95"
                        >
                          <Check className="w-4 h-4" />
                          Confirm
                        </button>
                        <button
                          onClick={() => handleReject(appointment.id)}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 transform bg-gradient-to-r from-rose-600 to-red-600 rounded-xl hover:shadow-lg hover:scale-105 active:scale-95"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    )}
                    {(canManage || (isTourist && appointment.isOwn)) && (
                      <>
                        <button
                          onClick={() => handleUpdate(appointment.id)}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-xl hover:bg-indigo-200"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(appointment.id)}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-700 bg-rose-100 rounded-xl hover:bg-rose-200"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 transition-all duration-300 transform scale-x-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 group-hover:scale-x-100"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl overflow-hidden transition-all duration-300 transform bg-white shadow-2xl rounded-3xl animate-in">
            <div className={`${getPackageColor(selectedAppointment.packageType)} p-6 text-white`}>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="mb-2 text-3xl font-bold">Appointment Details</h2>
                  <p className="text-white/90">Complete information about this booking</p>
                </div>
                <button
                  onClick={closeDetailsModal}
                  className="p-2 transition-colors rounded-lg bg-white/20 hover:bg-white/30"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="space-y-6">
                <div className="p-5 border-2 border-slate-200 rounded-2xl">
                  <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-slate-900">
                    <User className="w-5 h-5 text-blue-600" />
                    Customer Information
                  </h3>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <span className="font-medium text-slate-600">Name</span>
                      <span className="font-bold text-slate-900">{selectedAppointment.userName}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <span className="font-medium text-slate-600">Appointment ID</span>
                      <span className="font-mono text-sm font-bold text-slate-900">#{selectedAppointment.id.slice(-8)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 border-2 border-slate-200 rounded-2xl">
                  <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-slate-900">
                    <Package className="w-5 h-5 text-purple-600" />
                    Booking Details
                  </h3>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <span className="font-medium text-slate-600">Package Name</span>
                      <span className="font-bold text-slate-900">{selectedAppointment.packageName}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <span className="font-medium text-slate-600">Package Type</span>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold text-white ${getPackageColor(selectedAppointment.packageType)} shadow-md`}>
                        {selectedAppointment.packageType}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <span className="font-medium text-slate-600">Status</span>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 ${getStatusColor(selectedAppointment.status)}`}>
                        {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <span className="font-medium text-slate-600">Members</span>
                      <span className="font-bold text-slate-900">{selectedAppointment.membersCount}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 border-2 border-slate-200 rounded-2xl">
                  <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-slate-900">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    Schedule
                  </h3>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <span className="font-medium text-slate-600">Date</span>
                      <span className="font-bold text-slate-900">{selectedAppointment.formattedDate.date}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <span className="font-medium text-slate-600">Time</span>
                      <span className="font-bold text-slate-900">{selectedAppointment.formattedDate.time}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <span className="font-medium text-slate-600">Created</span>
                      <span className="font-bold text-slate-900">{selectedAppointment.createdDate.date}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 border-2 border-slate-200 rounded-2xl">
                  <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-slate-900">
                    <UserCheck className="w-5 h-5 text-emerald-600" />
                    Guide Status
                  </h3>
                  <div className="p-4 text-center rounded-xl bg-slate-50">
                    {selectedAppointment.guideId ? (
                      <div className="inline-flex items-center gap-2 px-4 py-2 font-bold rounded-full text-emerald-700 bg-emerald-100">
                        <Check className="w-5 h-5" />
                        Guide Assigned
                      </div>
                    ) : selectedAppointment.needsGuide ? (
                      <div className="inline-flex items-center gap-2 px-4 py-2 font-bold text-orange-700 bg-orange-100 rounded-full">
                        <Activity className="w-5 h-5" />
                        Needs Guide Assignment
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-4 py-2 font-bold rounded-full text-slate-700 bg-slate-100">
                        Guide Not Required
                      </div>
                    )}
                  </div>
                </div>

                {selectedAppointment.note && (
                  <div className="p-5 border-2 border-blue-200 rounded-2xl bg-blue-50">
                    <h3 className="flex items-center gap-2 mb-3 text-lg font-bold text-blue-900">
                      <FileText className="w-5 h-5" />
                      Special Notes
                    </h3>
                    <p className="text-slate-700">{selectedAppointment.note}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t bg-slate-50 border-slate-200">
              {isAdmin && (
                <button
                  onClick={() => {
                    closeDetailsModal();
                    navigate(`/assign-guide/${selectedAppointment.id}`);
                  }}
                  className="flex items-center justify-center flex-1 gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 transform rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:scale-105 active:scale-95"
                >
                  <UserCheck className="w-5 h-5" />
                  Assign Guide
                </button>
              )}
              {isPackageProvider && selectedAppointment.status === 'booked' && (
                <>
                  <button
                    onClick={() => {
                      handleConfirm(selectedAppointment.id);
                      closeDetailsModal();
                    }}
                    className="flex items-center justify-center flex-1 gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 transform bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl hover:shadow-lg hover:scale-105 active:scale-95"
                  >
                    <Check className="w-5 h-5" />
                    Confirm
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedAppointment.id);
                      closeDetailsModal();
                    }}
                    className="flex items-center justify-center flex-1 gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 transform bg-gradient-to-r from-rose-600 to-red-600 rounded-xl hover:shadow-lg hover:scale-105 active:scale-95"
                  >
                    <X className="w-5 h-5" />
                    Reject
                  </button>
                </>
              )}
              {(canManage || (isTourist && selectedAppointment.isOwn)) && (
                <>
                  <button
                    onClick={() => {
                      closeDetailsModal();
                      handleUpdate(selectedAppointment.id);
                    }}
                    className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-indigo-700 bg-indigo-100 rounded-xl hover:bg-indigo-200"
                  >
                    <Edit className="w-5 h-5" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      closeDetailsModal();
                      handleDelete(selectedAppointment.id);
                    }}
                    className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-rose-700 bg-rose-100 rounded-xl hover:bg-rose-200"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete
                  </button>
                </>
              )}
              <button
                onClick={closeDetailsModal}
                className="px-6 py-3 font-semibold transition-all duration-300 rounded-xl text-slate-700 bg-slate-200 hover:bg-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;