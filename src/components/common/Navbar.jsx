'use client';
import Link from 'next/link';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { FaShoppingBasket, FaLeaf, FaBars, FaTimes, FaUser } from 'react-icons/fa';
import ChatBot from '../ai/ChatBot';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg text-gray-900' 
        : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-md'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold flex items-center gap-2 group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ${
              isScrolled 
                ? 'bg-gradient-to-br from-emerald-500 to-teal-500' 
                : 'bg-white/20 backdrop-blur-sm'
            }`}>
              <FaLeaf className={`text-xl ${isScrolled ? 'text-white' : 'text-emerald-100'}`}/>
            </div>
            <span className={`font-extrabold ${
              isScrolled 
                ? 'text-gray-900' 
                : 'text-gray-900'
            }`}>
              PantryPal
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-8 items-center font-medium">
            <Link href="/products" className={`relative group py-2 ${
              isScrolled ? 'text-gray-700 hover:text-emerald-600' : 'hover:text-emerald-100'
            } transition-colors`}>
              Shop
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            {user && (
              <>
                <Link href="/dashboard" className={`relative group py-2 ${
                  isScrolled ? 'text-gray-700 hover:text-emerald-600' : 'hover:text-emerald-100'
                } transition-colors`}>
                  Dashboard
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="/pantry" className={`relative group py-2 ${
                  isScrolled ? 'text-gray-700 hover:text-emerald-600' : 'hover:text-emerald-100'
                } transition-colors`}>
                  My Pantry
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
                
                <Link href="/subscription" className={`relative group py-2 ${
                  isScrolled ? 'text-gray-700 hover:text-emerald-600' : 'hover:text-emerald-100'
                } transition-colors`}>
                  Subscriptions
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <ChatBot />
            </div>
            {/* Cart Icon */}
            <Link href="/cart" className={`relative p-2 rounded-xl transition-all duration-300 ${
              isScrolled 
                ? 'hover:bg-emerald-50' 
                : 'hover:bg-white/20'
            }`}>
              <FaShoppingBasket className="text-2xl" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-lg animate-pulse">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* User Actions */}
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                  isScrolled 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'bg-white/20 backdrop-blur-sm'
                }`}>
                  <FaUser className="text-sm" />
                 
              <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  <span className="hidden lg:block text-sm font-medium">{user.name}</span>
              </Link>
                
                </div>
                <button 
                  onClick={logout} 
                  className={`px-5 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${
                    isScrolled
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700'
                      : 'bg-white text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex gap-3">
                <Link 
                  href="/login" 
                  className={`px-5 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                    isScrolled
                      ? 'hover:bg-emerald-50 text-gray-700'
                      : 'hover:bg-white/20'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className={`px-5 py-2 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${
                    isScrolled
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700'
                      : 'bg-white text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  Register
                </Link>
              </div>
            )}
           
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl transition-all ${
                isScrolled ? 'hover:bg-emerald-50' : 'hover:bg-white/20'
              }`}
            >
              {isMobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`lg:hidden py-4 border-t ${
            isScrolled ? 'border-gray-200' : 'border-white/20'
          }`}>
            <div className="flex flex-col gap-4">
              <Link 
                href="/products" 
                className={`py-2 font-medium transition-colors ${
                  isScrolled ? 'text-gray-700 hover:text-emerald-600' : 'hover:text-emerald-100'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Shop
              </Link>
              {user && (
                <>
                  <Link 
                    href="/dashboard" 
                    className={`py-2 font-medium transition-colors ${
                      isScrolled ? 'text-gray-700 hover:text-emerald-600' : 'hover:text-emerald-100'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/pantry" 
                    className={`py-2 font-medium transition-colors ${
                      isScrolled ? 'text-gray-700 hover:text-emerald-600' : 'hover:text-emerald-100'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Pantry
                  </Link>
                  <Link 
                    href="/subscription" 
                    className={`py-2 font-medium transition-colors ${
                      isScrolled ? 'text-gray-700 hover:text-emerald-600' : 'hover:text-emerald-100'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Subscriptions
                  </Link>
                </>
              )}
              
              <div className="pt-4 border-t border-white/20 flex flex-col gap-3">
                {user ? (
                  <>
                    <div className={`px-4 py-2 rounded-xl ${
                      isScrolled ? 'bg-emerald-50 text-emerald-700' : 'bg-white/20'
                    }`}>
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <button 
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="px-5 py-3 rounded-xl font-medium bg-white text-emerald-600 hover:bg-emerald-50 transition-all"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      className="px-5 py-3 rounded-xl font-medium text-center hover:bg-white/20 transition-all"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      href="/register" 
                      className="px-5 py-3 rounded-xl font-bold text-center bg-white text-emerald-600 hover:bg-emerald-50 transition-all"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}