import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, MapPin, Star, Sparkles, Mountain, Waves } from "lucide-react";

const PackageList = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/packages");
      setPackages(res.data);
    } catch (err) {
      console.error("Error fetching packages:", err);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'cultural': return <Star className="w-4 h-4" />;
      case 'adventure': return <Mountain className="w-4 h-4" />;
      case 'beach': return <Waves className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
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
      case 'standard': return 'from-blue-500 to-blue-600';
      case 'premium': return 'from-purple-500 to-purple-600';
      case 'vip': return 'from-amber-500 to-amber-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-100/30 to-purple-100/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-emerald-100/30 to-teal-100/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 lg:py-12">
        {/* Hero Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent mb-6 leading-tight">
            Travel Packages
          </h1>
          
          <p className="text-gray-600 text-lg lg:text-xl font-medium">
            Find the perfect tour package for your dream vacation.
          </p>
        </div>

        {packages.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-12 border border-gray-200 shadow-xl max-w-md mx-auto">
              <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No packages available.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8">
            {packages.map((pkg, index) => (
              <div
                key={pkg._id}
                className="group bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden border border-gray-200 shadow-lg hover:bg-white hover:border-gray-300 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-gray-300/50"
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                {/* Package Image */}
                <div className="relative h-48 lg:h-56 overflow-hidden">
                  {pkg.image ? (
                    <img 
                      src={pkg.image} 
                      alt={pkg.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getCategoryColor(pkg.category)} flex items-center justify-center`}>
                      {getCategoryIcon(pkg.category)}
                      <span className="ml-2 text-white font-medium">{pkg.category}</span>
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${getCategoryColor(pkg.category)} rounded-full px-3 py-1 shadow-lg`}>
                      {getCategoryIcon(pkg.category)}
                      <span className="text-white font-semibold text-xs">{pkg.category}</span>
                    </div>
                  </div>

                  {/* Province Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white/90">
                      <MapPin className="w-3 h-3" />
                      <span className="text-xs font-medium">{pkg.province}</span>
                    </div>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                </div>

                {/* Package Content */}
                <div className="p-6">
                  {/* Package Title */}
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors duration-300 line-clamp-2">
                    {pkg.name}
                  </h3>
                  
                  {/* Package Description */}
                  <p className="text-gray-600 text-sm lg:text-base leading-relaxed mb-6 line-clamp-3">
                    {pkg.description}
                  </p>

                  {/* Sub Packages */}
                  <div className="space-y-3 mb-6">
                    {pkg.subPackages && pkg.subPackages.length > 0 ? (
                      pkg.subPackages.map((sub, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-gray-50/80 backdrop-blur-sm rounded-xl p-3 border border-gray-200 hover:bg-gray-100/80 transition-all duration-300"
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 bg-gradient-to-r ${getSubPackageColor(sub.packageType)} rounded-full shadow-lg`}></div>
                            <span className="text-gray-800 font-medium text-sm">{sub.packageType}</span>
                          </div>
                          <span className="text-green-600 font-bold text-sm">Rs.{sub.price}</span>
                        </div>
                      ))
                    ) : null}
                  </div>

                  {/* View More Button */}
                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 group/button">
                    <Eye className="w-4 h-4 group-hover/button:scale-110 transition-transform duration-300" />
                    <span>View More</span>
                  </button>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100/0 via-purple-100/0 to-pink-100/0 group-hover:from-blue-100/10 group-hover:via-purple-100/10 group-hover:to-pink-100/10 rounded-3xl transition-all duration-500 pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default PackageList;