import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Calendar, MapPin, Clock, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

const TouristDashboard = () => {
  const { authState } = useAuth();
  const { user } = authState;

  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Full backend URL (no .env)
  const APPOINTMENTS_URL = "http://localhost:5000/api/appointments";

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(APPOINTMENTS_URL);
        const data = await response.json();

        setUpcoming(data.upcoming || []);
        setPast(data.past || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8 relative">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-400 rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute -top-2 right-10 w-32 h-32 bg-purple-400 rounded-full opacity-20 blur-3xl"></div>
          
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-100/50 p-8 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="text-blue-600 w-6 h-6" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Discover Sri Lanka
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Welcome back, <span className="font-semibold text-gray-800">{user?.firstName || "traveller"}</span>! 
              View your booked tours and history below.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-4 mb-8">
          <Link to="/appointments" className="group">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Book New Appointment
            </button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Modern Calendar */}
          <div className="lg:col-span-1 bg-white/80 backdrop-blur-sm shadow-xl shadow-indigo-100/50 rounded-2xl p-6 border border-white/20 hover:shadow-2xl hover:shadow-indigo-200/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">{monthYear}</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => changeMonth(-1)}
                  className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => changeMonth(1)}
                  className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
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
                  <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
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
            <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-600 to-indigo-600"></div>
                <span className="text-gray-600">Today</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-purple-100 to-pink-100 relative">
                  <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-600 rounded-full"></div>
                </div>
                <span className="text-gray-600">Has Tour</span>
              </div>
            </div>
          </div>

          {/* Tours Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Tours */}
            <div className="bg-white/80 backdrop-blur-sm shadow-xl shadow-blue-100/50 rounded-2xl p-6 border border-white/20 hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Upcoming Tours</h2>
                {upcoming.length > 0 && (
                  <span className="ml-auto px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {upcoming.length}
                  </span>
                )}
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
                </div>
              ) : upcoming.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No upcoming tours.</p>
                  <p className="text-gray-400 text-sm mt-1">Book your next adventure!</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {upcoming.map((appt) => (
                    <li 
                      key={appt._id} 
                      className="group p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-100 hover:border-blue-200 transition-all duration-200 cursor-pointer hover:shadow-md"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                          {appt.packageType}
                        </span>
                        <span className="px-2 py-1 bg-white rounded-lg text-xs font-medium text-gray-600 shadow-sm">
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
            <div className="bg-white/80 backdrop-blur-sm shadow-xl shadow-purple-100/50 rounded-2xl p-6 border border-white/20 hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Tour History</h2>
                {past.length > 0 && (
                  <span className="ml-auto px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                    {past.length}
                  </span>
                )}
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-200 border-t-purple-600"></div>
                </div>
              ) : past.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No past tours.</p>
                  <p className="text-gray-400 text-sm mt-1">Your history will appear here</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {past.map((appt) => (
                    <li 
                      key={appt._id} 
                      className="group p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-100 hover:border-purple-200 transition-all duration-200 cursor-pointer hover:shadow-md"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">
                          {appt.packageType}
                        </span>
                        <span className="px-2 py-1 bg-white rounded-lg text-xs font-medium text-gray-600 shadow-sm">
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