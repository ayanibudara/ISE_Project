import React, { useState } from 'react';
import { MapPin, Camera, Package, DollarSign, Globe, Star, Crown, Gem } from 'lucide-react';

const TourPackageForm = () => {
  const [serviceName, setServiceName] = useState('');
  const [category, setCategory] = useState('');
  const [province, setProvince] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [prices, setPrices] = useState({ Standard: '', Premium: '', VIP: '' });
  const [loading, setLoading] = useState(false);

  const handlePriceChange = (e) => {
    setPrices({ ...prices, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!serviceName || !category || !province || !description) {
      alert('Please fill in all required fields.');
      return;
    }
    if (!prices.Standard || !prices.Premium || !prices.VIP) {
      alert('Please enter prices for all three packages.');
      return;
    }

    setLoading(true);

    try {
      const packageTypes = ['Standard', 'Premium', 'VIP'];

      for (let type of packageTypes) {
        const priceValue = Number(prices[type]);
        if (isNaN(priceValue) || priceValue <= 0) {
          alert(`${type} price must be a positive number`);
          setLoading(false);
          return;
        }

        const data = {
          packageName: serviceName,
          category,
          province,
          description,
          image,
          packageType: type,
          price: priceValue,
        };

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      alert('All three packages created successfully!');
      setServiceName('');
      setCategory('');
      setProvince('');
      setDescription('');
      setImage('');
      setPrices({ Standard: '', Premium: '', VIP: '' });
    } catch (err) {
      console.error('Error:', err);
      alert(`Error creating packages: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const packageTiers = [
    {
      name: 'Standard',
      icon: Package,
      color: 'from-emerald-400 to-teal-600',
      borderColor: 'border-emerald-400',
      focusColor: 'focus:ring-emerald-400',
      bgColor: 'bg-emerald-50'
    },
    {
      name: 'Premium',
      icon: Star,
      color: 'from-amber-400 to-orange-600',
      borderColor: 'border-amber-400',
      focusColor: 'focus:ring-amber-400',
      bgColor: 'bg-amber-50'
    },
    {
      name: 'VIP',
      icon: Crown,
      color: 'from-purple-500 to-pink-600',
      borderColor: 'border-purple-500',
      focusColor: 'focus:ring-purple-400',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 lg:p-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}   

        {/* Main Form Container */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-8 lg:p-12">
            
            {/* Basic Information Section */}
            <div className="grid lg:grid-cols-2 gap-8 mb-10">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-600" />
                    Tour Package Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Magical Sri Lanka Adventure"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-blue-300"
                    required
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Gem className="w-4 h-4 text-purple-600" />
                    Category *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Cultural, Adventure, Beach"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-purple-300"
                    required
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    Province/Location *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Western Province"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-emerald-300"
                    required
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-orange-600" />
                    Package Image URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/tour-image.jpg"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-orange-300"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Package Description *
                  </label>
                  <textarea
                    placeholder="Describe your amazing tour package experience..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm h-32 resize-none group-hover:border-blue-300"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="mb-10">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                  <DollarSign className="w-6 h-6 text-green-600" />
                  Package Pricing Tiers
                </h3>
                <p className="text-gray-600">Set competitive prices for different experience levels</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {packageTiers.map((tier) => {
                  const IconComponent = tier.icon;
                  return (
                    <div
                      key={tier.name}
                      className={`relative group ${tier.bgColor} border-2 ${tier.borderColor} rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300" style={{background: `linear-gradient(to bottom right, ${tier.color.split(' ')[1]}, ${tier.color.split(' ')[3]})`}}></div>
                      
                      <div className="relative z-10">
                        <div className={`w-12 h-12 bg-gradient-to-r ${tier.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        
                        <h4 className="text-xl font-bold text-gray-800 mb-3">{tier.name} Package</h4>
                        
                        <div className="relative">
                          <input
                            type="number"
                            name={tier.name}
                            placeholder={`${tier.name} Price (LKR)`}
                            value={prices[tier.name]}
                            onChange={handlePriceChange}
                            className={`w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ${tier.focusColor} focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm text-lg font-semibold`}
                            required
                          />
                          <div className="absolute right-3 top-3 text-gray-400 font-medium">LKR</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                onClick={handleSubmit}
                className={`relative inline-flex items-center gap-3 px-12 py-4 rounded-2xl text-lg font-bold text-white transition-all duration-300 transform hover:scale-105 ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 hover:shadow-2xl hover:shadow-purple-500/25'
                }`}
              >
                {loading && (
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                )}
                <span>{loading ? 'Creating Your Packages...' : 'Create Tour Packages'}</span>
                {!loading && <Globe className="w-5 h-5" />}
                
                {!loading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                )}
              </button>
              
              <p className="text-sm text-gray-500 mt-4">
                This will create three package variants: Standard, Premium, and VIP
              </p>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default TourPackageForm;