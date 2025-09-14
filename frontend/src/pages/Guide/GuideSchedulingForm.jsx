import React, { useEffect, useState } from "react";
import {
  Calendar,
  User,
  DollarSign,
  Star,
} from "lucide-react";

export default function GuideAssignForm() {
  const [isEditing, setIsEditing] = useState(true);
  const [totalDays, setTotalDays] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [formData, setFormData] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    guideId: "",
    paymentPerDay: 150,
  });
  const [errors, setErrors] = useState({});

  // Dummy guide list (replace later with backend fetch)
  const [guides] = useState([
    {
      _id: "66e0d9e5b7f3c23b8c4b5678",
      name: "John Smith",
      expertise: "Mountain Trekking",
      availability: true,
      rating: 4.9,
    },
    {
      _id: "66e0d9e5b7f3c23b8c4b5679",
      name: "Sarah Johnson",
      expertise: "Cultural Heritage",
      availability: true,
      rating: 4.8,
    },
    {
      _id: "66e0d9e5b7f3c23b8c4b5680",
      name: "Mike Chen",
      expertise: "Wildlife Safari",
      availability: false,
      rating: 4.7,
    },
  ]);

  // Calculate days
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
    } catch (err) {
      console.error("❌ Error saving booking:", err);
    }
  };

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
            {guides.map((guide) => (
              <div
                key={guide._id}
                onClick={() =>
                  guide.availability &&
                  isEditing &&
                  handleInputChange("guideId", guide._id)
                }
                className={`p-3 border rounded-lg cursor-pointer ${
                  formData.guideId === guide._id
                    ? "border-blue-500 bg-blue-50"
                    : guide.availability
                    ? "hover:border-blue-300"
                    : "bg-gray-100 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="flex justify-between">
                  <span>{guide.name} – {guide.expertise}</span>
                  <span className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    {guide.rating}
                  </span>
                </div>
              </div>
            ))}
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
