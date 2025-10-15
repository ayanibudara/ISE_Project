import React, { useEffect, useState } from "react";
import { Calendar, User, DollarSign, Star, ArrowLeft, AlertCircle, Clock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function GuideAssignmentForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const requestData = location.state?.requestData;

  // Redirect if no request data
  useEffect(() => {
    if (!requestData) {
      navigate("/dashboard/admin/guide-scheduling");
    }
  }, [requestData, navigate]);

  const [guides, setGuides] = useState([]);
  const [assignedGuides, setAssignedGuides] = useState([]); // 🆕 Track assigned guides
  const [totalDays, setTotalDays] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    appointmentId: requestData?._id || "",
    touristId: requestData?.userId?._id || "",
    touristName: requestData?.userId?.firstName && requestData?.userId?.lastName
      ? `${requestData.userId.firstName} ${requestData.userId.lastName}`
      : requestData?.userName || "",
    packageName: requestData?.packageId?.packageName || "N/A",
    membersCount: requestData?.membersCount || 1,
    selectedTier: requestData?.selectedTier || "",
    startDate: requestData?.startDate 
      ? new Date(requestData.startDate).toLocaleDateString("en-CA")
      : "",
    endDate: requestData?.endDate
      ? new Date(requestData.endDate).toLocaleDateString("en-CA")
      : "",
    guideId: "",
    paymentPerDay: 150,
  });
  const [errors, setErrors] = useState({});

  // 🆕 Fetch all assigned guides
  const fetchAssignedGuides = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/guideassign");
      const data = await res.json();
      setAssignedGuides(data);
    } catch (err) {
      console.error("Failed to fetch assigned guides:", err);
    }
  };

  // Fetch all guides from backend
  const fetchGuides = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/guides");
      const data = await res.json();
      setGuides(data);
    } catch (err) {
      console.error("Failed to fetch guides:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch both guides and their assignments
    Promise.all([fetchGuides(), fetchAssignedGuides()]);
  }, []);

  // Calculate total days and payment
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      setTotalDays(days > 0 ? days : 0);
      setTotalPayment(days * formData.paymentPerDay);
    }
  }, [formData.startDate, formData.endDate, formData.paymentPerDay]);

  // ✅ Get all dates between start and end (LOCAL time)
  const getDatesInRange = (start, end) => {
    const dates = [];
    let current = new Date(start);
    const endDate = new Date(end);
    
    while (current <= endDate) {
      dates.push(current.toLocaleDateString("en-CA")); // YYYY-MM-DD format
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  };

  // 🆕 Check if date ranges overlap
  const doDateRangesOverlap = (start1, end1, start2, end2) => {
    const s1 = new Date(start1);
    const e1 = new Date(end1);
    const s2 = new Date(start2);
    const e2 = new Date(end2);
    
    // Check if ranges overlap
    return s1 <= e2 && s2 <= e1;
  };

  // 🆕 Check if guide is already assigned during these dates
  const isGuideAssigned = (guideId, startDate, endDate) => {
    return assignedGuides.some((assignment) => {
      // Skip if different guide
      if (assignment.guideId !== guideId && assignment.guideId?._id !== guideId) {
        return false;
      }
      
      // Check if assignment is active (not cancelled/completed)
      if (assignment.status === "Cancelled" || assignment.status === "Completed") {
        return false;
      }
      
      // Check if dates overlap
      return doDateRangesOverlap(
        startDate,
        endDate,
        assignment.startDate,
        assignment.endDate
      );
    });
  };

  // ✅ Filter guides who are:
  // 1. Available for ALL appointment dates
  // 2. NOT already assigned to another tour during these dates
  const availableGuides = guides.filter((guide) => {
    // Get all dates in the appointment range
    const appointmentDates = getDatesInRange(formData.startDate, formData.endDate);

    // Check 1: Does guide have availability array?
    if (!guide.availability || guide.availability.length === 0) {
      return false;
    }

    // Check 2: Is guide available for EVERY date in the range?
    const hasAvailability = appointmentDates.every((dateString) => {
      return guide.availability.some((availabilityEntry) => {
        const availabilityDate = new Date(availabilityEntry.date).toLocaleDateString("en-CA");
        return availabilityDate === dateString && availabilityEntry.isAvailable === true;
      });
    });

    if (!hasAvailability) {
      return false;
    }

    // Check 3: 🆕 Is guide already assigned to another tour during these dates?
    const alreadyAssigned = isGuideAssigned(
      guide._id,
      formData.startDate,
      formData.endDate
    );

    // Only show if available AND not assigned
    return !alreadyAssigned;
  });

  // 🆕 Get guides that are assigned (for showing count)
  const assignedGuidesForTheseDates = guides.filter((guide) => {
    return isGuideAssigned(guide._id, formData.startDate, formData.endDate);
  });

  // Handle guide selection
  const handleGuideSelect = (guideId) => {
    setFormData(prev => ({ ...prev, guideId }));
    if (errors.guideId) {
      setErrors(prev => ({ ...prev, guideId: null }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.guideId) {
      newErrors.guideId = "Please select a guide";
    }
    if (!formData.paymentPerDay || formData.paymentPerDay < 1) {
      newErrors.paymentPerDay = "Payment must be greater than 0";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validateForm()) return;

    // 🆕 Double-check guide is still available before submitting
    if (isGuideAssigned(formData.guideId, formData.startDate, formData.endDate)) {
      alert("⚠️ This guide has just been assigned to another tour. Please select a different guide.");
      // Refresh data
      fetchAssignedGuides();
      return;
    }

    try {
      // 1. Save guide assignment
      const assignResponse = await fetch("http://localhost:5000/api/guideassign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: formData.appointmentId,
          touristId: formData.touristId,
          guideId: formData.guideId,
          startDate: formData.startDate,
          endDate: formData.endDate,
          totalDays,
          paymentPerDay: formData.paymentPerDay,
          totalPayment,
          status: "Assigned",
        }),
      });

      if (!assignResponse.ok) {
        throw new Error("Failed to assign guide");
      }

      // 2. Update appointment (mark as guide assigned)
      const updateResponse = await fetch(
        `http://localhost:5000/api/appointments/${formData.appointmentId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ needsGuide: false }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Failed to update appointment");
      }

      alert("✅ Guide assigned successfully!");
      navigate("/dashboard/admin/guide-scheduling");
      
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Failed to assign guide. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading available guides...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
        
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard/admin/guide-scheduling")}
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Requests
        </button>

        {/* Header */}
        <div className="mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Calendar className="mr-3 text-blue-600" size={32} />
            Assign Guide to Booking
          </h1>
          <p className="text-gray-600 mt-2">
            Select an available guide for this tour booking
          </p>
        </div>

        {/* Booking Information Card */}
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
          <h2 className="font-bold mb-4 text-blue-900 text-lg">
            Booking Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-blue-700 font-medium">Tourist Name</p>
              <p className="font-bold text-blue-900">{formData.touristName}</p>
            </div>
            <div>
              <p className="text-sm text-blue-700 font-medium">Package</p>
              <p className="font-bold text-blue-900">{formData.packageName}</p>
            </div>
            <div>
              <p className="text-sm text-blue-700 font-medium">Tier</p>
              <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-purple-200 text-purple-800">
                {formData.selectedTier}
              </span>
            </div>
            <div>
              <p className="text-sm text-blue-700 font-medium">Group Size</p>
              <p className="font-bold text-blue-900">
                {formData.membersCount} {formData.membersCount === 1 ? 'person' : 'people'}
              </p>
            </div>
            <div>
              <p className="text-sm text-blue-700 font-medium">Booking ID</p>
              <p className="font-mono text-sm text-blue-900">
                #{formData.appointmentId.substring(0, 10)}
              </p>
            </div>
          </div>
        </div>

        {/* Tour Dates */}
        <div className="mb-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="font-bold mb-4 text-gray-900 text-lg flex items-center">
            <Calendar className="mr-2 text-blue-600" size={20} />
            Tour Schedule
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Start Date
              </label>
              <div className="bg-white border-2 rounded-lg p-3 font-medium text-gray-900">
                {new Date(formData.startDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                End Date
              </label>
              <div className="bg-white border-2 rounded-lg p-3 font-medium text-gray-900">
                {new Date(formData.endDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Duration
              </label>
              <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-blue-600">{totalDays}</p>
                <p className="text-xs text-blue-700">{totalDays === 1 ? 'day' : 'days'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="mb-6 bg-green-50 p-6 rounded-lg border border-green-200">
          <h2 className="font-bold mb-4 text-green-900 text-lg flex items-center">
            <DollarSign className="mr-2 text-green-600" size={20} />
            Payment Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-green-700">
                Daily Rate ($)
              </label>
              <input
                type="number"
                value={formData.paymentPerDay}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  paymentPerDay: Number(e.target.value) 
                }))}
                className="w-full border-2 border-green-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                min="1"
              />
              {errors.paymentPerDay && (
                <p className="text-red-600 text-sm mt-1">{errors.paymentPerDay}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-green-700">
                Total Payment
              </label>
              <div className="bg-white border-2 border-green-300 rounded-lg p-3">
                <p className="text-3xl font-bold text-green-600">${totalPayment}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 🆕 Guide Availability Statistics */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
            <div className="flex items-center">
              <User className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="text-xs text-green-700 font-medium">Available</p>
                <p className="text-2xl font-bold text-green-600">{availableGuides.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <p className="text-xs text-red-700 font-medium">Already Assigned</p>
                <p className="text-2xl font-bold text-red-600">{assignedGuidesForTheseDates.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <div className="flex items-center">
              <User className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <p className="text-xs text-blue-700 font-medium">Total Guides</p>
                <p className="text-2xl font-bold text-blue-600">{guides.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Guide Selection */}
        <div className="mb-6">
          <h2 className="font-bold mb-4 text-gray-900 text-lg flex items-center">
            <User className="mr-2 text-blue-600" size={20} />
            Available Guides ({availableGuides.length})
          </h2>
          
          {/* Availability Info */}
          <div className="mb-4 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">
                  Showing guides available for {new Date(formData.startDate).toLocaleDateString()} - {new Date(formData.endDate).toLocaleDateString()}
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Guides must be available for ALL {totalDays} days</li>
                  <li>Guides already assigned to other tours during these dates are hidden</li>
                  <li>Real-time availability check prevents double-booking</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Guide List */}
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {availableGuides.length > 0 ? (
              availableGuides.map((guide) => (
                <div
                  key={guide._id}
                  onClick={() => handleGuideSelect(guide._id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    formData.guideId === guide._id
                      ? "border-blue-500 bg-blue-50 shadow-md transform scale-[1.02]"
                      : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-4">
                      {/* Guide Avatar */}
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {guide.userId?.firstName?.[0]}{guide.userId?.lastName?.[0]}
                      </div>
                      
                      {/* Guide Info */}
                      <div>
                        <p className="font-bold text-gray-900 text-lg">
                          {guide.userId?.firstName} {guide.userId?.lastName}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          {guide.expertise || "General Tour Guide"}
                        </p>
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          {guide.experience && (
                            <span className="flex items-center">
                              📅 {guide.experience} years exp.
                            </span>
                          )}
                          {guide.languages && (
                            <span className="flex items-center">
                              🗣️ {guide.languages.join(", ")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center bg-yellow-100 px-3 py-1.5 rounded-full">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                      <span className="font-bold text-yellow-700">
                        {guide.rating || "N/A"}
                      </span>
                    </div>
                  </div>
                  
                  {/* Selected Indicator */}
                  {formData.guideId === guide._id && (
                    <div className="mt-3 flex items-center text-blue-600 text-sm font-medium">
                      ✓ Selected
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Available Guides
                </h3>
                <div className="text-sm text-gray-600 mb-4 space-y-2">
                  <p>
                    No guides are available for {new Date(formData.startDate).toLocaleDateString()} - {new Date(formData.endDate).toLocaleDateString()}
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-left max-w-md mx-auto">
                    <p className="font-semibold text-yellow-800 mb-2">Possible reasons:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs text-yellow-700">
                      <li>{assignedGuidesForTheseDates.length} {assignedGuidesForTheseDates.length === 1 ? 'guide is' : 'guides are'} already assigned to other tours</li>
                      <li>Remaining guides are not available for all selected dates</li>
                      <li>Some guides may not have set their availability</li>
                    </ul>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  Consider adjusting booking dates or checking back later
                </p>
              </div>
            )}
          </div>
          
          {errors.guideId && (
            <p className="text-red-600 text-sm mt-2 font-medium">{errors.guideId}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end pt-6 border-t">
          <button
            onClick={() => navigate("/dashboard/admin/guide-scheduling")}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={availableGuides.length === 0}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              availableGuides.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
            }`}
          >
            {availableGuides.length === 0 ? "No Guides Available" : "Confirm Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
}