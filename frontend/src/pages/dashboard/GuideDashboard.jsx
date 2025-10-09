import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AvailabilityCalendar } from "../../components/ui/AvailabilityCalendar";
import { UpcomingTours } from "../../components/ui/guideUpcomingTours";

const GuideDashboard = () => {
  const { authState } = useAuth();
  const { user } = authState;
  const navigate = useNavigate();

  const [guideId, setGuideId] = useState(null); // store guide _id
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuide = async () => {
      if (!user?._id) return;

      try {
        const response = await axios.get(
          `http://localhost:5000/api/guides/${user._id}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        if (response.data?._id) {
          setGuideId(response.data._id); // store the guide ID
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setGuideId(null); // not registered
        } else {
          console.error("Error fetching guide:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGuide();
  }, [user]);

  const handleRegisterClick = () => {
    navigate("/register-guide");
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <div className="flex flex-col mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your tours and connect with tourists.
          </p>
        </div>

        {/* Register as Guide Button */}
        {!guideId && (
          <button
            onClick={handleRegisterClick}
            className="px-5 py-2 mt-4 font-semibold text-white transition-colors bg-indigo-600 rounded-lg sm:mt-0 hover:bg-indigo-700"
          >
            Register as Guide
          </button>
        )}
      </div>

      {/* Show dashboard only if registered */}
      {guideId ? (
        <>
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Your Availability
            </h2>
            <div className="p-4 bg-white rounded-lg shadow">
              <AvailabilityCalendar guideId={guideId} />
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Upcoming Tours
            </h2>
            <div className="p-4 bg-white rounded-lg shadow">
              <UpcomingTours guideId={guideId} />
            </div>
          </div>
        </>
      ) : (
        <div className="mt-10 text-center text-gray-600">
          <p>
            You haven’t registered as a guide yet. Click the{" "}
            <span className="font-medium text-indigo-600">Register as Guide</span>{" "}
            button above to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default GuideDashboard;
