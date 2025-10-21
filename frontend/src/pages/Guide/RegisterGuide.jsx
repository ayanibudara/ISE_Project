import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Plus, Trash2, Calendar, Mail, User } from "lucide-react";

export default function RegisterGuide() {
  const { authState } = useAuth();
  const user = authState.user;
  const userId = user?._id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
  });

  const [availability, setAvailability] = useState([{ date: "", isAvailable: true }]);
  const [upcomingTours, setUpcomingTours] = useState([{ title: "", place: "", date: "" }]);
  const [loading, setLoading] = useState(false);

  // ✅ Auto-fill user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvailabilityChange = (index, e) => {
    const newAvailability = [...availability];
    if (e.target.name === "isAvailable") {
      newAvailability[index][e.target.name] = e.target.checked;
    } else {
      newAvailability[index][e.target.name] = e.target.value;
    }
    setAvailability(newAvailability);
  };

  const addAvailability = () => setAvailability([...availability, { date: "", isAvailable: true }]);
  const removeAvailability = (index) =>
    setAvailability(availability.filter((_, i) => i !== index));

  const handleTourChange = (index, e) => {
    const newTours = [...upcomingTours];
    newTours[index][e.target.name] = e.target.value;
    setUpcomingTours(newTours);
  };

  const addTour = () => setUpcomingTours([...upcomingTours, { title: "", place: "", date: "" }]);
  const removeTour = (index) =>
    setUpcomingTours(upcomingTours.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error("You must be logged in to register as a guide.");
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData, userId, availability, upcomingTours };

      const response = await axios.post("http://localhost:5000/api/guides", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("🎉 Guide registered successfully!");

      // ✅ Reset form after success
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        age: "",
        email: user.email || "",
      });
      setAvailability([{ date: "", isAvailable: true }]);
      setUpcomingTours([{ title: "", place: "", date: "" }]);

      // ✅ Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "❌ Error registering guide");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Register as a Guide</h1>
          <p className="text-green-700">Complete your profile to start offering tours</p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information Section */}
          <div className="bg-white rounded-2xl p-8 shadow-md border border-green-200 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <User size={20} className="text-green-600" />
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  readOnly
                  className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-slate-900 cursor-not-allowed"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  readOnly
                  className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-slate-900 cursor-not-allowed"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min={18}
                  className="w-full px-4 py-3 border border-green-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition bg-white"
                  placeholder="Enter your age"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-3.5 text-green-600" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    className="w-full pl-10 pr-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-slate-900 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Availability Section */}
          <div className="bg-white rounded-2xl p-8 shadow-md border border-blue-200 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-blue-600" />
              Availability
            </h2>

            <div className="space-y-3">
              {availability.map((av, index) => (
                <div key={index} className="flex items-end gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-green-700 mb-2">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={av.date}
                      onChange={(e) => handleAvailabilityChange(index, e)}
                      className="w-full px-3 py-2 border border-green-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm bg-white"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={av.isAvailable}
                      onChange={(e) => handleAvailabilityChange(index, e)}
                      className="w-4 h-4 accent-green-600"
                    />
                    <span className="text-sm text-slate-700">Available</span>
                  </label>

                  {availability.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAvailability(index)}
                      className="p-2 text-green-400 hover:text-red-500 hover:bg-red-50 rounded-md transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addAvailability}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition"
              >
                <Plus size={16} /> Add Availability
              </button>
            </div>
          </div>

          {/* Upcoming Tours Section */}
          <div className="bg-white rounded-2xl p-8 shadow-md border border-blue-200 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Upcoming Tours</h2>

            <div className="space-y-4">
              {upcomingTours.map((tour, index) => (
                <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <input
                      type="text"
                      name="title"
                      placeholder="Tour Title"
                      value={tour.title}
                      onChange={(e) => handleTourChange(index, e)}
                      className="px-4 py-2 border border-green-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm placeholder-slate-400 bg-white"
                    />
                    <input
                      type="text"
                      name="place"
                      placeholder="Location"
                      value={tour.place}
                      onChange={(e) => handleTourChange(index, e)}
                      className="px-4 py-2 border border-green-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm placeholder-slate-400 bg-white"
                    />
                    <input
                      type="date"
                      name="date"
                      value={tour.date}
                      onChange={(e) => handleTourChange(index, e)}
                      className="px-4 py-2 border border-green-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm bg-white"
                    />
                  </div>

                  {upcomingTours.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTour(index)}
                      className="text-sm text-red-500 hover:text-red-700 font-medium transition flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Remove Tour
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addTour}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition"
              >
                <Plus size={16} /> Add Tour
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Registering...
              </span>
            ) : (
              "Register Guide"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}