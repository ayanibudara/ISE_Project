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
  MapPin,
  User,
  Mail,
  Phone,
} from "lucide-react";
import Reviews from "../Review/Reviews";

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
      let data = res.data;
      if (Array.isArray(data) && data.length > 0) {
        data = data[0];
      }
      setPackageData(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching package details:", err.response || err);
      setError("Failed to load package details.");
    } finally {
      setLoading(false);
    }
  };

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
        return "bg-blue-500";
      case "premium":
        return "bg-purple-500";
      case "vip":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block w-16 h-16 mb-4 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
          <p className="font-medium text-gray-600">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-md p-8 mx-auto text-center bg-white border border-red-100 shadow-2xl rounded-3xl">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full">
            <Sparkles className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="mb-2 text-2xl font-bold text-gray-900">Oops!</h3>
          <p className="mb-6 text-gray-600">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-8 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-md p-8 mx-auto text-center bg-white border border-gray-200 shadow-2xl rounded-3xl">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full">
            <Sparkles className="w-10 h-10 text-gray-400" />
          </div>
          <p className="mb-6 text-gray-600">Package not found.</p>
          <button
            onClick={() => navigate("/packages")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-8 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Browse Packages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 font-semibold text-gray-600 transition-all duration-200 hover:text-blue-600 group"
        >
          <ArrowLeft className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to Packages
        </button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Package Image & Category */}
            <div className="overflow-hidden bg-white border border-gray-100 shadow-xl rounded-3xl">
              <div className="relative overflow-hidden h-96 group">
                {packageData.image ? (
                  <img
                    src={packageData.image}
                    alt={packageData.packageName}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                ) : ( // ✅ FIXED: Changed "else" to ":"
                  <div
                    className={`w-full h-full bg-gradient-to-br ${getCategoryColor(
                      packageData.category
                    )} flex items-center justify-center`}
                  >
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(packageData.category)}
                      <span className="text-3xl font-bold text-white">
                        {packageData.category}
                      </span>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Category Badge */}
                <div className="absolute top-6 left-6">
                  <div
                    className={`inline-flex items-center gap-2 bg-gradient-to-r ${getCategoryColor(
                      packageData.category
                    )} rounded-full px-5 py-2.5 shadow-2xl backdrop-blur-sm`}
                  >
                    {getCategoryIcon(packageData.category)}
                    <span className="text-sm font-bold text-white">
                      {packageData.category}
                    </span>
                  </div>
                </div>

                {/* Province Badge */}
                {packageData.province && (
                  <div className="absolute top-6 right-6">
                    <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-full px-5 py-2.5 shadow-2xl">
                      <MapPin className="w-5 h-5 text-red-500" />
                      <span className="text-sm font-bold text-gray-900">
                        {packageData.province}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  {packageData.packageName}
                </h1>
              </div>
            </div>

            {/* About This Service */}
            <div className="p-8 bg-white border border-gray-100 shadow-xl rounded-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-xl">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  About This Service
                </h2>
              </div>
              <div className="h-px mb-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
              <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">
                {packageData.description}
              </p>
            </div>

 </div>
            {/* ✅ Provider Information 


            {/* REVIEWS SECTION */}
            <div className="p-8 bg-white border border-gray-100 shadow-xl rounded-3xl">
             
              <Reviews packageId={packageId} />
            </div>

            {/* Provider Information
            {packageData.providerId && (
              <div className="p-8 border border-indigo-100 shadow-xl bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl">
                <div className="h-px mb-6 bg-gradient-to-r from-indigo-200 via-blue-300 to-indigo-200"></div>

                <div className="space-y-4">




                  {/* Provider Name */}
                  

                  {/* Provider Email 

                  {/* Provider Email */}

                  {packageData.providerId.email && (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Provider Email Address</p>
                        <p className="text-lg font-semibold text-blue-600">
                          {packageData.providerId.email}
                        </p>
                      </div>
                    </div>
                  )}
                  {/* Provider Phone 
                  {packageData.providerId.mobile && (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Phone Number</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {packageData.providerId.mobile}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
*/}
          {/* Right Column */}
          <div className="space-y-6">
            <div className="sticky p-8 bg-white border border-gray-100 shadow-xl rounded-3xl top-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-xl">
                  <Package className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Package Options
                </h2>
              </div>
              <div className="h-px mb-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>

              {packageData.packages && packageData.packages.length > 0 ? (
                <div className="space-y-4">
                  {packageData.packages.map((pkg, idx) => (
                    <div
                      key={idx}
                      className="p-5 transition-all duration-300 border-2 border-gray-200 group rounded-2xl hover:border-blue-400 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${getPackageTypeColor(
                              pkg.packageType
                            )} shadow-lg`}
                          ></div>
                          <span className="text-lg font-bold text-gray-900">
                            {pkg.packageType}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            Rs.{pkg.price}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">{pkg.tourDays} Days Tour</span>
                        </div>
                        <div className="pt-3 mt-3 border-t border-gray-200">
                          <p className="mb-2 text-sm font-semibold text-gray-700">
                            Includes:
                          </p>
                          <div className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">
                            {pkg.services}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-gray-500">No packages available.</p>
              )}

              {/* Action Buttons */}
              <div className="pt-6 mt-8 space-y-4 border-t border-gray-200">
                {/* Book Appointment Button */}
                <button
                  onClick={() => navigate(`/apform/${packageId}`)}
                  className="flex items-center justify-center w-full gap-2 px-8 py-4 font-bold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl hover:shadow-2xl hover:scale-105"
                >
                  <Calendar className="w-5 h-5" />
                  Book Now
                </button>

                {/* Add Review Button */}
                <button
                  onClick={() => navigate(`/reviewform/${packageId}`)}
                  className="flex items-center justify-center w-full gap-2 px-8 py-4 font-bold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl hover:shadow-2xl hover:scale-105"
                >
                  <Star className="w-5 h-5" />
                  Add Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageView;