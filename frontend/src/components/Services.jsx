import React from "react";
import {
  Users2Icon,
  MapIcon,
  CalendarIcon,
  HeartIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ Added

export function Services() {
  const navigate = useNavigate(); // ✅ Added

  const services = [
    {
      id: 1,
      icon: <Users2Icon size={40} className="text-[#1E3A8A]" aria-hidden="true" />,
      title: "Expert Local Guides",
      description:
        "Our guides are certified professionals with deep knowledge of Sri Lankan culture, history, and hidden gems.",
    },
    {
      id: 2,
      icon: <MapIcon size={40} className="text-[#1E3A8A]" aria-hidden="true" />,
      title: "Customized Tours",
      description:
        "We create personalized itineraries based on your interests, timeframe, and preferred destinations.",
    },
    {
      id: 3,
      icon: <CalendarIcon size={40} className="text-[#1E3A8A]" aria-hidden="true" />,
      title: "Flexible Scheduling",
      description:
        "Book tours in advance or last minute with our flexible scheduling options.",
    },
    {
      id: 4,
      icon: <HeartIcon size={40} className="text-[#1E3A8A]" aria-hidden="true" />,
      title: "Authentic Experiences",
      description:
        "Immerse yourself in local culture with authentic experiences beyond the typical tourist attractions.",
    },
  ];

  return (
    <section className="bg-gray-50 py-16 w-full">
      {/* Container */}
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            At Pearl Pathways, we're committed to providing exceptional tour experiences throughout Sri Lanka.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-center mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-8 bg-[#1E3A8A] rounded-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Explore Sri Lanka?</h3>
          <p className="mb-6 max-w-2xl mx-auto">
            Let us help you discover the beauty and culture of Sri Lanka with our expert guides and customized tours.
          </p>
          <button
            type="button"
            onClick={() => navigate("/packages")} // ✅ Updated: Navigate to booking form
            className="px-6 py-3 bg-white text-[#1E3A8A] font-medium rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-colors"
          >
            Book Your Tour Now
          </button>
        </div>
      </div>
    </section>
  );
}

export default Services;