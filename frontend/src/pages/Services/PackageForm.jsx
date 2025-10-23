import React, { useState, useEffect } from "react";
import {
  MapPin,
  Camera,
  Package,
  Star,
  Crown,
  Gem,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const TourPackageForm = () => {
  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState("");
  const [province, setProvince] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [prices, setPrices] = useState({ Standard: "", Premium: "", VIP: "" });
  const [tourDays, setTourDays] = useState({ Standard: "", Premium: "", VIP: "" });
  const [services, setServices] = useState({ Standard: "", Premium: "", VIP: "" });
  const [loading, setLoading] = useState(false);

  const { authState } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!authState.isAuthenticated) {
      alert("You must be logged in to create a tour package.");
      navigate("/login");
    }
  }, [authState.isAuthenticated, navigate]);

  const provinces = [
    "Western Province",
    "Central Province",
    "Southern Province",
    "Northern Province",
    "Eastern Province",
    "North Western Province",
    "North Central Province",
    "Uva Province",
    "Sabaragamuwa Province",
  ];

  const handlePriceChange = (e) =>
    setPrices({ ...prices, [e.target.name]: e.target.value });
  const handleTourDaysChange = (e) =>
    setTourDays({ ...tourDays, [e.target.name]: e.target.value });
  const handleServicesChange = (e) =>
    setServices({ ...services, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
//validations
    const userId = authState.user?._id || authState.user?.id;
    if (!userId) {
      alert("No user or user ID available. Please log in again.");
      return;
    }
//vallidations
    if (!serviceName || !category || !province || !description) {
      alert("Please fill in all required fields.");
      return;
    }
//vallidations
    const packageTypes = ["Standard", "Premium", "VIP"];
    for (let type of packageTypes) {
      if (!prices[type] || !tourDays[type] || !services[type]) {
        alert(`Please fill all fields for ${type} package.`);
        return;
      }
      const priceNum = Number(prices[type]);
      const daysNum = Number(tourDays[type]);
      if (isNaN(priceNum) || isNaN(daysNum) || priceNum <= 0 || daysNum <= 0) {
        alert(`${type} package must have valid positive price and tour days.`);
        return;
      }
    }

    //  CORRECT TIERED VALIDATION: Standard < Premium < VIP
    const stdPrice = Number(prices.Standard);
    const premPrice = Number(prices.Premium);
    const vipPrice = Number(prices.VIP);

    if (isNaN(stdPrice) || isNaN(premPrice) || isNaN(vipPrice)) {
      alert("All package prices must be valid numbers.");
      return;
    }

    if (!(stdPrice < premPrice && premPrice < vipPrice)) {
      alert(
        "Package prices must follow this order: Standard < Premium < VIP.\n" +
        `Current prices: Standard=${stdPrice}, Premium=${premPrice}, VIP=${vipPrice}`
      );
      return;
    }

    setLoading(true);

    try {
      const data = {
        providerId: userId,
        packageName: serviceName,
        category,
        province,
        description,
        image: image.trim(),
        packages: packageTypes.map((type) => ({
          packageType: type,
          price: Number(prices[type]),
          tourDays: Number(tourDays[type]),
          services: services[type],
        })),
      };

      const token = localStorage.getItem("token");
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      console.log("Submitting package data:", data);
      const res = await axios.post("http://localhost:5000/api/packages", data, config);

      alert("Tour package created successfully!");
      navigate("/dashboard/package-provider", { state: { newPackage: res.data } });

      // Reset form
      setServiceName("");
      setCategory("");
      setProvince("");
      setDescription("");
      setImage("");
      setPrices({ Standard: "", Premium: "", VIP: "" });
      setTourDays({ Standard: "", Premium: "", VIP: "" });
      setServices({ Standard: "", Premium: "", VIP: "" });
    } catch (err) {
      console.error("Error creating package:", err);
      alert(
        `Error: ${err.response?.data?.message || err.message || "Something went wrong"}`
      );
    } finally {
      setLoading(false);
    }
  };

  const packageTiers = [
    {
      name: "Standard",
      icon: Package,
      borderColor: "border-emerald-400",
      bgColor: "bg-emerald-50",
    },
    {
      name: "Premium",
      icon: Star,
      borderColor: "border-amber-400",
      bgColor: "bg-amber-50",
    },
    {
      name: "VIP",
      icon: Crown,
      borderColor: "border-purple-500",
      bgColor: "bg-purple-50",
    },
  ];

  if (!authState.isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 lg:p-8">
      <div className="relative max-w-7xl mx-auto">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 mb-10">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-600" /> Tour Package Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Cultural Heritage Tour"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Gem className="w-4 h-4 text-purple-600" /> Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3"
                  >
                    <option value="">Select Category</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Beach">Beach</option>
                    <option value="Culture">Culture</option>
                  </select>
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" /> Province *
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3"
                  >
                    <option value="">Select Province</option>
                    {provinces.map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-orange-600" /> Image URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/images/tour.jpg"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Package Description *
                  </label>
                  <textarea
                    placeholder="Describe your amazing tour package..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 h-32 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Tiers */}
            <div className="grid lg:grid-cols-3 gap-6">
              {packageTiers.map((tier) => {
                const IconComponent = tier.icon;
                return (
                  <div
                    key={tier.name}
                    className={`relative ${tier.bgColor} border-2 ${tier.borderColor} rounded-2xl p-6`}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-3">
                      {tier.name} Package
                    </h4>
                    <input
                      type="number"
                      name={tier.name}
                      placeholder="Price"
                      value={prices[tier.name]}
                      onChange={handlePriceChange}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 mb-2"
                    />
                    <input
                      type="number"
                      name={tier.name}
                      placeholder="Tour Days"
                      value={tourDays[tier.name]}
                      onChange={handleTourDaysChange}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 mb-2"
                    />
                    <textarea
                      name={tier.name}
                      placeholder="Services Included"
                      value={services[tier.name]}
                      onChange={handleServicesChange}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 h-24 resize-none"
                    />
                  </div>
                );
              })}
            </div>

            {/* Submit */}
            <div className="text-center mt-6">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`px-12 py-4 rounded-2xl font-bold text-white ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Creating Package..." : "Create Package"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourPackageForm;