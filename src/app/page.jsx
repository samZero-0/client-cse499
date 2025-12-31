'use client';

import Link from 'next/link';
import NavBar from '@/components/common/Navbar';
import Button from '@/components/common/Button';
import { useState, useEffect } from 'react';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="flex-grow flex flex-col overflow-hidden">
      <NavBar />
      
      {/* Hero Section with Gradient Background */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-20 lg:py-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 -left-20 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 -right-20 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-block mb-6 animate-fade-in-down">
              <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                🎉 Smart Grocery Shopping Made Easy
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-8 tracking-tight leading-tight animate-fade-in-up">
              Groceries Made
              <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent animate-gradient">
                Intelligent
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
              Stop wasting food and money. Track expiration dates, automate essentials, and shop smarter with AI-powered insights.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up animation-delay-400">
              <Link href="/products">
                <Button className="w-full sm:w-auto text-lg px-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Start Shopping Now
                  <span className="ml-2">→</span>
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="w-full sm:w-auto text-lg px-10 py-5 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Create Free Account
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-16 flex flex-wrap justify-center gap-8 items-center text-gray-600 animate-fade-in-up animation-delay-600">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span className="font-medium">Free Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span className="font-medium">Fresh Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span className="font-medium">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Agent Tutorial Section */}
      <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 animate-fade-in-down">
              <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-5 py-2 rounded-full text-sm font-bold shadow-md">
                🤖 AI-Powered Shopping
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 animate-fade-in-up">
              Meet Your <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">Smart Assistant</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
              Watch how our AI agent simplifies your shopping experience from start to finish
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Interactive Demo Visualization */}
              <div className="relative order-2 lg:order-1">
                <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-3xl p-8 shadow-2xl border border-purple-100">
                  {/* Chat Interface Mockup */}
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <span className="ml-auto text-white font-semibold text-sm">AI Shopping Assistant</span>
                    </div>
                    
                    <div className="p-6 space-y-4 h-96 overflow-hidden">
                      {/* User Message */}
                      <div className="flex justify-end animate-fade-in-up">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-xs shadow-md">
                          <p className="text-sm font-medium">I need milk, eggs, and bread for this week</p>
                        </div>
                      </div>

                      {/* AI Response - Adding to Cart */}
                      <div className="flex gap-3 animate-fade-in-up animation-delay-200">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg">
                          AI
                        </div>
                        <div className="bg-gray-100 px-5 py-3 rounded-2xl rounded-tl-sm max-w-md shadow-md">
                          <p className="text-sm text-gray-800 mb-3">Perfect! I found these items for you:</p>
                          <div className="space-y-2">
                            <div className="bg-white p-3 rounded-lg flex items-center gap-3 animate-fade-in-up animation-delay-400 shadow-sm border border-gray-200">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center text-2xl">
                                🥛
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-sm text-gray-900">Organic Whole Milk</p>
                                <p className="text-xs text-gray-600">$3.99</p>
                              </div>
                              <div className="text-green-600 font-bold text-lg">✓</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg flex items-center gap-3 animate-fade-in-up animation-delay-600 shadow-sm border border-gray-200">
                              <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center text-2xl">
                                🥚
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-sm text-gray-900">Free Range Eggs (12)</p>
                                <p className="text-xs text-gray-600">$4.49</p>
                              </div>
                              <div className="text-green-600 font-bold text-lg">✓</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg flex items-center gap-3 animate-fade-in-up animation-delay-800 shadow-sm border border-gray-200">
                              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center text-2xl">
                                🍞
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-sm text-gray-900">Whole Wheat Bread</p>
                                <p className="text-xs text-gray-600">$2.99</p>
                              </div>
                              <div className="text-green-600 font-bold text-lg">✓</div>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-300">
                            <p className="text-sm font-semibold text-gray-800">
                              ✅ Added to cart • Total: <span className="text-emerald-600">$11.47</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* AI Suggestions */}
                      <div className="flex gap-3 animate-fade-in-up animation-delay-1000">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg">
                          AI
                        </div>
                        <div className="bg-gradient-to-br from-purple-100 to-pink-100 px-5 py-3 rounded-2xl rounded-tl-sm max-w-md shadow-md border border-purple-200">
                          <p className="text-sm text-gray-800 font-medium mb-2">💡 Smart Suggestion:</p>
                          <p className="text-sm text-gray-700">Would you like to add these to a weekly subscription? You'll save 15% and never run out!</p>
                        </div>
                      </div>
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          placeholder="Type your message..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                          disabled
                        />
                        <button className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Feature Badges */}
                <div className="absolute -top-6 -left-6 bg-white px-4 py-2 rounded-full shadow-xl border border-purple-200 animate-fade-in-up animation-delay-200">
                  <span className="text-sm font-bold text-purple-600">🎯 Smart Suggestions</span>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white px-4 py-2 rounded-full shadow-xl border border-pink-200 animate-fade-in-up animation-delay-400">
                  <span className="text-sm font-bold text-pink-600">⚡ Instant Checkout</span>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-6 order-1 lg:order-2">
                <div className="flex gap-4 items-start group animate-fade-in-up animation-delay-200">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    🛒
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Natural Language Shopping</h3>
                    <p className="text-gray-600 leading-relaxed">Simply chat with our AI in plain English. Tell it what you need, and it instantly finds the perfect products for you.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start group animate-fade-in-up animation-delay-400">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    ⚡
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">One-Click Cart Management</h3>
                    <p className="text-gray-600 leading-relaxed">AI automatically adds items to your cart, compares prices, and applies the best deals—all in seconds.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start group animate-fade-in-up animation-delay-600">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    🔄
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Subscription Setup</h3>
                    <p className="text-gray-600 leading-relaxed">AI suggests personalized subscriptions based on your shopping patterns, saving you time and 15% on recurring items.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start group animate-fade-in-up animation-delay-800">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    📦
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Seamless Checkout</h3>
                    <p className="text-gray-600 leading-relaxed">Complete your purchase with a single command. The AI handles payment processing and delivery scheduling instantly.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start group animate-fade-in-up animation-delay-1000">
                  <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-red-500 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    🧠
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Learns Your Preferences</h3>
                    <p className="text-gray-600 leading-relaxed">The more you shop, the smarter it gets. AI remembers your favorites and dietary needs for personalized recommendations.</p>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-6 animate-fade-in-up animation-delay-1200">
                  <Link href="/products">
                    <Button className="w-full sm:w-auto text-lg px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                      Try AI Shopping Now
                      <span className="ml-2">✨</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Decorations */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in-up">
              <div className="text-4xl md:text-5xl font-bold mb-2">50K+</div>
              <div className="text-emerald-100 text-sm md:text-base">Happy Customers</div>
            </div>
            <div className="animate-fade-in-up animation-delay-200">
              <div className="text-4xl md:text-5xl font-bold mb-2">10K+</div>
              <div className="text-emerald-100 text-sm md:text-base">Products</div>
            </div>
            <div className="animate-fade-in-up animation-delay-400">
              <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
              <div className="text-emerald-100 text-sm md:text-base">Satisfaction Rate</div>
            </div>
            <div className="animate-fade-in-up animation-delay-600">
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-emerald-100 text-sm md:text-base">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features to help you manage groceries smarter and save more
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-emerald-100">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-3xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                🥬
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Digital Pantry</h3>
              <p className="text-gray-700 leading-relaxed">Track what you have at home. Get smart alerts before your food expires and reduce waste.</p>
            </div>

            <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-blue-100">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-3xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                📦
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Smart Subscriptions</h3>
              <p className="text-gray-700 leading-relaxed">Never run out of essentials. Customize monthly bundles and save up to 15% on recurring orders.</p>
            </div>

            <div className="group bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-purple-100">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-3xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                📊
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Budget Analytics</h3>
              <p className="text-gray-700 leading-relaxed">Visualize spending habits with detailed insights and discover smart ways to save money.</p>
            </div>

            <div className="group bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-amber-100">
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-3xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                🚚
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Fast Delivery</h3>
              <p className="text-gray-700 leading-relaxed">Same-day delivery available. Fresh groceries delivered right to your doorstep in hours.</p>
            </div>

            <div className="group bg-gradient-to-br from-rose-50 to-red-50 p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-rose-100">
              <div className="bg-gradient-to-br from-rose-500 to-red-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-3xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                🎯
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Smart Recommendations</h3>
              <p className="text-gray-700 leading-relaxed">AI-powered suggestions based on your preferences, dietary needs, and shopping history.</p>
            </div>

            <div className="group bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-indigo-100">
              <div className="bg-gradient-to-br from-indigo-500 to-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-3xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                💳
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Secure Payments</h3>
              <p className="text-gray-700 leading-relaxed">Multiple payment options with bank-level security. Your transactions are always protected.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in just 3 simple steps
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connection Lines */}
              <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 transform -translate-y-1/2"></div>

              {/* Step 1 */}
              <div className="text-center relative">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-3xl font-bold mb-6 shadow-xl transform hover:scale-110 transition-all duration-300 relative z-10">
                  1
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Create Account</h3>
                <p className="text-gray-600 leading-relaxed">Sign up in seconds and set your preferences for a personalized shopping experience.</p>
              </div>

              {/* Step 2 */}
              <div className="text-center relative">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-3xl font-bold mb-6 shadow-xl transform hover:scale-110 transition-all duration-300 relative z-10">
                  2
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Browse & Select</h3>
                <p className="text-gray-600 leading-relaxed">Explore thousands of products and add items to your cart with just a click.</p>
              </div>

              {/* Step 3 */}
              <div className="text-center relative">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-3xl font-bold mb-6 shadow-xl transform hover:scale-110 transition-all duration-300 relative z-10">
                  3
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Fast Delivery</h3>
                <p className="text-gray-600 leading-relaxed">Sit back and relax. Fresh groceries delivered to your door in no time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Showcase */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fresh, organic, and quality products across all categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { emoji: '🥦', name: 'Vegetables', color: 'from-green-400 to-emerald-500' },
              { emoji: '🍎', name: 'Fruits', color: 'from-red-400 to-rose-500' },
              { emoji: '🥛', name: 'Dairy', color: 'from-blue-400 to-cyan-500' },
              { emoji: '🍞', name: 'Bakery', color: 'from-amber-400 to-orange-500' },
              { emoji: '🥩', name: 'Meat', color: 'from-red-500 to-pink-500' },
              { emoji: '🧃', name: 'Beverages', color: 'from-purple-400 to-indigo-500' },
            ].map((category, index) => (
              <div
                key={index}
                className="group cursor-pointer bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-3xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                  {category.emoji}
                </div>
                <h3 className="text-center font-bold text-gray-900">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of happy customers who shop smarter every day
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Busy Mom',
                text: 'PantryPal has completely changed how I shop! No more expired food and I save at least $100 every month.',
                rating: 5,
              },
              {
                name: 'Michael Chen',
                role: 'Working Professional',
                text: 'The smart subscriptions are a lifesaver. I never run out of essentials and the delivery is always on time!',
                rating: 5,
              },
              {
                name: 'Emily Rodriguez',
                role: 'Health Enthusiast',
                text: 'Love the fresh produce and organic options. The quality is amazing and prices are very competitive.',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-emerald-100"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-500 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Ready to Transform Your Shopping?
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-emerald-50 leading-relaxed">
              Join 50,000+ customers who are already saving time and money with smart grocery shopping.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button className="w-full sm:w-auto text-lg px-12 py-6 bg-white text-emerald-600 hover:bg-gray-100 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 font-bold">
                  Get Started Free
                  <span className="ml-2">→</span>
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" className="w-full sm:w-auto text-lg px-12 py-6 border-2 border-white text-white hover:bg-white hover:text-emerald-600 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 font-bold">
                  Browse Products
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-emerald-50">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="font-medium">No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="font-medium">Cancel Anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="font-medium">100% Money Back</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}