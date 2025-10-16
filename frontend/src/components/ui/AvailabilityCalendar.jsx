import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";

export function AvailabilityCalendar({ userId, onAvailabilityUpdated }) {
  const [availableDates, setAvailableDates] = useState([]); // all selected dates
  const [newDates, setNewDates] = useState([]); // dates being added now

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
        return "bg-green-200 text-green-800 font-medium rounded-full"; // new dates
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
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Availability Calendar
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar Section */}
        <div>
          <div className="mb-4">
            <p className="text-gray-600 mb-4">
              Green-filled dates are already marked as available. Click on empty
              dates to add new availability.
            </p>
          </div>
          <Calendar
            onClickDay={toggleDateAvailability}
            tileClassName={tileClassName}
            className="border-0 shadow-none"
          />
          <button
            onClick={saveAvailability}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Save Availability
          </button>
        </div>

        {/* List of Available Dates */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Your Available Dates
          </h3>
          {availableDates.length + newDates.length > 0 ? (
            <div className="bg-gray-50 p-4 rounded-md h-80 overflow-y-auto">
              <ul className="space-y-2">
                {[...availableDates, ...newDates]
                  .sort((a, b) => a.getTime() - b.getTime())
                  .map((date, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm"
                    >
                      <span>
                        {date.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      {!availableDates.includes(date) && (
                        <button
                          onClick={() => toggleDateAvailability(date)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          ) : (
            <div className="bg-gray-50 p-8 rounded-md flex items-center justify-center h-80">
              <p className="text-gray-500 text-center">
                No available dates selected yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
