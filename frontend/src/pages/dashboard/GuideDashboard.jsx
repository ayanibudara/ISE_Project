import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AvailabilityCalendar } from "../../components/ui/AvailabilityCalendar";
import { UpcomingTours } from "../../components/ui/guideUpcomingTours";
import { Calendar, MapPin, AlertCircle, CheckCircle } from "lucide-react";

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
          console.log("✅ Guide data loaded:", response.data);
          console.log("🆔 Guide ID:", response.data._id);
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const isRegistered = !!guideData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Greeting Card */}
            <div className="bg-white rounded-2xl p-8 shadow-md border border-purple-200 hover:shadow-lg transition-shadow">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Welcome back, <span className="text-blue-600">{user?.firstName}!</span>
              </h1>
              <p className="text-slate-600 leading-relaxed">
                Manage your tours and connect with tourists. Keep your availability updated and showcase your upcoming tours.
              </p>
            </div>

            {/* Status Card */}
            {!isRegistered && (
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 shadow-md border border-green-200">
                <div className="flex items-center gap-4 mb-4">
                  <AlertCircle size={32} className="text-blue-600" />
                  <h2 className="text-xl font-semibold text-slate-900">Not Registered Yet?</h2>
                </div>
                <p className="text-slate-600 mb-6">
                  Start your journey as a tour guide today. Register your profile and begin accepting bookings.
                </p>
                <button
                  onClick={handleRegisterClick}
                  className="w-full px-6 py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                >
                  Register as Guide
                </button>
              </div>
            )}

            {isRegistered && (
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 shadow-md border border-green-200">
                <div className="flex items-center gap-4 mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                  <h2 className="text-xl font-semibold text-slate-900">Registered ✓</h2>
                </div>
                <p className="text-slate-600 mb-4">
                  You're all set! Manage your availability and tours below.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Calendar size={18} className="text-blue-600" />
                    <span className="text-sm">{guideData?.availability?.length || 0} availability slots</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin size={18} className="text-purple-600" />
                    <span className="text-sm">{guideData?.upcomingTours?.length || 0} upcoming tours</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Sections */}
        {isRegistered ? (
          <div className="space-y-8">
            {/* ✅ Availability Section */}
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <Calendar size={28} className="text-blue-600" />
                  Your Availability
                </h2>
                <p className="text-slate-600 mt-2">Set your available dates for tours</p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-md border border-blue-200 hover:shadow-lg transition-shadow">
                <AvailabilityCalendar
                  userId={user._id}
                  availability={guideData.availability || []}
                  onAvailabilityUpdated={(updated) =>
                    setGuideData((prev) => ({ ...prev, availability: updated }))
                  }
                />
              </div>
            </div>

            {/* ✅ Upcoming Tours Section */}
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <MapPin size={28} className="text-purple-600" />
                  Upcoming Tours
                </h2>
                <p className="text-slate-600 mt-2">Manage your scheduled tours</p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-md border border-purple-200 hover:shadow-lg transition-shadow">
                <UpcomingTours
                  userId={user._id}
                  guideId={guideData._id}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 shadow-md border border-blue-200 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <AlertCircle size={32} className="text-blue-600" />
            </div>
            <p className="text-slate-600 text-lg mb-2">
              You haven't registered as a guide yet.
            </p>
            <p className="text-slate-600">
              Click the{" "}
              <span className="font-semibold text-blue-600">
                Register as Guide
              </span>{" "}
              button to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideDashboard;