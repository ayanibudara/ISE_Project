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
  const [assignedGuides, setAssignedGuides] = useState([]); // ✅ Always an array
  const [totalDays, setTotalDays] = useState(0);
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
  });
  const [errors, setErrors] = useState({});

  // ✅ FIXED: Fetch all assigned guides with error handling
  const fetchAssignedGuides = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/guideassign");
      
      if (!res.ok) {
        console.error("Failed to fetch assigned guides, status:", res.status);
        setAssignedGuides([]);
        return;
      }
      
      const data = await res.json();
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setAssignedGuides(data);
      } else {
        console.error("Expected array but got:", typeof data);
        setAssignedGuides([]);
      }
    } catch (err) {
      console.error("Failed to fetch assigned guides:", err);
      setAssignedGuides([]); // Always set empty array on error
    }
  };

  // Fetch all guides from backend
  const fetchGuides = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/guides");
      const data = await res.json();
      setGuides(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch guides:", err);
      setGuides([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([fetchGuides(), fetchAssignedGuides()]);
  }, []);

  // Calculate total days
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      setTotalDays(days > 0 ? days : 0);
    }
  }, [formData.startDate, formData.endDate]);

  // Get all dates between start and end
  const getDatesInRange = (start, end) => {
    const dates = [];
    let current = new Date(start);
    const endDate = new Date(end);
    
    while (current <= endDate) {
      dates.push(current.toLocaleDateString("en-CA"));
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  };

  // Check if date ranges overlap
  const doDateRangesOverlap = (start1, end1, start2, end2) => {
    const s1 = new Date(start1);
    const e1 = new Date(end1);
    const s2 = new Date(start2);
    const e2 = new Date(end2);
    
    return s1 <= e2 && s2 <= e1;
  };

  // ✅ FIXED: Check if guide is already assigned during these dates
  const isGuideAssigned = (guideId, startDate, endDate) => {
    // ✅ Safety check: ensure assignedGuides is an array
    if (!Array.isArray(assignedGuides)) {
      console.error("assignedGuides is not an array:", assignedGuides);
      return false;
    }

    return assignedGuides.some((assignment) => {
      // Compare guide IDs (handle both string and ObjectId)
      const assignmentGuideId = assignment.guideId?._id || assignment.guideId;
      const isSameGuide = assignmentGuideId === guideId || assignmentGuideId?.toString() === guideId?.toString();
      
      if (!isSameGuide) {
        return false;
      }
      
      // Skip cancelled/completed
      if (assignment.status === "Cancelled" || assignment.status === "Completed") {
        return false;
      }
      
      // Check overlap
      return doDateRangesOverlap(startDate, endDate, assignment.startDate, assignment.endDate);
    });
  };

  // Filter available guides
  const availableGuides = guides.filter((guide) => {
    const appointmentDates = getDatesInRange(formData.startDate, formData.endDate);

    if (!guide.availability || guide.availability.length === 0) {
      return false;
    }

    const hasAvailability = appointmentDates.every((dateString) => {
      return guide.availability.some((availabilityEntry) => {
        const availabilityDate = new Date(availabilityEntry.date).toLocaleDateString("en-CA");
        return availabilityDate === dateString && availabilityEntry.isAvailable === true;
      });
    });

    if (!hasAvailability) {
      return false;
    }

    const alreadyAssigned = isGuideAssigned(guide._id, formData.startDate, formData.endDate);
    return !alreadyAssigned;
  });

  // Get assigned guides count
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (isGuideAssigned(formData.guideId, formData.startDate, formData.endDate)) {
      alert("⚠️ This guide has just been assigned to another tour. Please select a different guide.");
      fetchAssignedGuides();
      return;
    }

    try {
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
          location: requestData?.packageId?.province || requestData?.packageId?.category || "",
          status: "Assigned",
        }),
      });

      if (!assignResponse.ok) {
        throw new Error("Failed to assign guide");
      }

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard/admin/guide-scheduling")}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Requests
          </button>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center">
            <User className="mr-3 text-blue-600" size={36} />
            Assign Guide to Tour
          </h1>
          <p className="text-gray-600 mt-2">Select an available guide for the tour request</p>
        </div>

        {/* Tour Details Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Calendar className="mr-3 text-blue-600" size={24} />
            Tour Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Tourist Name
              </p>
              <p className="text-lg font-semibold text-gray-900">{formData.touristName}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Package
              </p>
              <p className="text-lg font-semibold text-gray-900">{formData.packageName}</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Members
              </p>
              <p className="text-lg font-semibold text-gray-900">{formData.membersCount}</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Start Date
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(formData.startDate).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                End Date
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(formData.endDate).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Total Days
              </p>
              <p className="text-lg font-semibold text-gray-900">{totalDays} days</p>
            </div>
          </div>
        </div>

        {/* Guide Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Guides</p>
                <p className="text-3xl font-bold text-gray-900">{guides.length}</p>
              </div>
              <User className="h-12 w-12 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Guides</p>
                <p className="text-3xl font-bold text-green-600">{availableGuides.length}</p>
              </div>
              <Star className="h-12 w-12 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Already Assigned</p>
                <p className="text-3xl font-bold text-orange-600">{assignedGuidesForTheseDates.length}</p>
              </div>
              <Clock className="h-12 w-12 text-orange-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Available Guides */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Star className="mr-3 text-yellow-500" size={24} />
            Available Guides ({availableGuides.length})
          </h2>

          {errors.guideId && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
              <p className="text-red-700">{errors.guideId}</p>
            </div>
          )}

          {availableGuides.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">No guides available for these dates</p>
              <p className="text-gray-500 text-sm mt-2">
                All guides are either unavailable or already assigned during this period.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableGuides.map((guide) => (
                <div
                  key={guide._id}
                  onClick={() => handleGuideSelect(guide._id)}
                  className={`cursor-pointer rounded-xl border-2 p-6 transition-all duration-200 transform hover:scale-105 ${
                    formData.guideId === guide._id
                      ? "border-blue-500 bg-blue-50 shadow-lg"
                      : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {guide.name?.charAt(0) || "G"}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-bold text-gray-900 text-lg">{guide.name}</h3>
                        <p className="text-sm text-gray-600">{guide.email}</p>
                      </div>
                    </div>
                    {formData.guideId === guide._id && (
                      <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                        <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="font-medium">Languages:</span>
                      <span className="ml-2">{guide.languages?.join(", ") || "N/A"}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 mr-2 text-yellow-500" />
                      <span className="font-medium">Experience:</span>
                      <span className="ml-2">{guide.experience || "N/A"} years</span>
                    </div>
                  </div>

                  {guide.specialties && guide.specialties.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Specialties:</p>
                      <div className="flex flex-wrap gap-2">
                        {guide.specialties.slice(0, 3).map((specialty, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={() => navigate("/dashboard/admin/guide-scheduling")}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.guideId || availableGuides.length === 0}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
          >
            Assign Guide
          </button>
        </div>
      </div>
    </div>
  );
}