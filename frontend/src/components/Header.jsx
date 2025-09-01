import React, { useState } from "react";
import { MenuIcon, XIcon as CloseIcon } from "lucide-react";
import { Instagram, Twitter } from "lucide-react";//

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      {/* Top Bar */}
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-[#1E3A8A]">Pearl Pathways</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <a
            href="#"
            className="text-[#1E3A8A] font-medium hover:text-blue-900 transition-colors"
          >
            Home
          </a>
          <a
            href="#"
            className="text-gray-600 font-medium hover:text-[#1E3A8A] transition-colors"
          >
            Destinations
          </a>
          <a
            href="#"
            className="text-gray-600 font-medium hover:text-[#1E3A8A] transition-colors"
          >
            Tour Guides
          </a>
          <a
            href="#"
            className="text-gray-600 font-medium hover:text-[#1E3A8A] transition-colors"
          >
            About Us
          </a>
          <a
            href="#"
            className="text-gray-600 font-medium hover:text-[#1E3A8A] transition-colors"
          >
            Contact
          </a>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            className="px-4 py-2 text-[#1E3A8A] font-medium border border-[#1E3A8A] rounded-lg hover:bg-blue-50 transition-colors"
            aria-label="Login"
          >
            Login
          </button>
          <button
            className="px-4 py-2 bg-[#1E3A8A] text-white font-medium rounded-lg hover:bg-blue-900 transition-colors"
            aria-label="Sign Up"
          >
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 py-2 shadow-md">
          <nav className="flex flex-col space-y-3 pb-3">
            <a
              href="#"
              className="text-[#1E3A8A] font-medium py-2 hover:text-blue-900 transition-colors"
            >
              Home
            </a>
            <a
              href="#"
              className="text-gray-600 font-medium py-2 hover:text-[#1E3A8A] transition-colors"
            >
              Destinations
            </a>
            <a
              href="#"
              className="text-gray-600 font-medium py-2 hover:text-[#1E3A8A] transition-colors"
            >
              Tour Guides
            </a>
            <a
              href="#"
              className="text-gray-600 font-medium py-2 hover:text-[#1E3A8A] transition-colors"
            >
              About Us
            </a>
            <a
              href="#"
              className="text-gray-600 font-medium py-2 hover:text-[#1E3A8A] transition-colors"
            >
              Contact
            </a>
            <div className="flex space-x-2 pt-2">
              <button
                className="flex-1 px-4 py-2 text-[#1E3A8A] font-medium border border-[#1E3A8A] rounded-lg hover:bg-blue-50 transition-colors"
                aria-label="Login"
              >
                Login
              </button>
              <button
                className="flex-1 px-4 py-2 bg-[#1E3A8A] text-white font-medium rounded-lg hover:bg-blue-900 transition-colors"
                aria-label="Sign Up"
              >
                Sign Up
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;