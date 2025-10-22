// PackageList.jsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, MapPin, Star, Sparkles, Mountain, Waves, Search } from "lucide-react";

const PackageList = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState("");
  const [appliedProvince, setAppliedProvince] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const provinces = [
    "Northern Province",
    "North Central Province",
    "North Western Province",
    "Western Province",
    "Southern Province",
    "Sabaragamuwa Province",
    "Uva Province",
    "Central Province",
    "Eastern Province",
  ];

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/packages");
        setPackages(res.data || []);
      } catch (err) {
        console.error("Error fetching packages:", err);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const provinceFromUrl = params.get("province") || "";
    setSelectedProvinceFilter(provinceFromUrl);
    setAppliedProvince(provinceFromUrl);
  }, [location.search]);

  const handleSearch = () => {
    const clean = selectedProvinceFilter.trim();
    setAppliedProvince(clean);
    if (clean) {
      navigate(`/packages?province=${encodeURIComponent(clean)}`, { replace: true });
    } else {
      navigate("/packages", { replace: true });
    }
  };

  const filteredPackages = useMemo(() => {
    if (!appliedProvince) return packages;

    const query = appliedProvince.trim().toLowerCase();
    return packages.filter(pkg => {
      const pkgProvince = (pkg.province || "").trim().toLowerCase();
      return pkgProvince === query;
    });
  }, [packages, appliedProvince]);

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

  if (loading) {
    return (
      <div className="container px-4 py-20 mx-auto text-center">
        <div className="inline-block px-6 py-3 text-lg text-gray-600">Loading travel packages...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full rounded-full -top-1/2 -left-1/2 bg-gradient-to-r from-blue-100/30 to-purple-100/30 blur-3xl animate-pulse"></div>
        <div className="absolute w-full h-full delay-1000 rounded-full -bottom-1/2 -right-1/2 bg-gradient-to-l from-emerald-100/30 to-teal-100/30 blur-3xl animate-pulse"></div>
      </div>

      <div className="container relative z-10 px-4 py-8 mx-auto lg:py-12">
        <div className="mb-8 text-center lg:mb-10">
          <h1 className="mb-6 text-4xl font-bold leading-tight text-transparent lg:text-6xl xl:text-7xl bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text">
           {appliedProvince ? (
              `Packages in ${appliedProvince}`
            ) : (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700">
                Travel Packages
              </span>
            )}
             
          </h1>
          <p className="text-lg font-medium text-gray-600 lg:text-xl">
            {appliedProvince
              ? `Explore amazing tours in ${appliedProvince}.`
              : "Find the perfect tour package for your dream vacation."}
          </p>
        </div>

        <div className="w-full max-w-3xl mx-auto mb-12 bg-white p-4 rounded-lg shadow-lg">
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex items-center w-full md:w-3/4 mb-4 md:mb-0 md:mr-4">
              <MapPin className="text-[#1E3A8A] mr-2" size={24} aria-hidden="true" />
              <select
                value={selectedProvinceFilter}
                onChange={(e) => setSelectedProvinceFilter(e.target.value)}
                className="w-full p-2 focus:outline-none text-gray-700 bg-transparent"
                aria-label="Filter packages by province"
              >
                <option value="">Select a Province</option>
                {provinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleSearch}
              className="w-full md:w-1/4 bg-[#1E3A8A] text-white py-3 px-6 rounded-md flex items-center justify-center hover:bg-blue-900 transition-colors"
            >
              <Search size={20} className="mr-2" aria-hidden="true" />
              <span>Search</span>
            </button>
          </div>
        </div>

        {filteredPackages.length === 0 ? (
          <div className="py-20 text-center">
            <div className="max-w-md p-12 mx-auto border border-gray-200 shadow-xl bg-white/90 backdrop-blur-md rounded-3xl">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg text-gray-600">
                {appliedProvince
                  ? `No packages found in "${appliedProvince}".`
                  : "No packages available at the moment."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-8">
            {filteredPackages.map((pkg, index) => (
              <div
                key={pkg._id}
                className="relative overflow-hidden transition-all duration-500 bg-white border border-gray-100 shadow-md group rounded-2xl hover:shadow-2xl hover:border-gray-200"
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                <div className="relative h-56 overflow-hidden lg:h-64">
                  {pkg.image ? (
                    <>
                      <img 
                        src={pkg.image} 
                        alt={pkg.packageName}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 transition-opacity duration-300 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80"></div>
                    </>
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getCategoryColor(pkg.category)} flex items-center justify-center`}>
                      {getCategoryIcon(pkg.category)}
                      <span className="ml-2 font-medium text-white">{pkg.category}</span>
                    </div>
                  )}
                  
                  <div className="absolute top-3 left-3">
                    <div className={`inline-flex items-center gap-1.5 bg-gradient-to-r ${getCategoryColor(pkg.category)} rounded-full px-3 py-1.5 shadow-lg backdrop-blur-sm`}>
                      {getCategoryIcon(pkg.category)}
                      <span className="text-xs font-bold tracking-wide text-white uppercase">{pkg.category}</span>
                    </div>
                  </div>

                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-lg">
                      <MapPin className="w-3.5 h-3.5 text-gray-700" />
                      <span className="text-xs font-semibold text-gray-800">{pkg.province}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="mb-2 text-xl font-bold leading-tight text-gray-900 transition-colors duration-300 lg:text-2xl group-hover:text-blue-700 line-clamp-2">
                    {pkg.packageName}
                  </h3>
                  
                  <p className="mb-5 text-sm leading-relaxed text-gray-600 lg:text-base line-clamp-3">
                    {pkg.description}
                  </p>

                  <div className="mb-5 space-y-2.5">
                    {pkg.subPackages?.map((sub, idx) => (
                      <div
                        key={idx}
                        className="relative flex items-center justify-between p-3.5 overflow-hidden transition-all duration-300 border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-md group/sub"
                      >
                        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${getSubPackageColor(sub.packageType)}`}></div>
                        <div className="flex items-center gap-2.5 pl-2">
                          <div className={`w-8 h-8 bg-gradient-to-br ${getSubPackageColor(sub.packageType)} rounded-lg flex items-center justify-center shadow-sm`}>
                            <Star className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-semibold text-gray-800">{sub.packageType}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-medium text-gray-500">Starting from</span>
                          <span className="text-base font-bold text-green-600">Rs.{sub.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => navigate(`/packages/${pkg._id}`)}
                    style={{
                      background: 'linear-gradient(to right, #1E40AF, #2563EB)',
                    }}
                    className="flex items-center justify-center w-full gap-2 px-4 py-3.5 font-semibold text-white transition-all duration-300 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02]"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View More</span>
                  </button>
                </div>

                <div className="absolute top-0 right-0 w-32 h-32 transition-all duration-500 rounded-full opacity-0 -mt-16 -mr-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl group-hover:opacity-100"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
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