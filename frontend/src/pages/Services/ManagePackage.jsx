import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManagePackages = () => {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  // ✅ Get logged-in providerId dynamically (from auth/localStorage)
  const providerId = localStorage.getItem("providerId"); 
  // 👉 Make sure you save providerId in localStorage after login

  useEffect(() => {
    if (providerId) {
      fetchPackages();
    }
  }, [providerId]);

  const fetchPackages = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/packages/provider/${providerId}`
      );
      setPackages(res.data);
    } catch (err) {
      console.error("Error fetching packages:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/packages/${id}`);
      setPackages((prev) => prev.filter((pkg) => pkg._id !== id));
    } catch (err) {
      console.error("Error deleting package:", err);
    }
  };

  const handleEdit = (id) => {
    navigate(`/provider/edit-package/${id}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Your Packages</h2>

      {packages.length === 0 ? (
        <p className="text-gray-600">No packages created yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className="border p-4 rounded-xl shadow bg-white"
            >
              <img
                src={pkg.image || "https://via.placeholder.com/150"}
                alt={pkg.packageName}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h3 className="text-lg font-semibold">{pkg.packageName}</h3>
              <p className="text-sm text-gray-600">{pkg.description}</p>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEdit(pkg._id)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(pkg._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagePackages;
