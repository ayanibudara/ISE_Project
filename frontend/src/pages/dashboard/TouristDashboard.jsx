import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const TouristDashboard = () => {
  const { authState } = useAuth();
  const { user } = authState;

  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Welcome */}
      <div className="mb-8">
        <p className="mt-1 text-sm text-gray-600">
          Welcome back, {user?.firstName || "traveller"}! View your booked tours and history below.
        </p>
      </div>

      {/* Action Button */}
      <div className="flex gap-4 mb-6">
        <Link to="/appointments">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
            Book New Appointment
          </button>
        </Link>
      </div>

      {/* Upcoming Tours */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Upcoming Tours</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : upcoming.length === 0 ? (
          <p className="text-gray-500">No upcoming tours.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {upcoming.map((appt) => (
              <li key={appt._id} className="py-3">
                <div className="flex justify-between">
                  <span className="font-medium">{appt.packageType}</span>
                  <span className="text-sm text-gray-600">{formatDateTime(appt.startDate)}</span>
                </div>
                <p className="text-sm text-gray-500">{appt.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Past Tours */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Tour History</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : past.length === 0 ? (
          <p className="text-gray-500">No past tours.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {past.map((appt) => (
              <li key={appt._id} className="py-3">
                <div className="flex justify-between">
                  <span className="font-medium">{appt.packageType}</span>
                  <span className="text-sm text-gray-600">{formatDateTime(appt.startDate)}</span>
                </div>
                <p className="text-sm text-gray-500">{appt.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TouristDashboard;
