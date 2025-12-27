'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/common/Navbar';
import BundleBuilder from '@/components/subscription/BundleBuilder';
import useAxios from '@/hooks/useAxios';
import { 
  FaBox, FaCalendarAlt, FaShippingFast, FaClock, FaCheckCircle, 
  FaStar, FaPercent, FaGift, FaSearch, FaPlus, FaTags, FaFire,
  FaChevronLeft, FaChevronRight, FaArrowLeft, FaArrowRight
} from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function SubscriptionPage() {
  const [activeBundle, setActiveBundle] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [frequency, setFrequency] = useState('Monthly');
  const [nextDelivery, setNextDelivery] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sliderIndex, setSliderIndex] = useState(0);
  const productsPerPage = 9;
  const axios = useAxios();

  // Fetch Subscription AND All Products on Load
  useEffect(() => {
    const fetchData = async () => {
        try {
            const prodRes = await axios.get('/products');
            setAvailableProducts(prodRes.data);

            try {
                const subRes = await axios.get('/subscription');
                if (subRes.data) {
                    const formattedItems = subRes.data.items.map(i => ({
                        _id: i.product._id,
                        name: i.product.name,
                        price: i.product.price,
                        quantity: i.quantity
                    }));
                    setActiveBundle(formattedItems);
                    setFrequency(subRes.data.frequency);
                    setNextDelivery(subRes.data.nextDeliveryDate);
                }
            } catch (err) {
                console.log("No active subscription found.");
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  // Add an Item to the Bundle
  const addToBundle = (product) => {
    let itemExists = false;

    setActiveBundle(prev => {
        const exists = prev.find(item => item._id === product._id);
        
        if (exists) {
            itemExists = true;
            return prev;
        }
        
        return [...prev, { ...product, quantity: 1 }];
    });

    if (itemExists) {
        toast.error(`${product.name} is already in your bundle!`);
    } else {
        toast.success(`${product.name} added to bundle! 🎉`);
    }
  };

  // Save Subscription to Backend
  const handleSave = async (newItems) => {
    try {
        const backendItems = newItems.map(item => ({
            product: item._id,
            quantity: item.quantity
        }));

        const payload = { items: backendItems, frequency };
        const { data } = await axios.post('/subscription', payload);
        
        const formattedItems = data.items.map(i => ({
             _id: i.product._id, 
             name: i.product.name,
             price: i.product.price,
             quantity: i.quantity
        }));
        
        setActiveBundle(formattedItems);
        setNextDelivery(data.nextDeliveryDate);
        toast.success('Subscription updated successfully! ✅');
    } catch (error) {
        toast.error('Error saving subscription. Please try again.');
        console.error(error);
    }
  };

  // Filter products
  const categories = ['All', 'Dairy', 'Vegetables', 'Fruits', 'Staples', 'Protein'];
  const filteredProducts = availableProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Featured products for slider (top 6 rated or random)
  const featuredProducts = availableProducts.slice(0, 6);
  const visibleSlides = 3;
  const maxSliderIndex = Math.max(0, featuredProducts.length - visibleSlides);

  // Slider functions
  const nextSlide = () => {
    setSliderIndex(prev => Math.min(prev + 1, maxSliderIndex));
  };

  const prevSlide = () => {
    setSliderIndex(prev => Math.max(prev - 1, 0));
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Calculate savings
  const totalValue = activeBundle.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = Math.round(totalValue * 0.15); // 15% subscription discount

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading subscriptions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        
        {/* Hero Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                Subscription Manager 📦
              </h1>
              <p className="text-gray-600 text-lg">Never run out of essentials. Save time and money with recurring deliveries.</p>
            </div>
            
            {/* Frequency Selector */}
            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-all">
              <FaClock className="text-emerald-600 text-xl" />
              <div>
                <label className="text-xs text-gray-500 block">Delivery Frequency</label>
                <select 
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-emerald-600 font-bold cursor-pointer outline-none text-lg p-0"
                >
                  <option>Weekly</option>
                  <option>Bi-Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Banner */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <BenefitCard 
            icon={<FaPercent />}
            title="Save 15%"
            description="On all subscription orders"
            gradient="from-green-500 to-emerald-500"
          />
          <BenefitCard 
            icon={<FaShippingFast />}
            title="Free Delivery"
            description="No shipping charges ever"
            gradient="from-blue-500 to-cyan-500"
          />
          <BenefitCard 
            icon={<FaGift />}
            title="Exclusive Perks"
            description="Early access to new products"
            gradient="from-purple-500 to-pink-500"
          />
        </div>

        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
            
          {/* Left Column: Bundle Builder & Item Picker */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Bundle Builder */}
            <BundleBuilder 
              initialItems={activeBundle} 
              onSave={handleSave}
              savings={savings}
            />

            {/* Featured Products Slider */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg overflow-hidden mb-8">
              <div className="p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      <FaStar className="text-yellow-300" />
                      Featured Picks for You
                    </h3>
                    <p className="text-purple-100 text-sm">Popular items perfect for subscription</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={prevSlide}
                      disabled={sliderIndex === 0}
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={nextSlide}
                      disabled={sliderIndex >= maxSliderIndex}
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
                <div className="overflow-hidden">
                  <div 
                    className="flex gap-4 transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${sliderIndex * (100 / visibleSlides)}%)` }}
                  >
                    {featuredProducts.map(product => (
                      <div 
                        key={product._id}
                        className="min-w-[calc(33.333%-0.67rem)] bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                        onClick={() => addToBundle(product)}
                      >
                        <div className="aspect-square bg-white/20 rounded-lg mb-3 overflow-hidden">
                          <img 
                            src={product.imageUrl || 'https://placehold.co/200x200?text=Product'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="font-bold text-white mb-1 line-clamp-1">{product.name}</h4>
                        <p className="text-yellow-300 font-bold mb-2">৳{product.price}</p>
                        <button className="w-full py-2 bg-white text-purple-600 rounded-lg font-semibold text-sm hover:bg-purple-50 transition-all flex items-center justify-center gap-2">
                          <FaPlus />
                          Quick Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Add Items Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <FaBox />
                  Add Items to Bundle
                </h3>
                <p className="text-emerald-50">Browse and select products for your subscription</p>
              </div>

              {/* Search & Filter */}
              <div className="p-6 border-b border-gray-200 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedCategory === cat
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Grid */}
              <div className="p-6">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <p className="text-gray-500">No products found</p>
                  </div>
                ) : (
                  <>
                    {/* Products Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                      {currentProducts.map(product => (
                        <ProductCard 
                          key={product._id}
                          product={product}
                          onAdd={() => addToBundle(product)}
                          isInBundle={activeBundle.some(item => item._id === product._id)}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
                        {/* Page Info */}
                        <div className="text-sm text-gray-600">
                          Showing <span className="font-semibold text-emerald-600">{startIndex + 1}</span> to{' '}
                          <span className="font-semibold text-emerald-600">{Math.min(endIndex, filteredProducts.length)}</span> of{' '}
                          <span className="font-semibold text-emerald-600">{filteredProducts.length}</span> products
                        </div>

                        {/* Pagination Buttons */}
                        <div className="flex items-center gap-2">
                          {/* Previous Button */}
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-emerald-100 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium"
                          >
                            <FaArrowLeft className="text-sm" />
                            Previous
                          </button>

                          {/* Page Numbers */}
                          <div className="flex gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
                              // Show first page, last page, current page, and pages around current
                              const showPage = 
                                pageNum === 1 ||
                                pageNum === totalPages ||
                                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);
                              
                              const showEllipsis = 
                                (pageNum === currentPage - 2 && currentPage > 3) ||
                                (pageNum === currentPage + 2 && currentPage < totalPages - 2);

                              if (showEllipsis) {
                                return (
                                  <span key={pageNum} className="px-3 py-2 text-gray-400">
                                    ...
                                  </span>
                                );
                              }

                              if (!showPage) return null;

                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                                    currentPage === pageNum
                                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                                      : 'bg-gray-100 text-gray-700 hover:bg-emerald-100 hover:text-emerald-600'
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            })}
                          </div>

                          {/* Next Button */}
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-emerald-100 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium"
                          >
                            Next
                            <FaArrowRight className="text-sm" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column: Status & Info Cards */}
          <div className="space-y-6">
            {/* Subscription Status Card */}
            <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <FaCheckCircle className="text-2xl" />
                  </div>
                  <h3 className="font-bold text-xl">Subscription Status</h3>
                </div>

                <div className="space-y-4">
                  <StatusItem 
                    icon={<FaCalendarAlt />}
                    label="Next Delivery"
                    value={nextDelivery ? new Date(nextDelivery).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    }) : 'Not Set'}
                  />
                  <StatusItem 
                    icon={<FaClock />}
                    label="Frequency"
                    value={frequency}
                  />
                  <StatusItem 
                    icon={<FaBox />}
                    label="Total Items"
                    value={activeBundle.length}
                  />
                  <StatusItem 
                    icon={<FaPercent />}
                    label="Savings"
                    value={`৳${savings}`}
                  />
                </div>
              </div>

              {/* Progress Indicator */}
              {activeBundle.length > 0 && (
                <div className="bg-white/10 backdrop-blur-sm p-4 border-t border-white/20">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Bundle Progress</span>
                    <span className="font-semibold">{activeBundle.length} / 10 items</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((activeBundle.length / 10) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* How It Works Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
                <FaStar className="text-yellow-500" />
                How It Works
              </h3>
              <div className="space-y-4">
                <StepItem 
                  number="1"
                  title="Choose Your Items"
                  description="Select products you need regularly"
                />
                <StepItem 
                  number="2"
                  title="Set Frequency"
                  description="Pick weekly, bi-weekly, or monthly"
                />
                <StepItem 
                  number="3"
                  title="Save & Relax"
                  description="We'll deliver automatically"
                />
              </div>
            </div>

            {/* Promo Card */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <FaFire className="text-2xl animate-pulse" />
                <h3 className="font-bold text-xl">Limited Offer!</h3>
              </div>
              <p className="text-white/90 mb-4">
                Subscribe now and get <span className="font-bold text-2xl">15% OFF</span> on your first 3 orders!
              </p>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg inline-block">
                <span className="font-mono font-bold">SAVE15</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        {activeBundle.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 border-2 border-emerald-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Ready to start saving? 🎉
                </h3>
                <p className="text-gray-600">
                  Your bundle has {activeBundle.length} items worth ৳{totalValue}. 
                  You'll save ৳{savings} with subscription discount!
                </p>
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-3 bg-white border-2 border-emerald-600 text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-all">
                  Preview Bundle
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Benefit Card Component
function BenefitCard({ icon, title, description, gradient }) {
  return (
    <div className="group bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white text-2xl mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
        {icon}
      </div>
      <h3 className="font-bold text-lg text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

// Product Card Component
function ProductCard({ product, onAdd, isInBundle }) {
  return (
    <div className={`group relative bg-white rounded-xl border-2 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
      isInBundle ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-gray-200 hover:border-emerald-300'
    }`}>
      {/* Product Image */}
      <div className="h-32 bg-gray-100 relative overflow-hidden">
        <img 
          src={product.imageUrl || 'https://placehold.co/200x200?text=Product'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {isInBundle && (
          <div className="absolute top-2 right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg">
            <FaCheckCircle />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 mb-1">{product.name}</h4>
        <p className="text-emerald-600 font-bold mb-2">৳{product.price}</p>
        
        <button 
          onClick={onAdd}
          disabled={isInBundle}
          className={`w-full py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
            isInBundle 
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg'
          }`}
        >
          {isInBundle ? (
            <>
              <FaCheckCircle />
              In Bundle
            </>
          ) : (
            <>
              <FaPlus />
              Add to Bundle
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Status Item Component
function StatusItem({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl">
      <div className="flex items-center gap-3">
        <div className="text-xl">{icon}</div>
        <span className="text-emerald-100 text-sm">{label}</span>
      </div>
      <span className="font-bold text-lg">{value}</span>
    </div>
  );
}

// Step Item Component
function StepItem({ number, title, description }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
        {number}
      </div>
      <div>
        <h4 className="font-bold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}