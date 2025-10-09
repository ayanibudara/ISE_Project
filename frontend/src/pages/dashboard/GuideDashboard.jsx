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

  const [guideData, setGuideData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch guide details by userId
  useEffect(() => {
    const fetchGuide = async () => {
      if (!user?._id) return;

      try {
        const response = await axios.get(
          `http://localhost:5000/api/guides/user/${user._id}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        // If guide data exists, set it
        if (response.data?._id) {
          setGuideData(response.data);
        } else {
          setGuideData(null);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setGuideData(null); // Not registered as a guide
        } else {
          console.error("❌ Error fetching guide:", error);
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const isRegistered = !!guideData;

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

        {!isRegistered && (
          <button
            onClick={handleRegisterClick}
            className="px-5 py-2 mt-4 font-semibold text-white transition-colors bg-indigo-600 rounded-lg sm:mt-0 hover:bg-indigo-700"
          >
            Register as Guide
          </button>
        )}
      </div>

      {/* Dashboard Sections */}
      {isRegistered ? (
        <>
          {/* ✅ Availability Section */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Your Availability
            </h2>
            <div className="p-4 bg-white rounded-lg shadow">
              <AvailabilityCalendar
                userId={user._id} // ✅ Pass userId instead of guideId
                availability={guideData.availability || []}
                onAvailabilityUpdated={(updated) =>
                  setGuideData((prev) => ({ ...prev, availability: updated }))
                }
              />
            </div>
          </div>

          {/* ✅ Upcoming Tours Section */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Upcoming Tours
            </h2>
            <div className="p-4 bg-white rounded-lg shadow">
              <UpcomingTours
                userId={user._id} // ✅ Pass userId instead of guideId
                tours={guideData.upcomingTours || []}
                onToursUpdated={(updated) =>
                  setGuideData((prev) => ({ ...prev, upcomingTours: updated }))
                }
              />
            </div>
          </div>
        </>
      ) : (
        <div className="mt-10 text-center text-gray-600">
          <p>
            You haven’t registered as a guide yet. Click the{" "}
            <span className="font-medium text-indigo-600">
              Register as Guide
            </span>{" "}
            button above to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default GuideDashboard;
