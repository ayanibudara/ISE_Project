import React, { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  Package,
  MapPin,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  X,
  Check,
  AlertCircle
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function TravelBookingApp() {
  // ✅ CHANGED: Use 'packageId' instead of 'id'
  const { packageId } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [showAppointments, setShowAppointments] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [formData, setFormData] = useState({
    userName: "",
    membersCount: 1,
    packageType: "",
    note: "",
    startDate: "",
    endDate: "",
    needsGuide: false,
  });

  const navigate = useNavigate();
  const { authState } = useAuth();

  const userId = authState.user?._id || null;
  const userNameFromAuth = authState.user
    ? `${authState.user.firstName} ${authState.user.lastName}`
    : "";

  useEffect(() => {
    if (userNameFromAuth) {
      setFormData((prev) => ({ ...prev, userName: userNameFromAuth }));
    }
  }, [userNameFromAuth]);

  const BASE_URL = "http://localhost:5000/api/appointments";
  const PACKAGES_BASE_URL = "http://localhost:5000/api/packages";

  // ✅ FETCH PACKAGE USING 'packageId'
  useEffect(() => {
    const fetchPackage = async () => {
      // ✅ Validate packageId format (24 hex characters)
      if (!packageId || !/^[0-9a-fA-F]{24}$/.test(packageId)) {
        setError("Invalid package ID format");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${PACKAGES_BASE_URL}/${packageId}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (response.status === 404) {
          setError("Package not found in database");
          setPackageData(null);
        } else if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        } else {
          const data = await response.json();
          setPackageData(data);
          if (data.packages?.length > 0) {
            setFormData(prev => ({ 
              ...prev, 
              packageType: data.packages[0].packageType 
            }));
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [packageId]); // ✅ Depend on 'packageId'

  // Toast Component
  const Toast = ({ show, message, type, onClose }) => {
    useEffect(() => {
      if (show) {
        const timer = setTimeout(() => onClose(), 5000);
        return () => clearTimeout(timer);
      }
    }, [show, onClose]);

    if (!show) return null;

    const getToastStyles = () => {
      switch (type) {
        case "success": return "bg-green-50 border-green-200 text-green-800";
        case "error": return "bg-red-50 border-red-200 text-red-800";
        case "warning": return "bg-yellow-50 border-yellow-200 text-yellow-800";
        default: return "bg-blue-50 border-blue-200 text-blue-800";
      }
    };

    const getIcon = () => {
      switch (type) {
        case "success": return <Check className="w-5 h-5 text-green-500" />;
        case "error": return <X className="w-5 h-5 text-red-500" />;
        case "warning": return <AlertCircle className="w-5 h-5 text-yellow-500" />;
        default: return <AlertCircle className="w-5 h-5 text-blue-500" />;
      }
    };

    return (
      <div className="fixed z-50 top-4 right-4 animate-slide-in-right">
        <div
          className={`flex items-center gap-3 px-6 py-4 rounded-lg border-2 shadow-lg max-w-md ${getToastStyles()}`}
        >
          {getIcon()}
          <span className="flex-1 font-medium">{message}</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: "", type: "" });
  };

  // Get selected tier
  const getSelectedTier = () => {
    if (!packageData?.packages) return null;
    return packageData.packages.find(tier => tier.packageType === formData.packageType) 
      || packageData.packages[0];
  };

  const calculateTotalPrice = () => {
    const tier = getSelectedTier();
    if (!tier) return 0;
    const basePrice = tier.price;
    const guidePrice = formData.needsGuide ? Math.round(basePrice * 0.2) : 0;
    return basePrice + guidePrice;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const nextStep = () => {
    if (currentStep < 4) {
      if (currentStep === 3) {
        if (!formData.startDate) {
          showToast("Please select a start date.", "warning");
          return;
        }
        if (formData.endDate && formData.endDate < formData.startDate) {
          showToast("End date must be after start date.", "warning");
          return;
        }
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      showToast("Please log in to complete your booking.", "error");
      return;
    }

    const tier = getSelectedTier();
    if (!tier) {
      showToast("Please select a valid package tier.", "error");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const bookingData = {
        userId,
        userName: formData.userName,
        membersCount: parseInt(formData.membersCount),
        packageId: packageData._id, // ✅ Uses the packageId from URL
        selectedTier: formData.packageType,
        startDate: formData.startDate,
        endDate: formData.endDate || formData.startDate,
        needsGuide: formData.needsGuide,
        note: formData.note,
        totalPrice: calculateTotalPrice(),
        basePrice: tier.price,
        guidePrice: formData.needsGuide ? Math.round(tier.price * 0.2) : 0,
        status: "booked",
      };

      const response = await fetch(`${BASE_URL}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Booking failed: ${response.status}`);
      }

      showToast("Booking confirmed successfully! 🎉", "success");
      setFormData({
        userName: userNameFromAuth,
        membersCount: 1,
        packageType: packageData.packages[0]?.packageType || "",
        note: "",
        startDate: "",
        endDate: "",
        needsGuide: false,
      });
      setTimeout(() => navigate("/appoiments"), 1500);
    } catch (error) {
      console.error("Booking error:", error);
      showToast(error.message || "Failed to create booking. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const viewAllBookings = () => {
    if (!userId) {
      showToast("Please log in to view your bookings.", "warning");
      return;
    }
    setShowAppointments(true);
  };

  const backToBooking = () => {
    setShowAppointments(false);
    setCurrentStep(1);
  };

  // 🟢 LOADING STATE
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-b-2 border-green-600 rounded-full animate-spin"></div>
          <p className="text-lg text-gray-600">Loading package details...</p>
        </div>
      </div>
    );
  }

  // 🟢 ERROR HANDLING
  if (error || !packageData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
        <div className="max-w-md p-8 text-center bg-white shadow-lg rounded-2xl">
          <Package className="w-24 h-24 mx-auto text-gray-300" />
          <h2 className="mt-4 text-2xl font-bold text-gray-800">Package Not Found</h2>
          <p className="mt-2 text-gray-600">
            {error || "The requested travel package could not be found."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 mt-6 text-white transition-colors bg-green-600 rounded-xl hover:bg-green-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Appointments View
  if (showAppointments) {
    return (
      <>
        <Toast show={toast.show} message={toast.message} type={toast.type} onClose={hideToast} />
        <div className="min-h-screen p-6 bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
          <div className="max-w-6xl mx-auto">
            <div className="p-8 shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text">
                  Your Bookings
                </h1>
                <button
                  onClick={backToBooking}
                  className="flex items-center gap-2 px-6 py-3 text-white bg-green-600 rounded-xl hover:bg-green-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  New Booking
                </button>
              </div>

              {loading ? (
                <div className="py-8 text-center">
                  <div className="w-8 h-8 mx-auto mb-2 border-b-2 border-green-600 rounded-full animate-spin"></div>
                  <p className="text-gray-600">Loading bookings...</p>
                </div>
              ) : appointments.length === 0 ? (
                <div className="py-20 text-center">
                  <Package className="w-24 h-24 mx-auto mb-4 text-gray-300" />
                  <h3 className="mb-2 text-2xl font-semibold text-gray-600">No bookings yet</h3>
                  <p className="mb-6 text-gray-500">Create your first travel booking</p>
                  <button
                    onClick={backToBooking}
                    className="px-8 py-3 text-white bg-green-600 rounded-xl hover:bg-green-700"
                  >
                    Create Booking
                  </button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment._id || appointment.id}
                      className="p-6 bg-white border border-gray-100 shadow-lg rounded-2xl"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {appointment.userName}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          appointment.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{appointment.membersCount} travelers</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <Package className="w-4 h-4" />
                          <span>{appointment.selectedTier} Package</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(appointment.startDate).toLocaleDateString()}
                            {appointment.endDate && appointment.endDate !== appointment.startDate && (
                              <> – {new Date(appointment.endDate).toLocaleDateString()}
                              </>
                            )}
                          </span>
                        </div>

                        {appointment.note && (
                          <div className="flex items-start gap-2 text-gray-600">
                            <MapPin className="w-4 h-4 mt-0.5" />
                            <span className="text-sm">{appointment.note}</span>
                          </div>
                        )}

                        <div className="pt-3 border-t">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                              Booked on {new Date(appointment.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-lg font-bold text-green-600">${appointment.totalPrice}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // Main Booking Form
  return (
    <>
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={hideToast} />
      <div className="min-h-screen p-6 bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-5xl font-bold text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text">
              Book {packageData.packageName}
            </h1>
            <p className="text-xl text-gray-600">
              Complete your booking in just a few steps
            </p>
          </div>

          <div className="p-8 shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl lg:p-12">
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="mb-8 text-center">
                  <h2 className="mb-2 text-3xl font-bold text-gray-800">Your Information</h2>
                  <p className="text-gray-600">We'll use this for your booking confirmation</p>
                </div>
                <div className="max-w-md mx-auto space-y-6">
                  <div className="space-y-2">
                    <label className="block text-lg font-semibold text-gray-700">Full Name *</label>
                    <input
                      type="text"
                      name="userName"
                      value={formData.userName}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full p-4 text-lg transition-colors border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                      readOnly={!!userNameFromAuth}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-lg font-semibold text-gray-700">Number of Travelers *</label>
                    <input
                      type="number"
                      name="membersCount"
                      value={formData.membersCount}
                      onChange={handleChange}
                      min="1"
                      max="20"
                      required
                      className="w-full p-4 text-lg transition-colors border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Package Selection */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="mb-8 text-center">
                  <h2 className="mb-2 text-3xl font-bold text-gray-800">Choose Your Package Tier</h2>
                  <p className="text-gray-600">Select the experience that suits you best</p>
                </div>
                
                <div className="grid gap-6 md:grid-cols-3">
                  {packageData.packages.map((tier) => (
                    <div
                      key={tier._id}
                      className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                        formData.packageType === tier.packageType
                          ? "border-green-500 bg-green-50 shadow-lg transform scale-105"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                      }`}
                      onClick={() => setFormData({ ...formData, packageType: tier.packageType })}
                    >
                      <div className="text-center">
                        <h3 className="mb-2 text-2xl font-bold text-gray-800">{tier.packageType}</h3>
                        <div className="mb-4">
                          <p className="text-3xl font-bold text-green-600">${tier.price}</p>
                          <p className="text-sm text-gray-500">{tier.tourDays} days tour</p>
                        </div>
                        <p className="text-gray-600">{tier.services}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Date & Notes */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="mb-8 text-center">
                  <h2 className="mb-2 text-3xl font-bold text-gray-800">Travel Dates</h2>
                  <p className="text-gray-600">Select your preferred travel period</p>
                </div>

                <div className="grid max-w-2xl gap-8 mx-auto md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-lg font-semibold text-gray-700">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full p-4 text-lg transition-colors border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-lg font-semibold text-gray-700">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      min={formData.startDate || new Date().toISOString().split("T")[0]}
                      className="w-full p-4 text-lg transition-colors border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                    />
                    <p className="text-sm text-gray-500">
                      Leave blank for single-day trip
                    </p>
                  </div>
                </div>

                <div className="max-w-md mx-auto space-y-4">
                  <label className="block text-lg font-semibold text-gray-700">
                    Additional Services
                  </label>
                  <div className="flex items-center gap-3 p-4 transition-colors border-2 border-gray-200 rounded-xl hover:border-green-300">
                    <input
                      type="checkbox"
                      id="needsGuide"
                      name="needsGuide"
                      checked={formData.needsGuide}
                      onChange={handleChange}
                      className="w-5 h-5 text-green-600 border-2 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                    />
                    <label htmlFor="needsGuide" className="flex-1 text-lg text-gray-700 cursor-pointer">
                      <span className="font-medium">Add Professional Guide</span>
                      <div className="mt-1 text-sm text-gray-500">
                        Local expert guide (+${Math.round((getSelectedTier()?.price || 0) * 0.2)})
                      </div>
                    </label>
                  </div>
                </div>

                <div className="max-w-2xl mx-auto space-y-2">
                  <label className="block text-lg font-semibold text-gray-700">
                    Special Requests
                  </label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Dietary requirements, accessibility needs, etc..."
                    rows="3"
                    className="w-full p-4 text-lg transition-colors border-2 border-gray-200 resize-none rounded-xl focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="mb-8 text-center">
                  <h2 className="mb-2 text-3xl font-bold text-gray-800">Confirm Booking</h2>
                  <p className="text-gray-600">Review your details before confirming</p>
                </div>

                <div className="max-w-3xl p-6 mx-auto bg-gray-50 rounded-2xl">
                  <div className="grid gap-4">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Package:</span>
                      <span className="font-semibold">{packageData.packageName} ({formData.packageType})</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Travelers:</span>
                      <span className="font-semibold">{formData.membersCount}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Dates:</span>
                      <span className="font-semibold">
                        {formData.startDate}
                        {formData.endDate && ` - ${formData.endDate}`}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Guide:</span>
                      <span className="font-semibold">{formData.needsGuide ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-600">Total Price:</span>
                      <span className="text-xl font-bold text-green-600">${calculateTotalPrice()}</span>
                    </div>
                  </div>
                  
                  {formData.note && (
                    <div className="p-4 mt-4 bg-white rounded-lg">
                      <h4 className="mb-2 font-semibold text-gray-800">Special Requests:</h4>
                      <p className="text-gray-600">{formData.note}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-8 mt-12 border-t">
              <div className="flex gap-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 text-gray-700 transition-colors border-2 border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </button>
                )}
                <button
                  type="button"
                  onClick={viewAllBookings}
                  className="px-6 py-3 text-green-600 transition-colors border-2 border-green-200 rounded-xl hover:bg-green-50"
                >
                  My Bookings
                </button>
              </div>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && !formData.userName.trim()) ||
                    (currentStep === 2 && !formData.packageType) ||
                    loading
                  }
                  className="flex items-center gap-2 px-8 py-3 text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:opacity-50"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  Confirm Booking
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
