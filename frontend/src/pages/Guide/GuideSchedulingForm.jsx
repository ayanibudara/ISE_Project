import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Calendar,
  User,
  DollarSign,
  ClipboardCheck,
  Pencil,
} from "lucide-react";
import { format, differenceInDays, addDays } from "date-fns";

export default function GuideAssignForm() {
  const [isEditing, setIsEditing] = useState(true);
  const [totalDays, setTotalDays] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  // ✅ Mock data (replace with API calls if needed)
  const [guides] = useState([
    {
      _id: "66e0d9e5b7f3c23b8c4b5678",
      name: "John Smith",
      expertise: "Mountain Trekking",
      availability: true,
    },
    {
      _id: "66e0d9e5b7f3c23b8c4b5679",
      name: "Sarah Johnson",
      expertise: "Historical Tours",
      availability: true,
    },
  ]);

  const [packages] = useState([
    { _id: "66e0d9e5b7f3c23b8c4b1234", name: "Sri Lanka Adventure" },
    { _id: "66e0d9e5b7f3c23b8c4b1235", name: "Cultural Heritage Tour" },
  ]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      packageId: "",
      travellerName: "",
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: format(addDays(new Date(), 5), "yyyy-MM-dd"),
      guideId: "",
      paymentPerDay: 150,
    },
  });

  const watchStartDate = watch("startDate");
  const watchEndDate = watch("endDate");
  const watchPaymentPerDay = watch("paymentPerDay");

  // ✅ Calculate total days
  useEffect(() => {
    if (watchStartDate && watchEndDate) {
      const days =
        differenceInDays(new Date(watchEndDate), new Date(watchStartDate)) + 1;
      setTotalDays(days > 0 ? days : 0);
    }
  }, [watchStartDate, watchEndDate]);

  // ✅ Calculate total payment
  useEffect(() => {
    setTotalPayment(totalDays * (watchPaymentPerDay || 0));
  }, [totalDays, watchPaymentPerDay]);

  // ✅ Submit handler
  const onSubmit = async (data) => {
    const payload = {
      packageId: data.packageId, // from select
      travellerName: data.travellerName,
      guideId: data.guideId, // from select
      startDate: data.startDate,
      endDate: data.endDate,
      totalDays,
      paymentPerDay: data.paymentPerDay,
      totalPayment,
      status: "Assigned",
    };

    try {
      const res = await fetch("http://localhost:5000/api/guideassign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to save booking: ${errText}`);
      }

      const result = await res.json();
      console.log("✅ Saved:", result);
      setIsEditing(false);
      reset(); // clear form
    } catch (err) {
      console.error("❌ Error saving booking:", err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* Traveller Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Traveller Name
            </label>
            <input
              type="text"
              {...register("travellerName", {
                required: "Traveller name is required",
              })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
              disabled={!isEditing}
            />
            {errors.travellerName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.travellerName.message}
              </p>
            )}
          </div>

          {/* Package Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Package
            </label>
            <select
              {...register("packageId", { required: "Please select a package" })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
              disabled={!isEditing}
            >
              <option value="">Select a package...</option>
              {packages.map((pkg) => (
                <option key={pkg._id} value={pkg._id}>
                  {pkg.name}
                </option>
              ))}
            </select>
            {errors.packageId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.packageId.message}
              </p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <Controller
                name="startDate"
                control={control}
                rules={{ required: "Start date is required" }}
                render={({ field }) => (
                  <input
                    type="date"
                    {...field}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 pl-2"
                    disabled={!isEditing}
                  />
                )}
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <Controller
                name="endDate"
                control={control}
                rules={{ required: "End date is required" }}
                render={({ field }) => (
                  <input
                    type="date"
                    {...field}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 pl-2"
                    disabled={!isEditing}
                  />
                )}
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          {/* Total Days */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Days
            </label>
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <span className="text-lg font-medium">
                {totalDays} {totalDays === 1 ? "day" : "days"}
              </span>
            </div>
          </div>

          {/* Guide Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Guide
            </label>
            <select
              {...register("guideId", { required: "Please select a guide" })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
              disabled={!isEditing}
            >
              <option value="">Select a guide...</option>
              {guides.map((guide) => (
                <option
                  key={guide._id}
                  value={guide._id}
                  disabled={!guide.availability}
                >
                  {guide.name} - {guide.expertise}{" "}
                  {!guide.availability && "(Unavailable)"}
                </option>
              ))}
            </select>
            {errors.guideId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.guideId.message}
              </p>
            )}
          </div>

          {/* Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payment per day */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Per Day ($)
              </label>
              <input
                type="number"
                {...register("paymentPerDay", {
                  required: "Payment amount is required",
                  min: { value: 1, message: "Payment must be greater than 0" },
                })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 pl-2"
                disabled={!isEditing}
              />
              {errors.paymentPerDay && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.paymentPerDay.message}
                </p>
              )}
            </div>

            {/* Total Payment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Payment ($)
              </label>
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <span className="text-lg font-medium">
                  ${totalPayment.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            {isEditing ? (
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <ClipboardCheck className="h-4 w-4 mr-2" />
                Confirm Booking
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit Booking
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
