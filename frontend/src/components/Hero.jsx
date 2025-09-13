import React, { useState, useEffect } from "react";
import { SearchIcon, MapPinIcon } from "lucide-react";

export function Hero() {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  // 👇 Add multiple background images for slideshow
  const images = [
    "https://i.postimg.cc/tJ2JRStb/ramith-bhasuka-jco-O6i1o-Dn-Q-unsplash.jpg",
    "https://i.postimg.cc/X71qTPYc/dinuka-lankaloka-idu-Eae-BB-r-Q-unsplash.jpg",
    "https://i.postimg.cc/qBjv3FyV/hendrik-cornelissen-jp-TT-SAU034-unsplash.jpg",
    "https://i.postimg.cc/XNHnJC6n/amal-prasad-zt-Fkvm-LKTc-Y-unsplash.jpg"
  ];

  // Auto-change images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative w-full">
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Scenic view ${index + 1}`}
            className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 py-24 md:py-32 lg:py-40 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          Discover the Beauty of Sri Lanka
        </h1>
        <p className="text-xl text-white max-w-2xl mb-12">
          Explore the pearl of the Indian Ocean with our expert guides and personalized tours.
        </p>

        {/* Search Form */}
        <div className="w-full max-w-3xl bg-white p-4 rounded-lg shadow-lg">
          <div className="flex flex-col md:flex-row items-center">
            {/* Province Dropdown */}
            <div className="flex items-center w-full md:w-3/4 mb-4 md:mb-0 md:mr-4">
              <MapPinIcon
                className="text-[#1E3A8A] mr-2"
                size={24}
                aria-hidden="true"
              />
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full p-2 focus:outline-none text-gray-700 bg-transparent"
                aria-label="Select a Province"
              >
                <option value="">Select a Province</option>
                {provinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <button
              type="button"
              className="w-full md:w-1/4 bg-[#1E3A8A] text-white py-3 px-6 rounded-md flex items-center justify-center hover:bg-blue-900 transition-colors"
            >
              <SearchIcon size={20} className="mr-2" aria-hidden="true" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
