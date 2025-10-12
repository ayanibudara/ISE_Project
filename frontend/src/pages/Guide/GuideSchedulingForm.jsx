import React, { useEffect, useState } from "react";
import { Calendar, User, DollarSign, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function GuideAssignForm() {
  const [isEditing, setIsEditing] = useState(true);
  const [totalDays, setTotalDays] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [guides, setGuides] = useState([]);
  const [formData, setFormData] = useState({
    startDate: new Date().toLocaleDateString("en-CA"),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-CA"),
    guideId: "",
    paymentPerDay: 150,
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Fetch guides from backend
  const fetchGuides = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/guides");
      const data = await res.json();
      setGuides(data);
    } catch (err) {
      console.error("Failed to fetch guides:", err);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  // Calculate days between start and end
  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 0;
  };

  // Update totals when dates or rate change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const days = calculateDays(formData.startDate, formData.endDate);
      setTotalDays(days);
      setTotalPayment(days * (formData.paymentPerDay || 0));
    }
  }, [formData.startDate, formData.endDate, formData.paymentPerDay]);

  // Track selected guide
  useEffect(() => {
    const guide = guides.find((g) => g._id === formData.guideId);
    setSelectedGuide(guide || null);
  }, [formData.guideId, guides]);

  // Input handler
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Validate form before submit
  const validateForm = () => {
    const newErrors = {};
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.guideId) newErrors.guideId = "Please select a guide";
    if (!formData.paymentPerDay || formData.paymentPerDay < 1)
      newErrors.paymentPerDay = "Payment must be greater than 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form to backend
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      guideId: formData.guideId,
      startDate: formData.startDate,
      endDate: formData.endDate,
      totalDays,
      paymentPerDay: formData.paymentPerDay,
      totalPayment,
      status: "Assigned",
    };

    try {
      const response = await fetch("http://localhost:5000/api/guideassign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save booking");

      const savedData = await response.json();
      console.log("✅ Saved to MongoDB:", savedData);

      setIsEditing(false);
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Error saving booking:", err);
    }
  };

  // ✅ Get all dates between start and end (LOCAL time)
  const getDatesInRange = (start, end) => {
    const dates = [];
    let current = new Date(start);
    const endDate = new Date(end);
    while (current <= endDate) {
      dates.push(current.toLocaleDateString("en-CA")); // Local YYYY-MM-DD
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  // ✅ Filter guides who are available for ALL selected days
  const availableGuides = guides.filter((guide) => {
    const rangeDates = getDatesInRange(formData.startDate, formData.endDate);

    // Check if guide has all dates in their availability
    return rangeDates.every((date) =>
      guide.availability.some(
        (a) =>
          a.isAvailable &&
          new Date(a.date).toLocaleDateString("en-CA") === date
      )
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <Calendar className="mr-2 text-blue-500" /> Guide Scheduling
        </h1>

        {/* Dates */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            className="w-full border rounded-lg p-2"
            disabled={!isEditing}
          />
          {errors.startDate && (
            <p className="text-red-600 text-sm">{errors.startDate}</p>
          )}

          <label className="block text-sm font-medium mt-4 mb-1">End Date</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
            className="w-full border rounded-lg p-2"
            disabled={!isEditing}
          />
          {errors.endDate && (
            <p className="text-red-600 text-sm">{errors.endDate}</p>
          )}

          <p className="mt-2 text-gray-700">
            Duration: <strong>{totalDays}</strong> days
          </p>
        </div>

        {/* Guide selection */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2 flex items-center">
            <User className="mr-2 text-blue-500" /> Choose Guide
          </h2>
          <div className="space-y-2">
            {availableGuides.length > 0 ? (
              availableGuides.map((guide) => (
                <div
                  key={guide._id}
                  onClick={() =>
                    isEditing && handleInputChange("guideId", guide._id)
                  }
                  className={`p-3 border rounded-lg cursor-pointer ${
                    formData.guideId === guide._id
                      ? "border-blue-500 bg-blue-50"
                      : "hover:border-blue-300"
                  }`}
                >
                  <div className="flex justify-between">
                    <span>
                      {guide.userId.firstName} {guide.userId.lastName} –{" "}
                      {guide.expertise || "No expertise"}
                    </span>
                    <span className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      {guide.rating || 0}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No guides available for the full selected range.
              </p>
            )}
          </div>
          {errors.guideId && (
            <p className="text-red-600 text-sm">{errors.guideId}</p>
          )}
        </div>

        {/* Payment */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2 flex items-center">
            <DollarSign className="mr-2 text-green-500" /> Payment
          </h2>
          <label className="block text-sm font-medium mb-1">Daily Rate ($)</label>
          <input
            type="number"
            value={formData.paymentPerDay}
            onChange={(e) =>
              handleInputChange("paymentPerDay", Number(e.target.value))
            }
            className="w-full border rounded-lg p-2"
            disabled={!isEditing}
          />
          {errors.paymentPerDay && (
            <p className="text-red-600 text-sm">{errors.paymentPerDay}</p>
          )}

          <p className="mt-2 text-gray-700">
            Total Payment: <strong>${totalPayment}</strong>
          </p>
        </div>

        {/* Actions */}
        {isEditing ? (
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Confirm Booking
          </button>
        ) : (
          <p className="text-green-600 font-semibold">
            ✅ Booking saved successfully!
          </p>
        )}
      </div>
    </div>
  );
}
