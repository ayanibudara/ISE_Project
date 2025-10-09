import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Calendar, MapPin, Clock, Sparkles, ChevronLeft, ChevronRight, List } from "lucide-react";
import api from "../../utils/api";

const TouristDashboard = () => {
  const { authState } = useAuth();
  const { user, isAuthenticated } = authState;

  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!isAuthenticated) {
        setError("You must be logged in to view your dashboard.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get("api/appointments/my");
        const { upcoming = [], past = [] } = response.data;

        setUpcoming(upcoming);
        setPast(past);
        setError(null);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError(err.response?.data?.message || "Failed to load your appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [isAuthenticated]);

  const formatDateTime = (dateString) => {
    const d = new Date(dateString);
    return `${d.toLocaleDateString()} at ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const getAppointmentDates = () => {
    const dates = new Set();
    upcoming.forEach(appt => {
      const date = new Date(appt.startDate);
      dates.add(date.toDateString());
    });
    return dates;
  };

  const changeMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const appointmentDates = getAppointmentDates();
  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const today = new Date();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center">
          <div className="mb-4 text-xl text-red-600">⚠️</div>
          <p className="font-medium text-red-600">{error}</p>
          <Link to="/login" className="mt-4 text-blue-600 hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Welcome Section */}
        <div className="relative mb-8">
          <div className="absolute w-24 h-24 bg-blue-400 rounded-full -top-4 -left-4 opacity-20 blur-2xl"></div>
          <div className="absolute w-32 h-32 bg-purple-400 rounded-full -top-2 right-10 opacity-20 blur-3xl"></div>
          
          <div className="relative p-8 border shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl shadow-blue-100/50 border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-6 h-6 text-blue-600" />
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                Discover Sri Lanka
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              Welcome back, <span className="font-semibold text-gray-800">{user?.firstName || "traveller"}</span>! 
              View your booked tours and history below.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link to="/packages" className="group">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Book New Appointment
            </button>
          </Link>

          {/* ✅ NEW: View All Appointments Button */}
          <Link to="/appoiments" className="group">
            <button className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl shadow-lg shadow-gray-500/30 hover:shadow-xl hover:shadow-gray-500/40 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 font-semibold flex items-center gap-2">
              <List className="w-5 h-5" />
              View All Appointments
            </button>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Modern Calendar */}
          <div className="p-6 transition-all duration-300 border shadow-xl lg:col-span-1 bg-white/80 backdrop-blur-sm shadow-indigo-100/50 rounded-2xl border-white/20 hover:shadow-2xl hover:shadow-indigo-200/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">{monthYear}</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => changeMonth(-1)}
                  className="p-2 text-white transition-all duration-200 rounded-lg shadow-md bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:shadow-lg"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => changeMonth(1)}
                  className="p-2 text-white transition-all duration-200 rounded-lg shadow-md bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:shadow-lg"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="space-y-2">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="py-2 text-xs font-semibold text-center text-gray-600">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square"></div>
                ))}
                
                {/* Days of the month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                  const dateString = date.toDateString();
                  const hasAppointment = appointmentDates.has(dateString);
                  const isToday = date.toDateString() === today.toDateString();
                  
                  return (
                    <div
                      key={day}
                      className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer relative
                        ${isToday 
                          ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg ring-2 ring-blue-300' 
                          : hasAppointment 
                            ? 'bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 hover:from-purple-200 hover:to-pink-200 shadow-sm' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      {day}
                      {hasAppointment && !isToday && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="pt-4 mt-6 space-y-2 border-t border-gray-200">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-600 to-indigo-600"></div>
                <span className="text-gray-600">Today</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="relative w-4 h-4 rounded bg-gradient-to-br from-purple-100 to-pink-100">
                  <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-600 rounded-full"></div>
                </div>
                <span className="text-gray-600">Has Tour</span>
              </div>
            </div>
          </div>

          {/* Tours Section */}
          <div className="space-y-6 lg:col-span-2">
            {/* Upcoming Tours */}
            <div className="p-6 transition-all duration-300 border shadow-xl bg-white/80 backdrop-blur-sm shadow-blue-100/50 rounded-2xl border-white/20 hover:shadow-2xl hover:shadow-blue-200/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Upcoming Tours</h2>
                {upcoming.length > 0 && (
                  <span className="px-3 py-1 ml-auto text-sm font-semibold text-blue-700 bg-blue-100 rounded-full">
                    {upcoming.length}
                  </span>
                )}
              </div>
              
              {upcoming.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="font-medium text-gray-500">No upcoming tours.</p>
                  <p className="mt-1 text-sm text-gray-400">Book your next adventure!</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {upcoming.map((appt) => (
                    <li 
                      key={appt._id} 
                      className="p-4 transition-all duration-200 border border-blue-100 cursor-pointer group rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-200 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-semibold text-gray-800 transition-colors group-hover:text-blue-700">
                          {appt.packageType}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-white rounded-lg shadow-sm">
                          {appt.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {formatDateTime(appt.startDate)}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Past Tours */}
            <div className="p-6 transition-all duration-300 border shadow-xl bg-white/80 backdrop-blur-sm shadow-purple-100/50 rounded-2xl border-white/20 hover:shadow-2xl hover:shadow-purple-200/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Tour History</h2>
                {past.length > 0 && (
                  <span className="px-3 py-1 ml-auto text-sm font-semibold text-purple-700 bg-purple-100 rounded-full">
                    {past.length}
                  </span>
                )}
              </div>
              
              {past.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="font-medium text-gray-500">No past tours.</p>
                  <p className="mt-1 text-sm text-gray-400">Your history will appear here</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {past.map((appt) => (
                    <li 
                      key={appt._id} 
                      className="p-4 transition-all duration-200 border border-purple-100 cursor-pointer group rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 hover:border-purple-200 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-semibold text-gray-800 transition-colors group-hover:text-purple-700">
                          {appt.packageType}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-white rounded-lg shadow-sm">
                          {appt.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {formatDateTime(appt.startDate)}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TouristDashboard;