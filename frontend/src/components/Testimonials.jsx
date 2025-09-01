import React from "react";
import { StarIcon } from "lucide-react";

export const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "United Kingdom",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      rating: 5,
      text: "Our guide was incredibly knowledgeable about Sri Lankan history and culture. He took us to hidden gems we would never have found on our own. Truly a memorable experience!",
    },
    {
      id: 2,
      name: "Michael Chen",
      location: "Singapore",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80", // Fixed: Removed leading spaces
      rating: 5,
      text: "Pearl Pathways arranged a perfect 10-day tour for our family. The guides were friendly, accommodations were excellent, and the itinerary was perfectly balanced.",
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      location: "Australia",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80", // Fixed: Removed leading spaces
      rating: 5,
      text: "From tea plantations to beautiful beaches, our tour with Pearl Pathways showed us the best of Sri Lanka. Our guide was professional, friendly, and went above and beyond.",
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from travelers who have experienced Sri Lanka with Pearl Pathways.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Reviewer Info */}
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                  <p className="text-gray-600 text-sm">{testimonial.location}</p>
                </div>
              </div>

              {/* Rating Stars */}
              <div className="flex mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <StarIcon
                    key={i}
                    size={16}
                    className="text-yellow-500 fill-yellow-500"
                    aria-hidden="true"
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 italic">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;