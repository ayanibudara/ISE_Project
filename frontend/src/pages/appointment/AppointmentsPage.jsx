import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format ISO date to separate date and time
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return {
      date: date.toISOString().split('T')[0], // e.g., "2025-09-23"
      time: date.toTimeString().split(' ')[0].slice(0, 5), // e.g., "00:00"
    };
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/appointments');
        const data = Array.isArray(response.data) ? response.data : [];
        // Filter for upcoming appointments (startDate >= today)
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day
        const upcomingAppointments = data
          .filter(app => new Date(app.startDate) >= today)
          .map(app => ({
            id: app._id,
            patientName: app.userName,
            doctorName: 'N/A', // Placeholder; update if API provides doctorName
            date: formatDate(app.startDate).date,
            time: formatDate(app.startDate).time,
            status: app.packageType.toLowerCase() === 'standard' ? 'confirmed' : app.packageType,
            note: app.note,
          }));
        setAppointments(upcomingAppointments);
        setFilteredAppointments(upcomingAppointments);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch appointments');
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    let filtered = Array.isArray(appointments) ? [...appointments] : [];
    if (searchTerm) {
      filtered = filtered.filter(appointment =>
        appointment.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.doctorName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterStatus !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === filterStatus);
    }
    if (filterDate) {
      filtered = filtered.filter(appointment => appointment.date === filterDate);
    }
    setFilteredAppointments(filtered);
  }, [searchTerm, filterStatus, filterDate, appointments]);

  const handleConfirm = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${id}/confirm`, {
        packageType: 'Confirmed', // Update to match your backend's expected status
      });
      const updatedAppointments = appointments.map(app =>
        app.id === id ? { ...app, status: 'confirmed' } : app
      );
      setAppointments(updatedAppointments);
    } catch (err) {
      console.error('Failed to confirm appointment');
    }
  };

  const generateReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "ID,Patient Name,Doctor Name,Date,Time,Status,Note\n" +
      filteredAppointments.map(app => `${app.id},${app.patientName},${app.doctorName},${app.date},${app.time},${app.status},${app.note}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "upcoming_appointments_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto py-12 px-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Upcoming Appointments</h1>
      
      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by patient or doctor name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={generateReport}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-200"
        >
          Generate Report (CSV)
        </button>
      </div>
      
      {/* Appointments Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-gray-600 font-semibold">ID</th>
              <th className="px-6 py-3 text-left text-gray-600 font-semibold">Patient Name</th>
              <th className="px-6 py-3 text-left text-gray-600 font-semibold">Doctor Name</th>
              <th className="px-6 py-3 text-left text-gray-600 font-semibold">Date</th>
              <th className="px-6 py-3 text-left text-gray-600 font-semibold">Time</th>
              <th className="px-6 py-3 text-left text-gray-600 font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-gray-600 font-semibold">Note</th>
              <th className="px-6 py-3 text-left text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length === 0 ? (
              <tr key="no-appointments">
                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                  No upcoming appointments found
                </td>
              </tr>
            ) : (
              filteredAppointments.map(appointment => (
                <tr key={appointment.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{appointment.id}</td>
                  <td className="px-6 py-4">{appointment.patientName}</td>
                  <td className="px-6 py-4">{appointment.doctorName}</td>
                  <td className="px-6 py-4">{appointment.date}</td>
                  <td className="px-6 py-4">{appointment.time}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      appointment.status === 'confirmed' ? 'bg-green-200 text-green-800' :
                      appointment.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-red-200 text-red-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{appointment.note}</td>
                  <td className="px-6 py-4">
                    {appointment.status === 'pending' && (
                      <button
                        onClick={() => handleConfirm(appointment.id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                      >
                        Confirm
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentsPage;