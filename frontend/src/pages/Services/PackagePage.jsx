import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapPin, Calendar, Star, Sparkles, Mountain, Waves } from "lucide-react";

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
    switch (category.toLowerCase()) {
      case 'cultural': return <Star className="w-5 h-5" />;
      case 'adventure': return <Mountain className="w-5 h-5" />;
      case 'beach': return <Waves className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'cultural': return 'from-amber-500 to-orange-600';
      case 'adventure': return 'from-emerald-500 to-teal-600';
      case 'beach': return 'from-blue-500 to-cyan-600';
      default: return 'from-purple-500 to-pink-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-emerald-600/20 to-teal-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 lg:py-12">
        {/* Hero Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-2 mb-6 border border-white/20">
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            <span className="text-white/90 font-medium">Premium Travel Experiences</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6 leading-tight">
            Travel Packages
          </h1>
        </div>

        {packages.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 max-w-md mx-auto">
              <Sparkles className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <p className="text-white/70 text-lg">No packages available.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 lg:gap-8">
            {packages.map((pkg, index) => (
              <div
                key={pkg._id}
                className="group bg-white/10 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/25"
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                {/* Package Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${getCategoryColor(pkg.category)} rounded-full px-4 py-2 shadow-lg`}>
                    {getCategoryIcon(pkg.category)}
                    <span className="text-white font-semibold text-sm">{pkg.category}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-white/60">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">{pkg.province}</span>
                  </div>
                </div>

                {/* Package Title & Description */}
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-blue-100 transition-colors duration-300">
                  {pkg.name}
                </h3>
                
                <p className="text-white/80 text-base lg:text-lg leading-relaxed mb-6">
                  {pkg.description}
                </p>

                <p className="text-white/60 mb-8 text-sm flex items-center gap-4 flex-wrap">
                  <span className="flex items-center gap-1">
                    <strong className="text-white/80">Category:</strong> {pkg.category}
                  </span>
                  <span className="text-white/40">|</span>
                  <span className="flex items-center gap-1">
                    <strong className="text-white/80">Province:</strong> {pkg.province}
                  </span>
                </p>

                {/* Sub Packages */}
                <div>
                  <h4 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                    Sub Packages:
                  </h4>
                  
                  {pkg.subPackages && pkg.subPackages.length > 0 ? (
                    <ul className="space-y-4">
                      {pkg.subPackages.map((sub, idx) => (
                        <li
                          key={idx}
                          className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 bg-gradient-to-r ${getCategoryColor(pkg.category)} rounded-full shadow-lg`}></div>
                              <strong className="text-white font-bold text-lg">{sub.packageType}</strong>
                              <span className="text-white/80">-</span>
                              <span className="text-green-400 font-bold text-lg">Rs.{sub.price}</span>
                              <span className="text-white/80">for</span>
                              <div className="flex items-center gap-1 text-blue-400">
                                <Calendar className="w-4 h-4" />
                                <span className="font-semibold">{sub.tourDays} days</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white/5 rounded-xl p-4 border border-white/10 mt-3">
                            <span className="text-white/70 text-sm leading-relaxed">
                              {sub.services}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
                      <p className="text-white/50 text-sm">No sub-packages available</p>
                    </div>
                  )}
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-pink-600/0 group-hover:from-blue-600/10 group-hover:via-purple-600/10 group-hover:to-pink-600/10 rounded-3xl transition-all duration-500 pointer-events-none"></div>
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
      `}</style>
    </div>
  );
};

export default PackageList;