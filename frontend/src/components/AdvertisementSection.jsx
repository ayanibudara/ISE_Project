import React, { useState, useEffect } from "react";
import api from "../utils/api";

const AdvertisementSection = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true); // 🔹 Controls fade animation

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

  // 🔹 Auto-slide every 3 seconds with fade effect
  useEffect(() => {
    if (advertisements.length === 0) return;

    const interval = setInterval(() => {
      // Start fade out
      setFade(false);

      // After fade-out (400ms), change ad and fade in
      setTimeout(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === advertisements.length - 1 ? 0 : prevIndex + 1
        );
        setFade(true);
      }, 400);
    }, 3000);

    return () => clearInterval(interval);
  }, [advertisements]);

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

        {/* 🔹 Auto-sliding ad with fade/blur transition */}
        {advertisements.length > 0 && (
          <div className="relative max-w-6xl mx-auto">
            <div
              key={advertisements[currentIndex]?._id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-700 ${
                fade ? "opacity-100 blur-0" : "opacity-0 blur-sm"
              }`}
            >
              {/* Image */}
              <div className="relative w-full rounded-xl overflow-hidden">
                <img
                  src={`${api.defaults.baseURL}/uploads/${advertisements[currentIndex].image}`}
                  alt={advertisements[currentIndex].title}
                  className="w-full h-auto max-h-[500px] object-contain transition-all duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                {advertisements[currentIndex].title && (
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {advertisements[currentIndex].title}
                  </h3>
                )}

                <div className="flex justify-between items-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Advertisement
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(
                      advertisements[currentIndex].createdAt
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Optional: View More */}
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
