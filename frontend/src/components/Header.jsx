import React, { useState, useRef, useEffect } from "react";
import { MenuIcon, XIcon as CloseIcon } from "lucide-react";
import { Instagram, Twitter, ChevronDown, User, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom"; // ✅ Changed: use NavLink + useNavigate
import { useAuth } from "../contexts/AuthContext";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { authState, logout } = useAuth();
  const profileMenuRef = useRef(null);
  const navigate = useNavigate(); // ✅ For logout redirect (optional but clean)

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileMenuOpen(false);
      setIsMenuOpen(false); // ✅ Also close mobile menu on logout
      navigate("/"); // ✅ Optional: redirect to home after logout
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

  // ✅ NavLink styling function
  const navLinkClass = ({ isActive }) =>
    `font-medium transition-colors ${
      isActive ? "text-[#1E3A8A]" : "text-gray-600 hover:text-[#1E3A8A]"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="container flex items-center justify-between px-4 py-4 mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-[#1E3A8A]">Pearl Pathways</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden space-x-8 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/packages" className={navLinkClass}>
            Destinations
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About Us
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </nav>

        {/* Desktop Buttons */}
        <div className="items-center hidden space-x-4 md:flex">
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
                <div className="absolute right-0 z-50 w-48 py-1 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {authState.user?.firstName} {authState.user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {authState.user?.role}
                    </p>
                  </div>
                  <NavLink
                    to="/dashboard"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <User size={16} className="mr-2" /> Dashboard
                  </NavLink>
                  <NavLink
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <User size={16} className="mr-2" /> Profile Settings
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut size={16} className="mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                className="px-4 py-2 text-[#1E3A8A] font-medium border border-[#1E3A8A] rounded-lg hover:bg-blue-50 transition-colors"
                aria-label="Login"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="px-4 py-2 bg-[#1E3A8A] text-white font-medium rounded-lg hover:bg-blue-900 transition-colors"
                aria-label="Sign Up"
              >
                Sign Up
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="text-gray-600 md:hidden focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="px-4 py-2 bg-white shadow-md md:hidden">
          <nav className="flex flex-col pb-3 space-y-3">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `font-medium py-2 transition-colors ${
                  isActive ? "text-[#1E3A8A]" : "text-gray-600 hover:text-[#1E3A8A]"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/packages"
              className={({ isActive }) =>
                `font-medium py-2 transition-colors ${
                  isActive ? "text-[#1E3A8A]" : "text-gray-600 hover:text-[#1E3A8A]"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Destinations
            </NavLink>
            <NavLink
              to="/guides"
              className={({ isActive }) =>
                `font-medium py-2 transition-colors ${
                  isActive ? "text-[#1E3A8A]" : "text-gray-600 hover:text-[#1E3A8A]"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Tour Guides
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `font-medium py-2 transition-colors ${
                  isActive ? "text-[#1E3A8A]" : "text-gray-600 hover:text-[#1E3A8A]"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `font-medium py-2 transition-colors ${
                  isActive ? "text-[#1E3A8A]" : "text-gray-600 hover:text-[#1E3A8A]"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </NavLink>

            <div className="flex pt-2 space-x-2">
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
                  <NavLink
                    to="/login"
                    className="flex-1 px-4 py-2 text-[#1E3A8A] font-medium border border-[#1E3A8A] rounded-lg hover:bg-blue-50 transition-colors text-center"
                    aria-label="Login"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="flex-1 px-4 py-2 bg-[#1E3A8A] text-white font-medium rounded-lg hover:bg-blue-900 transition-colors text-center"
                    aria-label="Sign Up"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </NavLink>
                </>
              )}
            </div>

            {/* Mobile menu links when authenticated */}
            {authState.isAuthenticated && (
              <div className="pt-3 space-y-2 border-t border-gray-200">
                <NavLink
                  to="/dashboard"
                  className="flex items-center px-4 py-2 text-[#1E3A8A] font-medium hover:bg-blue-50 transition-colors rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={16} className="mr-2" /> Dashboard
                </NavLink>
                <NavLink
                  to="/profile"
                  className="flex items-center px-4 py-2 font-medium text-gray-600 transition-colors rounded-lg hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={16} className="mr-2" /> Profile Settings
                </NavLink>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 font-medium text-red-600 transition-colors rounded-lg hover:bg-red-50"
                >
                  <LogOut size={16} className="mr-2" /> Logout
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