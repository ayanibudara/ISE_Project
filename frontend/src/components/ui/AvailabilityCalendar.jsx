import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { Calendar as CalendarIcon, Check, Trash2, AlertCircle, CheckCircle } from "lucide-react";

export function AvailabilityCalendar({ userId, onAvailabilityUpdated }) {
  const [availableDates, setAvailableDates] = useState([]); // all selected dates
  const [newDates, setNewDates] = useState([]); // dates being added now
  const [loading, setLoading] = useState(false);

  // ✅ Fetch guide availability on mount
  useEffect(() => {
    const fetchGuide = async () => {
      if (!userId) return;

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/guides/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data?.availability) {
          const dates = response.data.availability
            .filter((a) => a.isAvailable)
            .map((a) => new Date(a.date));
          setAvailableDates(dates);
        }
      } catch (err) {
        console.error("Error fetching guide availability:", err);
      }
    };

    fetchGuide();
  }, [userId]);

  // 🟢 Toggle date availability (only new dates)
  const toggleDateAvailability = (date) => {
    const dateStr = date.toDateString();

    // Don't allow toggling already existing dates
    if (availableDates.some((d) => d.toDateString() === dateStr)) return;

    // Toggle new dates
    setNewDates((prev) =>
      prev.some((d) => d.toDateString() === dateStr)
        ? prev.filter((d) => d.toDateString() !== dateStr)
        : [...prev, date]
    );
  };

  // 🟡 Highlight dates
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      if (availableDates.find((d) => d.toDateString() === date.toDateString())) {
        return "bg-green-400 text-white font-bold rounded-full"; // existing dates
      }
      if (newDates.find((d) => d.toDateString() === date.toDateString())) {
        return "bg-blue-300 text-blue-900 font-medium rounded-full"; // new dates
      }
    }
  };

  // ✅ Save new dates to backend
  const saveAvailability = async () => {
    if (!userId) return;

    if (newDates.length === 0) {
      alert("No new dates selected.");
      return;
    }

    const formattedDates = [
      ...availableDates.map((d) => ({ date: d.toISOString(), isAvailable: true })),
      ...newDates.map((d) => ({ date: d.toISOString(), isAvailable: true })),
    ];

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `http://localhost:5000/api/guides/user/${userId}/availability`,
        { availability: formattedDates },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update state
      if (res.data?.guide?.availability) {
        const updatedDates = res.data.guide.availability
          .filter((a) => a.isAvailable)
          .map((a) => new Date(a.date));
        setAvailableDates(updatedDates);
        setNewDates([]);
        if (onAvailabilityUpdated) onAvailabilityUpdated(res.data.guide.availability);
      }

      alert("Availability updated successfully ✅");
    } catch (err) {
      console.error("Error saving availability:", err);
      alert("Failed to update availability ❌");
    } finally {
      setLoading(false);
    }
  };

  const totalDates = availableDates.length + newDates.length;

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 rounded-2xl shadow-lg p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
            <CalendarIcon size={28} className="text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">
            Availability Calendar
          </h2>
        </div>
        <p className="text-slate-600 mt-2">Manage your available dates for tours</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar Section */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-blue-200">
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-slate-700 font-medium">How to use:</p>
                <p className="text-sm text-slate-600 mt-1">
                  <span className="inline-block w-3 h-3 bg-green-400 rounded-full mr-2"></span>
                  Green dates = Already available
                </p>
                <p className="text-sm text-slate-600">
                  <span className="inline-block w-3 h-3 bg-blue-300 rounded-full mr-2"></span>
                  Blue dates = New selections
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6 calendar-container">
            <style>{`
              .calendar-container .react-calendar {
                background: transparent;
                border: none;
                font-family: inherit;
              }
              .calendar-container .react-calendar__month-view__days__day {
                padding: 10px;
              }
              .calendar-container .react-calendar__tile {
                border-radius: 12px;
                padding: 8px;
                transition: all 0.2s;
              }
              .calendar-container .react-calendar__tile:hover:enabled {
                background-color: #f0f4ff;
                transform: scale(1.05);
              }
              .calendar-container .react-calendar__tile--now {
                background-color: #e0e7ff;
              }
              .calendar-container .react-calendar__navigation button {
                color: #1e293b;
                font-weight: 600;
              }
              .calendar-container .react-calendar__month-view__weekdays__weekday {
                color: #64748b;
                font-weight: 600;
                text-decoration: none;
              }
            `}</style>
            <Calendar
              onClickDay={toggleDateAvailability}
              tileClassName={tileClassName}
            />
          </div>

          <button
            onClick={saveAvailability}
            disabled={loading || newDates.length === 0}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Saving...
              </>
            ) : (
              <>
                <Check size={20} />
                Save Availability
              </>
            )}
          </button>
        </div>

        {/* List of Available Dates */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-purple-200">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Your Available Dates
            </h3>
            <div className="flex items-center gap-2">
              <CheckCircle size={20} className="text-green-600" />
              <p className="text-sm text-slate-600">
                {totalDates} date{totalDates !== 1 ? 's' : ''} selected
              </p>
            </div>
          </div>

          {availableDates.length + newDates.length > 0 ? (
            <div className="h-96 overflow-y-auto pr-2">
              <div className="space-y-2">
                {[...availableDates, ...newDates]
                  .sort((a, b) => a.getTime() - b.getTime())
                  .map((date, index) => {
                    const isNew = !availableDates.includes(date);
                    return (
                      <div
                        key={index}
                        className={`flex justify-between items-center p-4 rounded-lg border-2 transition-all ${
                          isNew
                            ? "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:border-blue-300"
                            : "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:border-green-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${isNew ? "bg-blue-500" : "bg-green-500"}`}></div>
                          <span className="text-slate-900 font-medium">
                            {date.toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          {isNew && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                              New
                            </span>
                          )}
                        </div>
                        {isNew && (
                          <button
                            onClick={() => toggleDateAvailability(date)}
                            className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all"
                            title="Remove this date"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50 rounded-lg border-2 border-dashed border-purple-200">
              <div className="text-center">
                <CalendarIcon size={48} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">No available dates selected yet</p>
                <p className="text-slate-400 text-sm mt-2">Click dates on the calendar to add availability</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Footer */}
      {totalDates > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-4 pt-8 border-t border-slate-200">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <p className="text-sm text-slate-600">Existing Dates</p>
            <p className="text-2xl font-bold text-green-600">{availableDates.length}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
            <p className="text-sm text-slate-600">New Dates</p>
            <p className="text-2xl font-bold text-blue-600">{newDates.length}</p>
          </div>
        </div>
      )}
    </div>
  );
};