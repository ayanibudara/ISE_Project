import React, { useState, useRef, useEffect } from "react";
import { MenuIcon, XIcon as CloseIcon } from "lucide-react";
import { Instagram, Twitter, ChevronDown, User, LogOut } from "lucide-react"; //
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { authState, logout } = useAuth();
  const profileMenuRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            href="/"
            className="text-[#1E3A8A] font-medium hover:text-blue-900 transition-colors"
          >
            Home
          </a>
        {/*<a
            href="#"
            className="text-gray-600 font-medium hover:text-[#1E3A8A] transition-colors"
          >
            Destinations
          </a> */}


           {/* connet the destination to packages */}
            <Link
            to="/packages"
             className="text-gray-600 font-medium hover:text-[#1E3A8A] transition-colors"
             >
             Destinations
             </Link>

          <a
            href="/reviewlist"
            className="text-gray-600 font-medium hover:text-[#1E3A8A] transition-colors"
          >
            Reviews
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
          {authState.isAuthenticated ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 px-4 py-2 text-[#1E3A8A] font-medium border border-[#1E3A8A] rounded-lg hover:bg-blue-50 transition-colors"
              >
                <User size={20} />
                <span>
                  {authState.user?.firstName} {authState.user?.lastName}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    isProfileMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {authState.user?.firstName} {authState.user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {authState.user?.role}
                    </p>
                  </div>
                  <Link
                    to="/dashboard"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <User size={16} className="mr-2" />
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <User size={16} className="mr-2" />
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-[#1E3A8A] font-medium border border-[#1E3A8A] rounded-lg hover:bg-blue-50 transition-colors"
                aria-label="Login"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-[#1E3A8A] text-white font-medium rounded-lg hover:bg-blue-900 transition-colors"
                aria-label="Sign Up"
              >
                Sign Up
              </Link>
            </>
          )}
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
              {authState.isAuthenticated ? (
                <>
                  <div className="flex-1 px-4 py-2 bg-blue-50 border border-[#1E3A8A] rounded-lg text-center">
                    <p className="text-sm font-medium text-[#1E3A8A]">
                      {authState.user?.firstName} {authState.user?.lastName}
                    </p>
                    <p className="text-xs text-gray-600 capitalize">
                      {authState.user?.role}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex-1 px-4 py-2 text-[#1E3A8A] font-medium border border-[#1E3A8A] rounded-lg hover:bg-blue-50 transition-colors text-center"
                    aria-label="Login"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 px-4 py-2 bg-[#1E3A8A] text-white font-medium rounded-lg hover:bg-blue-900 transition-colors text-center"
                    aria-label="Sign Up"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu links when authenticated */}
            {authState.isAuthenticated && (
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <Link
                  to="/dashboard"
                  className="flex items-center px-4 py-2 text-[#1E3A8A] font-medium hover:bg-blue-50 transition-colors rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={16} className="mr-2" />
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-gray-600 font-medium hover:bg-gray-50 transition-colors rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={16} className="mr-2" />
                  Profile Settings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-red-600 font-medium hover:bg-red-50 transition-colors rounded-lg"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
