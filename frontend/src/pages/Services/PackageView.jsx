import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Star,
  Sparkles,
  Mountain,
  Waves,
  Calendar,
  Package,
  Info,
} from "lucide-react";

const PackageView = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPackageDetails();
    // eslint-disable-next-line
  }, [packageId]);

  const fetchPackageDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/packages/${packageId}`);
      console.log("Package Data:", res.data);
      setPackageData(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching package details:", err.response || err);
      setError("Failed to load package details.");
    } finally {
      setLoading(false);
    }
  };

  // Match categories from TourPackageForm: "Culture", "Adventure", "Beach"
  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "culture":
        return <Star className="w-5 h-5" />;
      case "adventure":
        return <Mountain className="w-5 h-5" />;
      case "beach":
        return <Waves className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case "culture":
        return "from-amber-500 to-orange-600";
      case "adventure":
        return "from-emerald-500 to-teal-600";
      case "beach":
        return "from-blue-500 to-cyan-600";
      default:
        return "from-purple-500 to-pink-600";
    }
  };

  const getPackageTypeColor = (packageType) => {
    switch (packageType?.toLowerCase()) {
      case "standard":
        return "from-blue-500 to-blue-600";
      case "premium":
        return "from-purple-500 to-purple-600";
      case "vip":
        return "from-amber-500 to-amber-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const renderStars = (rating = 4.5) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < fullStars
                ? "fill-amber-400 text-amber-400"
                : i === fullStars && hasHalfStar
                ? "fill-amber-200 text-amber-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg max-w-md mx-auto text-center">
          <Sparkles className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Oops!</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg max-w-md mx-auto text-center">
          <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Package not found.</p>
          <button
            onClick={() => navigate("/packages")}
            className="mt-4 bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Packages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Packages
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Package Image & Category */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
              <div className="relative h-80 overflow-hidden">
                {packageData.image ? (
                  <img
                    src={packageData.image}
                    alt={packageData.packageName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-full h-full bg-gradient-to-br ${getCategoryColor(
                      packageData.category
                    )} flex items-center justify-center`}
                  >
                    {getCategoryIcon(packageData.category)}
                    <span className="ml-2 text-white font-medium text-2xl">
                      {packageData.category}
                    </span>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <div
                    className={`inline-flex items-center gap-2 bg-gradient-to-r ${getCategoryColor(
                      packageData.category
                    )} rounded-full px-4 py-2 shadow-lg`}
                  >
                    {getCategoryIcon(packageData.category)}
                    <span className="text-white font-semibold text-sm">
                      {packageData.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* About This Service */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                About This Service
              </h2>
              <div className="h-px bg-gray-200 mb-4"></div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {packageData.description}
              </p>
            </div>

            {/* Province Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Tour Details
              </h2>
              <div className="h-px bg-gray-200 mb-4"></div>
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Province:</span>
                <span>{packageData.province}</span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Tour Package Options
              </h2>
              <div className="h-px bg-gray-200 mb-4"></div>

              {packageData.packages && packageData.packages.length > 0 ? (
                packageData.packages.map((pkg, idx) => (
                  <div
                    key={idx}
                    className="mb-4 p-4 rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full bg-gradient-to-r ${getPackageTypeColor(
                            pkg.packageType
                          )}`}
                        ></div>
                        <span className="font-bold text-gray-800">
                          {pkg.packageType} Package
                        </span>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        Rs.{pkg.price}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      <div className="flex items-center gap-1 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span>{pkg.tourDays} Days</span>
                      </div>
                      <div className="mt-2">
                        <strong>Includes:</strong> {pkg.services}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No packages available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageView;