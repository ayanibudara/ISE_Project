import React, { memo } from 'react'
import {
  MapPinIcon,
  UsersIcon,
  HeartIcon,
  AwardIcon,
  CompassIcon,
  ShieldCheckIcon,
} from 'lucide-react'

export function AboutUs() {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[500px] bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/30"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.08) 0%, transparent 50%)',
          }}
        ></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-[60px] md:text-[80px] font-bold bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Pearl Pathways
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl font-medium">
            Your Gateway to Sri Lanka's Hidden Treasures
          </p>
          <p className="text-xl text-gray-600 mt-4 max-w-2xl">
            Connecting travelers with authentic experiences across the Pearl of
            the Indian Ocean
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              At Pearl Pathways, we're dedicated to revolutionizing how
              travelers experience Sri Lanka. Our platform connects tourists
              with expert local guides who bring the island's rich culture,
              stunning landscapes, and hidden gems to life.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              We believe that every journey should be more than just a trip—it
              should be a transformative experience that creates lasting
              memories and meaningful connections.
            </p>
          </div>
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
              alt="Sri Lankan landscape"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gradient-to-b from-slate-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Why Choose Pearl Pathways
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            We're committed to providing exceptional experiences through our core values
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100">
              <div className="w-14 h-14 bg-gradient-to-br from-sky-100 to-blue-100 rounded-lg flex items-center justify-center mb-6">
                <UsersIcon className="w-7 h-7 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Local Guides</h3>
              <p className="text-gray-600 leading-relaxed">
                Our carefully vetted guides are passionate locals who know every corner of
                Sri Lanka and share authentic stories you won't find in guidebooks.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center mb-6">
                <ShieldCheckIcon className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Safe & Reliable</h3>
              <p className="text-gray-600 leading-relaxed">
                Your safety is our priority. All our guides are licensed, insured, and undergo
                thorough background checks to ensure your peace of mind.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100">
              <div className="w-14 h-14 bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg flex items-center justify-center mb-6">
                <HeartIcon className="w-7 h-7 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Personalized Experiences</h3>
              <p className="text-gray-600 leading-relaxed">
                Every traveler is unique. We tailor each experience to match your interests,
                pace, and preferences for truly memorable adventures.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center mb-6">
                <MapPinIcon className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Island-Wide Coverage</h3>
              <p className="text-gray-600 leading-relaxed">
                From the ancient cities of the Cultural Triangle to the pristine beaches of the
                south, we cover all of Sri Lanka's must-see destinations.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-purple-100 rounded-lg flex items-center justify-center mb-6">
                <CompassIcon className="w-7 h-7 text-violet-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Hidden Gems</h3>
              <p className="text-gray-600 leading-relaxed">
                Discover Sri Lanka beyond the tourist trail. Our guides reveal secret spots and
                local favorites that make your journey truly special.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg flex items-center justify-center mb-6">
                <AwardIcon className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Award-Winning Service</h3>
              <p className="text-gray-600 leading-relaxed">
                Recognized for excellence in tourism, we're committed to maintaining the highest
                standards in every aspect of our service.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mb-2">
                500+
              </div>
              <div className="text-gray-600 font-medium">Verified Guides</div>
            </div>

            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                10K+
              </div>
              <div className="text-gray-600 font-medium">Happy Travelers</div>
            </div>

            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
                50+
              </div>
              <div className="text-gray-600 font-medium">Destinations</div>
            </div>

            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
                4.9★
              </div>
              <div className="text-gray-600 font-medium">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Ready to Explore Sri Lanka?
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            Join thousands of travelers who have discovered the real Sri Lanka with Pearl Pathways
          </p>
        </div>
      </div>
    </div>
  )
}

export default memo(AboutUs)
