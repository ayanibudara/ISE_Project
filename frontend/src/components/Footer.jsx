import React from "react";

import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1E3A8A] text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div>
            <h3 className="text-xl font-bold mb-4">Pearl Pathways</h3>
            <p className="mb-4">
              Your trusted guide to exploring the beauty and culture of Sri
              Lanka. We provide exceptional tour experiences with expert local
              guides.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-200" aria-label="Facebook">
                <FacebookIcon size={20} />
              </a>
              <a href="#" className="hover:text-blue-200" aria-label="Instagram">
                <InstagramIcon size={20} />
              </a>
              <a href="#" className="hover:text-blue-200" aria-label="Twitter">
                <TwitterIcon size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-200">
                  Home
                </a>
              </li>
              <li>
                <a href="/packages" className="hover:text-blue-200">
                  Destinations
                </a>
              </li>
              <li>
                {/*<a href="#" className="hover:text-blue-200">
                  Tour Guides
                </a>*/}
              </li>
              <li>
                <a href="/aboutus" className="hover:text-blue-200">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contactus" className="hover:text-blue-200">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Destinations</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-200">
                  Sigiriya Rock Fortress
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-200">
                  Galle Fort
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-200">
                  Yala National Park
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-200">
                  Ella Rock
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-200">
                  Mirissa Beach
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPinIcon size={20} className="mr-2 mt-1 flex-shrink-0" />
                <span>123 Temple Road, Colombo, Sri Lanka</span>
              </div>
              <div className="flex items-center">
                <PhoneIcon size={20} className="mr-2 flex-shrink-0" />
                <span>+94 11 234 5678</span>
              </div>
              <div className="flex items-center">
                <MailIcon size={20} className="mr-2 flex-shrink-0" />
                <span>info@pearlpathways.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} Pearl Pathways. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;