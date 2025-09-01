import React, { useState } from "react";
import { Calendar, Users, Package, MapPin, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";

export default function TravelBookingApp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showAppointments, setShowAppointments] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    userName: "",
    membersCount: 1,
    packageType: "Standard",
    note: "",
    startDate: "",
  });

  const steps = [
    { id: 1, title: "Personal Info", icon: Users },
    { id: 2, title: "Travel Details", icon: Package },
    { id: 3, title: "Date & Notes", icon: Calendar },
    { id: 4, title: "Confirmation", icon: CheckCircle },
  ];

  const packageDetails = {
    Standard: { price: "$299", features: ["Basic accommodation", "Local transport", "Breakfast included"] },
    Premium: { price: "$599", features: ["Premium hotels", "Private transport", "All meals", "Tour guide"] },
    VIP: { price: "$999", features: ["Luxury resorts", "Private jet/car", "Fine dining", "Personal concierge", "Spa access"] }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simulate API call
    try {
      const newAppointment = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toLocaleDateString(),
        status: "Confirmed"
      };
      
      setAppointments([...appointments, newAppointment]);
      alert("Travel booking confirmed successfully!");
      
      // Reset form
      setFormData({
        userName: "",
        membersCount: 1,
        packageType: "Standard",
        note: "",
        startDate: "",
      });
      setCurrentStep(1);
    } catch (error) {
      console.error(error);
      alert("Error creating booking");
    }
  };

  const viewAllBookings = () => {
    setShowAppointments(true);
  };

  const backToBooking = () => {
    setShowAppointments(false);
    setCurrentStep(1);
  };

  if (showAppointments) {
    return (
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

            {appointments.length === 0 ? (
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
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
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
                        <span>{appointment.packageType} Package</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{appointment.startDate}</span>
                      </div>
                      
                      {appointment.note && (
                        <div className="flex items-start gap-2 text-gray-600">
                          <MapPin className="w-4 h-4 mt-0.5" />
                          <span className="text-sm">{appointment.note}</span>
                        </div>
                      )}
                      
                      <div className="pt-3 border-t">
                        <p className="text-sm text-gray-500">Booked on {appointment.createdAt}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
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
                    <label className="block text-lg font-semibold text-gray-700">Full Name</label>
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
                    <label className="block text-lg font-semibold text-gray-700">Number of Travelers</label>
                    <input
                      type="number"
                      name="membersCount"
                      value={formData.membersCount}
                      onChange={handleChange}
                      min="1"
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
                  {Object.entries(packageDetails).map(([type, details]) => (
                    <div
                      key={type}
                      className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                        formData.packageType === type
                          ? 'border-green-500 bg-green-50 shadow-lg transform scale-105'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                      onClick={() => setFormData({ ...formData, packageType: type })}
                    >
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{type}</h3>
                        <p className="text-3xl font-bold text-green-600 mb-4">{details.price}</p>
                        <ul className="space-y-2 text-left">
                          {details.features.map((feature, index) => (
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
                    <label className="block text-lg font-semibold text-gray-700">Travel Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      className="w-full border-2 border-gray-200 rounded-xl p-4 text-lg focus:border-green-500 focus:outline-none transition-colors"
                    />
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
                          <span className="text-gray-600">Date:</span>
                          <span className="font-semibold">{formData.startDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Price:</span>
                          <span className="font-bold text-xl text-green-600">
                            {packageDetails[formData.packageType]?.price}
                          </span>
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
                    className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
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
                    (currentStep === 1 && !formData.userName) ||
                    (currentStep === 3 && !formData.startDate)
                  }
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  Confirm Booking
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}