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
import toast, { Toaster } from 'react-hot-toast';

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

  // --- 1. CRITICAL: AUTO-FETCH DATA ON LOAD ---
  const fetchData = async () => {
      setLoading(true);
      try {
          // A. Get All Products (for the picker list)
          const prodRes = await axios.get('/products');
          setAvailableProducts(prodRes.data);

          // B. Get User's Active Subscription
          try {
              const subRes = await axios.get('/subscription');
              
              if (subRes.data && subRes.data.items) {
                  // Map backend data to frontend structure
                  // We handle cases where 'product' is populated (object) or just an ID string
                  const formattedItems = subRes.data.items.map(i => {
                      const productObj = i.product || {};
                      return {
                          _id: productObj._id || i._id,
                          name: productObj.name || i.name || 'Unknown Item',
                          price: productObj.price || i.price || 0,
                          imageUrl: productObj.imageUrl || '', // Now we have the image!
                          quantity: i.quantity
                      };
                  });
                  
                  setActiveBundle(formattedItems);
                  setFrequency(subRes.data.frequency || 'Monthly');
                  setNextDelivery(subRes.data.nextDeliveryDate);
                  console.log("Subscription Synced:", formattedItems);
              }
          } catch (err) {
              console.log("No active subscription found (User hasn't subscribed yet).");
              setActiveBundle([]); // Reset if 404
          }
      } catch (error) {
          console.error("Error fetching page data:", error);
          toast.error("Failed to load subscription data");
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    fetchData();
  }, []); // Runs once when page mounts

  // --- 2. HANDLERS ---

  // Add Item to Local State
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

    if (itemExists) toast.error(`${product.name} is already in your bundle!`);
    else toast.success(`${product.name} added to bundle! 🎉`);
  };

  // Save Changes to Backend
 // Save Changes to Backend
  const handleSave = async (newItems) => {
    try {
        // FIX: Include 'price' and 'name' because the Mongoose Schema requires them!
        const backendItems = newItems.map(item => ({
            product: item._id, 
            name: item.name,      // Added
            quantity: item.quantity,
            price: item.price     // Added (Crucial fix)
        }));

        const payload = { items: backendItems, frequency };
        
        // Debugging: Check console to ensure price is now present
        console.log("Sending Payload:", payload);

        await axios.post('/subscription', payload);
        
        // Re-fetch to ensure we have the cleanest data (and images) from DB
        await fetchData(); 
        toast.success('Subscription updated successfully! ✅');
    } catch (error) {
        toast.error('Error saving subscription. Please try again.');
        console.error("Save Error:", error.response?.data?.message || error.message);
    }
  };

  // --- 3. UI HELPERS (Filters, Pagination, Slider) ---
  const categories = ['All', 'Dairy', 'Vegetables', 'Fruits', 'Staples', 'Protein'];
  const filteredProducts = availableProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  const featuredProducts = availableProducts.slice(0, 6);
  const visibleSlides = 3;
  const maxSliderIndex = Math.max(0, featuredProducts.length - visibleSlides);

  const nextSlide = () => setSliderIndex(prev => Math.min(prev + 1, maxSliderIndex));
  const prevSlide = () => setSliderIndex(prev => Math.max(prev - 1, 0));

  // Reset page on filter change
  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedCategory]);

  const totalValue = activeBundle.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = Math.round(totalValue * 0.15); // 15% Savings

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your subscription...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <Navbar />
      <Toaster position="top-right" />
      
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
            
            {/* Bundle Builder Component */}
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
                      Featured Picks
                    </h3>
                    <p className="text-purple-100 text-sm">Popular items perfect for subscription</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={prevSlide}
                      disabled={sliderIndex === 0}
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-all disabled:opacity-50"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={nextSlide}
                      disabled={sliderIndex >= maxSliderIndex}
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-all disabled:opacity-50"
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
                        <button className="w-full py-2 bg-white text-purple-600 rounded-lg font-semibold text-sm hover:bg-purple-50 flex items-center justify-center gap-2">
                          <FaPlus /> Quick Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Add Items Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <FaBox /> Add Items to Bundle
                </h3>
                <p className="text-emerald-50">Browse and select products for your subscription</p>
              </div>

              {/* Search & Filter */}
              <div className="p-6 border-b border-gray-200 space-y-4">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
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
                      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 flex items-center gap-2"
                        >
                          <FaArrowLeft /> Previous
                        </button>
                        <span className="text-gray-600">Page {currentPage} of {totalPages}</span>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 flex items-center gap-2"
                        >
                          Next <FaArrowRight />
                        </button>
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
            <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white rounded-2xl shadow-xl overflow-hidden sticky top-24">
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
                      month: 'short', day: 'numeric', year: 'numeric'
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
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

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

function ProductCard({ product, onAdd, isInBundle }) {
  return (
    <div className={`group relative bg-white rounded-xl border-2 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
      isInBundle ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-gray-200 hover:border-emerald-300'
    }`}>
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
          {isInBundle ? <><FaCheckCircle /> In Bundle</> : <><FaPlus /> Add to Bundle</>}
        </button>
      </div>
    </div>
  );
}

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