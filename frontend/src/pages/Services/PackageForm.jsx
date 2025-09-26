import React, { useState } from 'react'
import {
  MapPin,
  Camera,
  Package,
  DollarSign,
  Globe,
  Star,
  Crown,
  Gem,
  Calendar,
  Briefcase,
} from 'lucide-react'
import axios from 'axios' // Make sure you have axios installed
//hold the values of the form fields.
const TourPackageForm = () => {
  const [serviceName, setServiceName] = useState('')
  const [category, setCategory] = useState('')
  const [province, setProvince] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [prices, setPrices] = useState({ Standard: '', Premium: '', VIP: '' })
  const [tourDays, setTourDays] = useState({ Standard: '', Premium: '', VIP: '' })
  const [services, setServices] = useState({ Standard: '', Premium: '', VIP: '' })
  const [loading, setLoading] = useState(false)

  const provinces = [
    'Western Province',
    'Central Province',
    'Southern Province',
    'Northern Province',
    'Eastern Province',
    'North Western Province',
    'North Central Province',
    'Uva Province',
    'Sabaragamuwa Province',
  ]

  const handlePriceChange = (e) => setPrices({ ...prices, [e.target.name]: e.target.value })
  const handleTourDaysChange = (e) => setTourDays({ ...tourDays, [e.target.name]: e.target.value })
  const handleServicesChange = (e) => setServices({ ...services, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Step 1: Validate main fields
    if (!serviceName || !category || !province || !description) {
      alert('Please fill in all required fields.')
      return
    }

    // Step 2: Validate all tiers
    const packageTypes = ['Standard', 'Premium', 'VIP']
    for (let type of packageTypes) {
      if (!prices[type] || !tourDays[type] || !services[type]) {
        alert(`Please fill all fields for ${type} package.`)
        return
      }
      if (Number(prices[type]) <= 0 || Number(tourDays[type]) <= 0) {
        alert(`${type} package must have positive price and tour days.`)
        return
      }
    }

    setLoading(true)

    try {
      // Step 3: Build single data object
      const data = {
        packageName: serviceName,
        category,
        province,
        description,
        image,
        packages: packageTypes.map((type) => ({
          packageType: type,
          price: Number(prices[type]),
          tourDays: Number(tourDays[type]),
          services: services[type],
        })),
      }

      // Step 4: Make API call to backend
      //await axios.post('/api/packages', data) // Replace with your backend route
await axios.post('http://localhost:5000/api/packages', data)

      alert('All three packages created successfully!')

      // Step 5: Reset form
      setServiceName('')
      setCategory('')
      setProvince('')
      setDescription('')
      setImage('')
      setPrices({ Standard: '', Premium: '', VIP: '' })
      setTourDays({ Standard: '', Premium: '', VIP: '' })
      setServices({ Standard: '', Premium: '', VIP: '' })
    } catch (err) {
      console.error('Error creating package:', err)
      alert(`Error creating package: ${err.response?.data?.message || err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const packageTiers = [
    {
      name: 'Standard',
      icon: Package,
      color: 'from-emerald-400 to-teal-600',
      borderColor: 'border-emerald-400',
      focusColor: 'focus:ring-emerald-400',
      bgColor: 'bg-emerald-50',
    },
    {
      name: 'Premium',
      icon: Star,
      color: 'from-amber-400 to-orange-600',
      borderColor: 'border-amber-400',
      focusColor: 'focus:ring-amber-400',
      bgColor: 'bg-amber-50',
    },
    {
      name: 'VIP',
      icon: Crown,
      color: 'from-purple-500 to-pink-600',
      borderColor: 'border-purple-500',
      focusColor: 'focus:ring-purple-400',
      bgColor: 'bg-purple-50',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 lg:p-8">
      {/* Form */}
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
                    placeholder="e.g., Magical Sri Lanka Adventure"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Gem className="w-4 h-4 text-purple-600" /> Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select Category</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Beach">Beach</option>
                    <option value="Cultural">Cultural</option>
                </select> 
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" /> Province/Location *
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
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
                    <Camera className="w-4 h-4 text-orange-600" /> Package Image URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/tour-image.jpg"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
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
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Tiers */}
            <div className="grid lg:grid-cols-3 gap-6">
              {packageTiers.map((tier) => {
                const IconComponent = tier.icon
                return (
                  <div key={tier.name} className={`relative ${tier.bgColor} border-2 ${tier.borderColor} rounded-2xl p-6`}>
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-3">{tier.name} Package</h4>
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
                )
              })}
            </div>

            {/* Submit */}
            <div className="text-center mt-6">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`px-12 py-4 rounded-2xl font-bold text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {loading ? 'Creating Packages...' : 'Create Packages'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TourPackageForm
