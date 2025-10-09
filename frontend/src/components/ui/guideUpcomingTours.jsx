import React, { useState, useEffect } from "react";

export function UpcomingTours({ tours = [] }) {
  const [filteredTours, setFilteredTours] = useState([]);

  useEffect(() => {
    // No filter needed, just show all tours
    setFilteredTours(tours);
  }, [tours]);

  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Tours</h2>

      {filteredTours.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 border-b">Title</th>
                <th className="text-left px-4 py-2 border-b">Place</th>
                <th className="text-left px-4 py-2 border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTours.map((tour, index) => (
                <tr
                  key={tour._id || index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-2 border-b">{tour.title || "N/A"}</td>
                  <td className="px-4 py-2 border-b">{tour.place || "N/A"}</td>
                  <td className="px-4 py-2 border-b">{formatDate(tour.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-md text-center">
          <p className="text-gray-500">No upcoming tours available.</p>
        </div>
      )}
    </div>
  );
}
