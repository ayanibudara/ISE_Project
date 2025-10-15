import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, MapPin, Star, Sparkles, Mountain, Waves } from "lucide-react";

const PackageList = () => {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full rounded-full -top-1/2 -left-1/2 bg-gradient-to-r from-blue-100/30 to-purple-100/30 blur-3xl animate-pulse"></div>
        <div className="absolute w-full h-full delay-1000 rounded-full -bottom-1/2 -right-1/2 bg-gradient-to-l from-emerald-100/30 to-teal-100/30 blur-3xl animate-pulse"></div>
      </div>

      <div className="container relative z-10 px-4 py-8 mx-auto lg:py-12">
        {/* Hero Header */}
        <div className="mb-12 text-center lg:mb-16">
          <h1 className="mb-6 text-4xl font-bold leading-tight text-transparent lg:text-6xl xl:text-7xl bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text">
            Travel Packages
          </h1>
          
          <p className="text-lg font-medium text-gray-600 lg:text-xl">
            Find the perfect tour package for your dream vacation.
          </p>
        </div>

        {packages.length === 0 ? (
          <div className="py-20 text-center">
            <div className="max-w-md p-12 mx-auto border border-gray-200 shadow-xl bg-white/90 backdrop-blur-md rounded-3xl">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg text-gray-600">No packages available.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-8">
            {packages.map((pkg, index) => (
              <div
                key={pkg._id}
                className="overflow-hidden transition-all duration-500 border border-gray-200 shadow-lg group bg-white/90 backdrop-blur-xl rounded-3xl hover:bg-white hover:border-gray-300 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-gray-300/50"
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                {/* Package Image */}
                <div className="relative h-48 overflow-hidden lg:h-56">
                  {pkg.image ? (
                    <img 
                      src={pkg.image} 
                      alt={pkg.packageName}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getCategoryColor(pkg.category)} flex items-center justify-center`}>
                      {getCategoryIcon(pkg.category)}
                      <span className="ml-2 font-medium text-white">{pkg.category}</span>
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${getCategoryColor(pkg.category)} rounded-full px-3 py-1 shadow-lg`}>
                      {getCategoryIcon(pkg.category)}
                      <span className="text-xs font-semibold text-white">{pkg.category}</span>
                    </div>
                  </div>

                  {/* Province Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white/90">
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
                  <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors duration-300 lg:text-2xl group-hover:text-gray-700 line-clamp-2">
                    {pkg.packageName}
                  </h3>
                  
                  {/* Package Description */}
                  <p className="mb-6 text-sm leading-relaxed text-gray-600 lg:text-base line-clamp-3">
                    {pkg.description}
                  </p>

                  {/* Sub Packages */}
                  <div className="mb-6 space-y-3">
                    {pkg.subPackages && pkg.subPackages.length > 0 ? (
                      pkg.subPackages.map((sub, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 transition-all duration-300 border border-gray-200 bg-gray-50/80 backdrop-blur-sm rounded-xl hover:bg-gray-100/80"
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 bg-gradient-to-r ${getSubPackageColor(sub.packageType)} rounded-full shadow-lg`}></div>
                            <span className="text-sm font-medium text-gray-800">{sub.packageType}</span>
                          </div>
                          <span className="text-sm font-bold text-green-600">Rs.{sub.price}</span>
                        </div>
                      ))
                    ) : null}
                  </div>

                  {/* View More Button */}
                  <button
                    onClick={() => navigate(`/packages/${pkg._id}`)}
                    className="flex items-center justify-center w-full gap-2 px-4 py-3 font-semibold text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl hover:shadow-lg hover:shadow-blue-500/25"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View More</span>
                  </button>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 transition-all duration-500 pointer-events-none bg-gradient-to-r from-blue-100/0 via-purple-100/0 to-pink-100/0 group-hover:from-blue-100/10 group-hover:via-purple-100/10 group-hover:to-pink-100/10 rounded-3xl"></div>
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