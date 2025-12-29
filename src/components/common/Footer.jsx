import Link from 'next/link';
import { FaHeart, FaLeaf, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 mt-auto">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                <FaLeaf className="text-white text-xl"/>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                PantryPal
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Your smart grocery companion. Reducing food waste and helping families shop smarter, one pantry at a time.
            </p>
            <div className="flex gap-4">
              {[
                { icon: FaFacebook, href: '#', color: 'hover:text-blue-400' },
                { icon: FaTwitter, href: '#', color: 'hover:text-sky-400' },
                { icon: FaInstagram, href: '#', color: 'hover:text-pink-400' },
                { icon: FaLinkedin, href: '#', color: 'hover:text-blue-500' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center ${social.color} transition-all duration-300 transform hover:scale-110 hover:shadow-lg`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="text-xl" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Shop Products', href: '/products' },
                { name: 'My Pantry', href: '/pantry' },
                { name: 'Subscriptions', href: '/subscription' },
                { name: 'Dashboard', href: '/dashboard' },
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-400 transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></span>
              Support
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Help Center', href: '#' },
                { name: 'FAQs', href: '#' },
                { name: 'Shipping Info', href: '#' },
                { name: 'Returns', href: '#' },
                { name: 'Contact Us', href: '#' },
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-400 transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></span>
              Get in Touch
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 hover:text-emerald-400 transition-colors duration-300 group">
                <FaMapMarkerAlt className="text-emerald-500 mt-1 group-hover:scale-110 transition-transform" />
                <span>123 Grocery Lane,<br />Fresh City, FC 12345</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 hover:text-emerald-400 transition-colors duration-300 group">
                <FaPhone className="text-emerald-500 group-hover:scale-110 transition-transform" />
                <a href="tel:+1234567890">+1 (234) 567-890</a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 hover:text-emerald-400 transition-colors duration-300 group">
                <FaEnvelope className="text-emerald-500 group-hover:scale-110 transition-transform" />
                <a href="mailto:hello@pantrypal.com">hello@pantrypal.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 pt-12 border-t border-gray-700">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-white font-bold text-2xl mb-4">
              Stay Updated with Fresh Deals 🎉
            </h3>
            <p className="text-gray-400 mb-6">
              Subscribe to our newsletter and get exclusive offers and updates delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 bg-gray-900/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm flex items-center gap-2 flex-wrap justify-center">
              <span>Made with</span>
              <FaHeart className="text-red-500 animate-pulse" />
              <span>for a sustainable future</span>
            </p>
            <p className="text-gray-500 text-sm">
              © {currentYear} PantryPal. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}