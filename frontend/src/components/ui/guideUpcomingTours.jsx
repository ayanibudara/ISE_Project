import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, User, DollarSign, MapPin, Clock } from "lucide-react";

export function UpcomingTours({ userId, guideId }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      console.log("🔍 Fetching assignments for guideId:", guideId);
      
      if (!guideId) {
        console.log("⚠️ No guideId provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/guideassign/guide/${guideId}`
        );
        console.log("✅ Assignments fetched:", response.data);
        setAssignments(response.data || []);
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching assignments:", err);
        setError("Failed to load upcoming tours");
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [guideId]);

  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Assigned":
        return "bg-blue-100 text-blue-800";
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading tours...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Upcoming Tours
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 border-b font-semibold text-gray-700">
                Title
              </th>
              <th className="text-left px-4 py-2 border-b font-semibold text-gray-700">
                Place
              </th>
              <th className="text-left px-4 py-2 border-b font-semibold text-gray-700">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {assignments.length > 0 ? (
              assignments.map((assignment, index) => {
                // ✅ Extract Title: "Tour with [Tourist Name]" or package name
                let title = 'Tour Assignment';
                if (assignment.touristId?.firstName && assignment.touristId?.lastName) {
                  const touristName = `${assignment.touristId.firstName} ${assignment.touristId.lastName}`;
                  title = `Tour with ${touristName}`;
                } else if (assignment.appointmentId?.packageId?.packageName) {
                  title = assignment.appointmentId.packageId.packageName;
                }
                
                // ✅ Extract Place: Location from assignment or appointment (using province field)
                let place = 'N/A';
                if (assignment.location) {
                  // If location is set directly on assignment
                  place = assignment.location;
                } else if (assignment.appointmentId?.packageId?.province) {
                  // Use province from package
                  place = assignment.appointmentId.packageId.province;
                }
                
                // ✅ Extract Date: Start date formatted
                const date = assignment.startDate ? formatDate(assignment.startDate) : 'N/A';

                console.log(`📋 Row ${index + 1}:`, { 
                  title, 
                  place, 
                  date,
                  rawAssignment: assignment,
                  touristId: assignment.touristId,
                  packageId: assignment.appointmentId?.packageId
                });

                return (
                  <tr
                    key={assignment._id || index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2 border-b text-gray-800">
                      {title}
                    </td>
                    <td className="px-4 py-2 border-b text-gray-800">
                      {place}
                    </td>
                    <td className="px-4 py-2 border-b text-gray-800">
                      {date}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                  No upcoming tours available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
