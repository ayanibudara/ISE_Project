import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, MapPin, Star, Sparkles, Mountain, Waves, Calendar, Package, Mail, User, Info } from "lucide-react";

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
      setPackageData(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching package details:", err);
      setError("Failed to load package details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'cultural': return <Star className="w-5 h-5" />;
      case 'adventure': return <Mountain className="w-5 h-5" />;
      case 'beach': return <Waves className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'cultural': return 'from-amber-500 to-orange-600';
      case 'adventure': return 'from-emerald-500 to-teal-600';
      case 'beach': return 'from-blue-500 to-cyan-600';
      default: return 'from-purple-500 to-pink-600';
    }
  };

  const getSubPackageColor = (packageType) => {
    switch (packageType?.toLowerCase()) {
      case 'standard': return 'border-blue-200 bg-blue-50';
      case 'premium': return 'border-purple-200 bg-purple-50';
      case 'vip': return 'border-amber-200 bg-amber-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getSubPackageBadgeColor = (packageType) => {
    switch (packageType?.toLowerCase()) {
      case 'standard': return 'bg-blue-600';
      case 'premium': return 'bg-purple-600';
      case 'vip': return 'bg-amber-600';
      default: return 'bg-gray-600';
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
                ? 'fill-amber-400 text-amber-400'
                : i === fullStars && hasHalfStar
                ? 'fill-amber-200 text-amber-400'
                : 'text-gray-300'
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
            onClick={() => navigate('/packages')}
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

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Package Image Card */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
              <div className="relative h-80 overflow-hidden">
                {packageData.image ? (
                  <img 
                    src={packageData.image} 
                    alt={packageData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${getCategoryColor(packageData.category)} flex items-center justify-center`}>
                    {getCategoryIcon(packageData.category)}
                    <span className="ml-2 text-white font-medium text-2xl">{packageData.category}</span>
                  </div>
                )}
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${getCategoryColor(packageData.category)} rounded-full px-4 py-2 shadow-lg`}>
                    {getCategoryIcon(packageData.category)}
                    <span className="text-white font-semibold text-sm">{packageData.category}</span>
                  </div>
                </div>

                {/* Province Badge */}
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
                    <MapPin className="w-4 h-4 text-gray-700" />
                    <span className="font-medium text-gray-700">{packageData.province}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* About This Service Card */}
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

            {/* Package Provider Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Package Provider
              </h2>
              <div className="h-px bg-gray-200 mb-4"></div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {packageData.providerName?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{packageData.providerName || 'Travel Agency'}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{packageData.providerEmail || 'contact@travelagency.com'}</span>
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  {renderStars(packageData.rating || 4.5)}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - 1/3 width */}
          <div className="space-y-6">
            
            {/* Package Title Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {packageData.name}
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{packageData.province}</span>
              </div>
            </div>

            {/* Tour Package Options Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Tour Package
              </h2>
              <div className="h-px bg-gray-200 mb-4"></div>
              
              <div className="space-y-4">
                {packageData.packages && packageData.packages.map((sub, idx) => (
                  <div 
                    key={idx}
                    className={`border-2 ${getSubPackageColor(sub.packageType)} rounded-xl p-4 transition-all hover:shadow-md`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={`inline-block ${getSubPackageBadgeColor(sub.packageType)} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                        {sub.packageType}
                      </span>
                      <span className="text-2xl font-bold text-red-600">Rs.{sub.price}</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>{sub.tourDays} Days Tour</span>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Services Included:</h4>
                        <ul className="space-y-1">
                          {sub.services && (
                            Array.isArray(sub.services)
                              ? sub.services
                              : sub.services.split('\n')
                          ).map((service, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                              <span className="text-sm">{service}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Book Appointment Button */}
              <button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg">
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageView;