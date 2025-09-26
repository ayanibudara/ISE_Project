import React, { useState, useEffect } from "react";
import api from "../utils/api";

const AdvertisementSection = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch active advertisements
  const fetchAdvertisements = async () => {
    try {
      const response = await api.get("/api/advertisements/active");

      if (response.data.success && response.data.data.length > 0) {
        setAdvertisements(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching advertisements:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  // Don't render if no advertisements or loading
  if (loading || advertisements.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">
            Featured Advertisements
          </h2>
          <p className="text-gray-600 mt-2">
            Discover amazing opportunities and special offers
          </p>
        </div>

        {/* Cards Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {advertisements.map((ad, index) => (
            <div
              key={ad._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative aspect-w-16 aspect-h-10">
                <img
                  src={`${api.defaults.baseURL}/uploads/${ad.image}`}
                  alt={ad.title}
                  className="w-full h-48 object-cover"
                />
                {/* Overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                {ad.title && ad.title !== "Advertisement" && (
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {ad.title}
                  </h3>
                )}

                {/* Advertisement Badge */}
                <div className="flex justify-between items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Advertisement
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(ad.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show more button if there are many advertisements */}
        {advertisements.length > 8 && (
          <div className="text-center mt-10">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
              View More Advertisements
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdvertisementSection;
