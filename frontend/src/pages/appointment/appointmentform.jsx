import React, { useState, useEffect } from "react";
import { Calendar, Users, Package, MapPin, CheckCircle, ArrowRight, ArrowLeft, X, Check, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TravelBookingApp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showAppointments, setShowAppointments] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [formData, setFormData] = useState({
    userName: "",
    membersCount: 1,
    packageType: "",
    note: "",
    startDate: "",
    needsGuide: false,
  });
const navigate = useNavigate();

  // Base URL for API - Change this to your backend URL
  const BASE_URL = "http://localhost:5000/api/appointments"; // Change to your API base URL
  // For production: const BASE_URL = "https://yourapp.com/api";

  const steps = [
    { id: 1, title: "Personal Info", icon: Users },
    { id: 2, title: "Travel Details", icon: Package },
    { id: 3, title: "Date & Notes", icon: Calendar },
    { id: 4, title: "Confirmation", icon: CheckCircle },
  ];

  // Toast notification component
  const Toast = ({ show, message, type, onClose }) => {
    useEffect(() => {
      if (show) {
        const timer = setTimeout(() => {
          onClose();
        }, 5000);
        return () => clearTimeout(timer);
      }
    }, [show, onClose]);

    if (!show) return null;

    const getToastStyles = () => {
      switch (type) {
        case 'success':
          return 'bg-green-50 border-green-200 text-green-800';
        case 'error':
          return 'bg-red-50 border-red-200 text-red-800';
        case 'warning':
          return 'bg-yellow-50 border-yellow-200 text-yellow-800';
        default:
          return 'bg-blue-50 border-blue-200 text-blue-800';
      }
    };

    const getIcon = () => {
      switch (type) {
        case 'success':
          return <Check className="w-5 h-5 text-green-500" />;
        case 'error':
          return <X className="w-5 h-5 text-red-500" />;
        case 'warning':
          return <AlertCircle className="w-5 h-5 text-yellow-500" />;
        default:
          return <AlertCircle className="w-5 h-5 text-blue-500" />;
      }
    };

    return (
      <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
        <div className={`flex items-center gap-3 px-6 py-4 rounded-lg border-2 shadow-lg max-w-md ${getToastStyles()}`}>
          {getIcon()}
          <span className="flex-1 font-medium">{message}</span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: "", type: "" });
  };

  // API service functions
  const apiService = {
    // Fetch available packages from database
    fetchPackages: async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/packages`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            // 'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        showToast('Packages loaded successfully!', 'success');
        return data.packages || data; // Handle different response structures
      } catch (error) {
        console.error('Error fetching packages:', error);
        showToast('Failed to load packages. Please try again.', 'error');
        
        // Fallback data for development/testing
        return [
          {
            id: 1,
            name: "Standard",
            basePrice: 299,
            guidePrice: 50,
            features: ["Basic accommodation", "Local transport", "Breakfast included"],
            isActive: true
          },
          {
            id: 2,
            name: "Premium",
            basePrice: 599,
            guidePrice: 80,
            features: ["Premium hotels", "Private transport", "All meals", "Tour guide available"],
            isActive: true
          },
          {
            id: 3,
            name: "VIP",
            basePrice: 999,
            guidePrice: 120,
            features: ["Luxury resorts", "Private jet/car", "Fine dining", "Personal concierge", "Spa access", "Premium guide service"],
            isActive: true
          }
        ];
      } finally {
        setLoading(false);
      }
    },

    // Create new booking
    createBooking: async (bookingData) => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            // 'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(bookingData)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        showToast('Booking confirmed successfully! 🎉', 'success');
        return data.booking || data; // Handle different response structures
      } catch (error) {
        console.error('Error creating booking:', error);
        showToast('Failed to create booking. Please try again.', 'error');
        throw error;
      } finally {
        setLoading(false);
      }
    },

    // Fetch user bookings
    fetchBookings: async (userId = null) => {
      try {
        setLoading(true);
        const url = userId ? `${BASE_URL}/bookings?userId=${userId}` : `${BASE_URL}/bookings`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            // 'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.bookings || data; // Handle different response structures
      } catch (error) {
        console.error('Error fetching bookings:', error);
        showToast('Failed to load bookings.', 'warning');
        return [];
      } finally {
        setLoading(false);
      }
    }
  };

  // Load packages on component mount
  useEffect(() => {
    const loadPackages = async () => {
      const packagesData = await apiService.fetchPackages();
      setPackages(packagesData);
      if (packagesData.length > 0) {
        setFormData(prev => ({ ...prev, packageType: packagesData[0].name }));
      }
    };
    
    loadPackages();
  }, []);

  // Load bookings when viewing appointments
  useEffect(() => {
    if (showAppointments) {
      const loadBookings = async () => {
        const bookingsData = await apiService.fetchBookings();
        setAppointments(bookingsData);
      };
      loadBookings();
    }
  }, [showAppointments]);

  const getSelectedPackage = () => {
    return packages.find(pkg => pkg.name === formData.packageType) || packages[0];
  };

  const calculateTotalPrice = () => {
    const selectedPackage = getSelectedPackage();
    if (!selectedPackage) return 0;
    
    const basePrice = selectedPackage.basePrice;
    const guidePrice = formData.needsGuide ? selectedPackage.guidePrice : 0;
    return basePrice + guidePrice;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      showToast(`Step ${currentStep + 1} completed!`, 'success');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const selectedPackage = getSelectedPackage();
    const bookingData = {
      userName: formData.userName,
      membersCount: parseInt(formData.membersCount),
      packageId: selectedPackage.id,
      packageType: formData.packageType,
      startDate: formData.startDate,
      needsGuide: formData.needsGuide,
      note: formData.note,
      totalPrice: calculateTotalPrice(),
      basePrice: selectedPackage.basePrice,
      guidePrice: formData.needsGuide ? selectedPackage.guidePrice : 0,
      status: 'Pending',
    };

    const newAppointment = await apiService.createBooking(bookingData);
    setAppointments(prev => [...prev, newAppointment]);

    // Reset form
    setFormData({
      userName: "",
      membersCount: 1,
      packageType: packages[0]?.name || "",
      note: "",
      startDate: "",
      needsGuide: false,
    });
    setCurrentStep(1);

    // ✅ Navigate to bookings page
    navigate("/appoiments");

  } catch (error) {
    console.error("Booking error:", error);
  }
};


  const viewAllBookings = () => {
    setShowAppointments(true);
  };

  const backToBooking = () => {
    setShowAppointments(false);
    setCurrentStep(1);
  };

  if (loading && packages.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading travel packages...</p>
        </div>
      </div>
    );
  }

  if (showAppointments) {
    return (
      <>
        <Toast show={toast.show} message={toast.message} type={toast.type} onClose={hideToast} />
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Your Travel Bookings
                </h1>
                <button
                  onClick={backToBooking}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  New Booking
                </button>
              </div>

              {loading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading bookings...</p>
                </div>
              )}

              {!loading && appointments.length === 0 ? (
                <div className="text-center py-20">
                  <Package className="w-24 h-24 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-600 mb-2">No bookings yet</h3>
                  <p className="text-gray-500 mb-6">Create your first travel booking to get started</p>
                  <button
                    onClick={backToBooking}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all"
                  >
                    Create Booking
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-xl text-gray-800">{appointment.userName}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{appointment.membersCount} travelers</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600">
                          <Package className="w-4 h-4" />
                          <span>{appointment.packageType} Package {appointment.needsGuide && '+ Guide'}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(appointment.startDate).toLocaleDateString()}</span>
                        </div>
                        
                        {appointment.note && (
                          <div className="flex items-start gap-2 text-gray-600">
                            <MapPin className="w-4 h-4 mt-0.5" />
                            <span className="text-sm">{appointment.note}</span>
                          </div>
                        )}
                        
                        <div className="pt-3 border-t">
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">
                              Booked on {new Date(appointment.createdAt || Date.now()).toLocaleDateString()}
                            </p>
                            <p className="text-lg font-bold text-green-600">
                              ${appointment.totalPrice}
                            </p>
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

  return (
    <>
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={hideToast} />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Plan Your Dream Journey
            </h1>
            <p className="text-gray-600 text-xl">Book your perfect travel experience in just a few steps</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex justify-center">
              <div className="flex items-center space-x-8">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep >= step.id;
                  const isCurrent = currentStep === step.id;
                  
                  return (
                    <div key={step.id} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isCurrent 
                            ? 'bg-green-600 text-white shadow-lg scale-110' 
                            : isActive 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 text-gray-400'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className={`mt-2 text-sm font-medium ${
                          isActive ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          {step.title}
                        </span>
                      </div>
                      
                      {index < steps.length - 1 && (
                        <div className={`w-20 h-1 mx-4 transition-all duration-300 ${
                          currentStep > step.id ? 'bg-blue-500' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 lg:p-12">
            <div>
              {/* Step 1: Personal Info */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Tell us about yourself</h2>
                    <p className="text-gray-600">Let's start with your basic information</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="block text-lg font-semibold text-gray-700">Full Name *</label>
                      <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                        className="w-full border-2 border-gray-200 rounded-xl p-4 text-lg focus:border-green-500 focus:outline-none transition-colors"
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
                        className="w-full border-2 border-gray-200 rounded-xl p-4 text-lg focus:border-green-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Package Selection */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Package</h2>
                    <p className="text-gray-600">Select the perfect travel experience for you</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {packages.filter(pkg => pkg.isActive).map((packageItem) => (
                      <div
                        key={packageItem.id}
                        className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                          formData.packageType === packageItem.name
                            ? 'border-green-500 bg-green-50 shadow-lg transform scale-105'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }`}
                        onClick={() => setFormData({ ...formData, packageType: packageItem.name })}
                      >
                        <div className="text-center">
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">{packageItem.name}</h3>
                          <div className="mb-4">
                            <p className="text-3xl font-bold text-green-600">${packageItem.basePrice}</p>
                            <p className="text-sm text-gray-500">+ ${packageItem.guidePrice} for guide</p>
                          </div>
                          <ul className="space-y-2 text-left">
                            {packageItem.features.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2 text-gray-600">
                                <CheckCircle className="w-4 h-4 text-blue-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Date & Notes */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">When do you want to travel?</h2>
                    <p className="text-gray-600">Pick your preferred date and add any special requests</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="block text-lg font-semibold text-gray-700">Travel Date *</label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full border-2 border-gray-200 rounded-xl p-4 text-lg focus:border-green-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="block text-lg font-semibold text-gray-700">Additional Services</label>
                      <div className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-green-300 transition-colors">
                        <input
                          type="checkbox"
                          id="needsGuide"
                          name="needsGuide"
                          checked={formData.needsGuide}
                          onChange={(e) => setFormData({ ...formData, needsGuide: e.target.checked })}
                          className="w-5 h-5 text-green-600 border-2 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                        />
                        <label htmlFor="needsGuide" className="text-lg text-gray-700 cursor-pointer flex-1">
                          <span className="font-medium">Add Professional Guide</span>
                          <div className="text-sm text-gray-500 mt-1">
                            Get a local expert guide (+${getSelectedPackage()?.guidePrice || 0} per day)
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-lg font-semibold text-gray-700">Special Requests</label>
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      placeholder="Any special preferences, dietary requirements, or requests..."
                      rows="4"
                      className="w-full border-2 border-gray-200 rounded-xl p-4 text-lg focus:border-green-500 focus:outline-none transition-colors resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Confirm Your Booking</h2>
                    <p className="text-gray-600">Review your travel details before confirming</p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Booking Details</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Name:</span>
                            <span className="font-semibold">{formData.userName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Travelers:</span>
                            <span className="font-semibold">{formData.membersCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Package:</span>
                            <span className="font-semibold">{formData.packageType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Professional Guide:</span>
                            <span className="font-semibold">{formData.needsGuide ? 'Yes' : 'No'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date:</span>
                            <span className="font-semibold">{formData.startDate}</span>
                          </div>
                          <div className="border-t pt-3 mt-3">
                            <div className="flex justify-between text-sm text-gray-500 mb-1">
                              <span>Base Price ({formData.packageType}):</span>
                              <span>${getSelectedPackage()?.basePrice || 0}</span>
                            </div>
                            {formData.needsGuide && (
                              <div className="flex justify-between text-sm text-gray-500 mb-1">
                                <span>Guide Service:</span>
                                <span>+${getSelectedPackage()?.guidePrice || 0}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">Total Price:</span>
                              <span className="font-bold text-xl text-green-600">
                                ${calculateTotalPrice()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {formData.note && (
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-4">Special Requests</h3>
                          <p className="text-gray-600 bg-white rounded-lg p-4">{formData.note}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-12 pt-8 border-t">
                <div className="flex gap-4">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Previous
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={viewAllBookings}
                    className="px-6 py-3 border-2 border-green-200 text-green-600 rounded-xl hover:bg-green-50 transition-colors"
                  >
                    View All Bookings
                  </button>
                </div>

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={
                      (currentStep === 1 && !formData.userName.trim()) ||
                      (currentStep === 2 && !formData.packageType) ||
                      (currentStep === 3 && !formData.startDate) ||
                      loading
                    }
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Next'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {loading ? 'Confirming Booking...' : 'Confirm Booking'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes slide-in-right {
            from {
              opacity: 0;
              transform: translateX(100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          .animate-slide-in-right {
            animation: slide-in-right 0.3s ease-out;
          }
          
          @keyframes bounce-in {
            0% {
              opacity: 0;
              transform: scale(0.3);
            }
            50% {
              opacity: 1;
              transform: scale(1.05);
            }
            70% {
              transform: scale(0.9);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          .animate-bounce-in {
            animation: bounce-in 0.6s ease-out;
          }
        `}</style>
      </div>
    </>
  );
}