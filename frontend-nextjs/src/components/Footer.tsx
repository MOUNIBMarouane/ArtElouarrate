import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Palette,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-xl">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  ELOUARATE ART
                </h3>
                <span className="text-gray-400 text-sm">Fine Art Studio</span>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Creating extraordinary, original artwork that captures life's most
              precious moments. Each painting tells a unique story with passion
              and artistic excellence.
            </p>
            <div className="flex space-x-4">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-2 rounded-lg hover:scale-110 transition-transform duration-300 cursor-pointer">
                <Facebook className="h-5 w-5 text-white" />
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-2 rounded-lg hover:scale-110 transition-transform duration-300 cursor-pointer">
                <Twitter className="h-5 w-5 text-white" />
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-2 rounded-lg hover:scale-110 transition-transform duration-300 cursor-pointer">
                <Instagram className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white mb-4 relative">
              Quick Links
              <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
            </h4>
            <ul className="space-y-3">
              {["Home", "Artwork", "About Artist", "Contact", "Commission"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-purple-400 transition-colors duration-300 relative group"
                    >
                      {link}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Art Categories */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white mb-4 relative">
              Art Categories
              <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
            </h4>
            <ul className="space-y-3">
              {[
                "Portraits",
                "Landscapes",
                "Abstract",
                "Still Life",
                "Custom Work",
              ].map((category) => (
                <li key={category}>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-purple-400 transition-colors duration-300 relative group"
                  >
                    {category}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white mb-4 relative">
              Contact Studio
              <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
            </h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 group">
                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-300">
                  123 Art Street, Creative District
                </span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Phone className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-300">+1 (555) ART-WORK</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-300">hello@elouarateart.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-center md:text-left">
              &copy; 2024 ELOUARATE ART Studio. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-purple-400 transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-purple-400 transition-colors duration-300"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
