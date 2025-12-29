'use client';
import { useState, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import Link from 'next/link';
import { 
  FaEnvelope, FaLock, FaSignInAlt, FaUserCircle, 
  FaCheckCircle, FaShoppingCart, FaLeaf 
} from 'react-icons/fa';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 px-4 py-12 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center relative z-10">
        
        {/* Left Side - Branding & Info */}
        <div className="hidden lg:block">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/20">
            <div className="mb-8">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                Welcome Back! 👋
              </h1>
              <p className="text-gray-600 text-lg">
                Sign in to manage your pantry, track expiry dates, and automate your grocery shopping.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                  <FaLeaf className="text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Reduce Food Waste</h3>
                  <p className="text-sm text-gray-600">Track expiry dates and get timely reminders</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                  <FaShoppingCart className="text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Smart Shopping</h3>
                  <p className="text-sm text-gray-600">Automated subscriptions and personalized recommendations</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                  <FaCheckCircle className="text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Save Money</h3>
                  <p className="text-sm text-gray-600">Get the best deals and never overbuy again</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">10K+</div>
                <div className="text-xs text-gray-600 mt-1">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600">50K+</div>
                <div className="text-xs text-gray-600 mt-1">Items Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-600">95%</div>
                <div className="text-xs text-gray-600 mt-1">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 border border-gray-100">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                <FaUserCircle className="text-4xl" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
              <p className="text-gray-600">Enter your credentials to access your account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input 
                    type="email" 
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-gray-900"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-gray-900"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <FaSignInAlt className="group-hover:translate-x-1 transition-transform" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-700">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                Google
              </button>
              <button className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-700">
                <img src="https://www.facebook.com/favicon.ico" alt="Facebook" className="w-5 h-5" />
                Facebook
              </button>
            </div>

            {/* Register Link */}
            <p className="mt-8 text-center text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline">
                Create Account
              </Link>
            </p>
          </div>

          {/* Mobile Features */}
          <div className="lg:hidden mt-6 text-center">
            <p className="text-sm text-gray-600">
              Trusted by <span className="font-bold text-emerald-600">10,000+</span> users worldwide
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}