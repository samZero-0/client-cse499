'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/common/Navbar';
import PantryList from '@/components/pantry/PantryList';
import ExpiryAlert from '@/components/pantry/ExpiryAlert';
import PantryItemDetail from '@/components/pantry/PantryItemDetail';
import useAxios from '@/hooks/useAxios';
import { calculateExpiry } from '@/utils/calculateExpiry';
import toast from 'react-hot-toast';
import { 
  FaBoxOpen, FaExclamationCircle, FaLeaf, FaSearch, FaFilter, FaSortAmountDown,
  FaPlus, FaChartPie, FaCalendarAlt, FaFire, FaCheckCircle, FaClock, FaTrash
} from 'react-icons/fa';

export default function PantryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, fresh, expiring, expired
  const [sortBy, setSortBy] = useState('expiry'); // expiry, name, date
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const axios = useAxios();

  useEffect(() => {
      fetchPantry();
  }, []);

  const fetchPantry = async () => {
      try {
          const { data } = await axios.get('/pantry');
          setItems(data);
          setLoading(false);
      } catch (error) {
          console.error("Error fetching pantry", error);
          setLoading(false);
      }
  };

  // Enhanced Stats Logic
  const expiringCount = items.filter(item => {
      const { daysLeft } = calculateExpiry(item.purchaseDate, item.shelfLifeDays);
      return daysLeft <= 3 && daysLeft >= 0;
  }).length;

  const expiredCount = items.filter(item => {
      const { status } = calculateExpiry(item.purchaseDate, item.shelfLifeDays);
      return status === 'expired';
  }).length;

  const freshCount = items.filter(item => {
      const { daysLeft } = calculateExpiry(item.purchaseDate, item.shelfLifeDays);
      return daysLeft > 7;
  }).length;
  
  const totalValue = items.reduce((acc, item) => acc + (item.product?.price || 0), 0);

  // Filter and Sort Logic
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const { status, daysLeft } = calculateExpiry(item.purchaseDate, item.shelfLifeDays);
    
    let matchesFilter = true;
    if (filterStatus === 'fresh') matchesFilter = daysLeft > 7;
    else if (filterStatus === 'expiring') matchesFilter = daysLeft <= 7 && daysLeft >= 0;
    else if (filterStatus === 'expired') matchesFilter = status === 'expired';
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    if (sortBy === 'expiry') {
      const daysA = calculateExpiry(a.purchaseDate, a.shelfLifeDays).daysLeft;
      const daysB = calculateExpiry(b.purchaseDate, b.shelfLifeDays).daysLeft;
      return daysA - daysB;
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      return new Date(b.purchaseDate) - new Date(a.purchaseDate);
    }
  });

  // Handlers
  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleConsume = () => {
    toast.success("Item marked as consumed! ✅");
    setSelectedItem(null);
    fetchPantry();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your pantry...</p>
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
                My Smart Pantry 🥬
              </h1>
              <p className="text-gray-600 text-lg">Track, manage, and reduce food waste efficiently</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
              <FaPlus />
              Add Item
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Items" 
            value={items.length}
            icon={<FaBoxOpen />}
            gradient="from-blue-500 to-cyan-500"
            description="In your pantry"
          />
          <StatCard 
            title="Pantry Value" 
            value={`৳${totalValue}`}
            icon={<FaLeaf />}
            gradient="from-emerald-500 to-teal-500"
            description="Total worth"
          />
          <StatCard 
            title="Expiring Soon" 
            value={expiringCount}
            icon={<FaClock />}
            gradient="from-orange-500 to-red-500"
            description="Use within 3 days"
            alert={expiringCount > 0}
          />
          <StatCard 
            title="Fresh Items" 
            value={freshCount}
            icon={<FaCheckCircle />}
            gradient="from-green-500 to-emerald-500"
            description="Good for 7+ days"
          />
        </div>

        {/* Alert Banner */}
        {expiringCount > 0 && (
          <div className="mb-8 bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 rounded-r-2xl p-6 flex items-start gap-4 shadow-md animate-fade-in">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white text-2xl flex-shrink-0 animate-pulse">
              <FaFire />
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-orange-900 text-lg mb-1">⚠️ Action Required!</h3>
              <p className="text-orange-800">
                You have <span className="font-bold">{expiringCount}</span> items expiring within 3 days. 
                Use them soon to avoid waste and save money!
              </p>
            </div>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-all whitespace-nowrap">
              View Items
            </button>
          </div>
        )}

        {/* Search, Filter & Sort Toolbar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-grow relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search pantry items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'all', label: 'All', icon: <FaBoxOpen /> },
                { value: 'fresh', label: 'Fresh', icon: <FaCheckCircle /> },
                { value: 'expiring', label: 'Expiring', icon: <FaClock /> },
                { value: 'expired', label: 'Expired', icon: <FaTrash /> },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setFilterStatus(filter.value)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    filterStatus === filter.value
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.icon}
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-gray-700 font-medium"
            >
              <option value="expiry">Sort by Expiry</option>
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date Added</option>
            </select>
          </div>
        </div>

        {/* Pantry Items Display */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {items.length === 0 ? 'Your pantry is empty' : 'No items match your filters'}
            </h3>
            <p className="text-gray-500 mb-6">
              {items.length === 0 
                ? 'Start shopping to add items to your pantry!' 
                : 'Try adjusting your search or filter criteria'}
            </p>
            {items.length === 0 && (
              <button className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-teal-700 transition-all">
                Go Shopping
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <PantryCard 
                key={item._id} 
                item={item} 
                onClick={() => handleItemClick(item)}
              />
            ))}
          </div>
        )}

        {/* Insights Section */}
        {items.length > 0 && (
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {/* Chef's Corner */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl">
                  👨‍🍳
                </div>
                <h2 className="text-2xl font-bold">Chef's Suggestions</h2>
              </div>
              <p className="text-white/90 mb-6">
                Based on your pantry, you can make delicious recipes! Use items before they expire.
              </p>
              <button className="px-6 py-3 bg-white text-orange-600 rounded-xl font-bold hover:bg-orange-50 transition-all shadow-lg">
                View Recipes
              </button>
            </div>

            {/* Waste Reduction Stats */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white text-2xl">
                  <FaChartPie />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Your Impact</h2>
              </div>
              <div className="space-y-4">
                <ImpactStat label="Money Saved" value="৳2,450" color="text-green-600" />
                <ImpactStat label="Waste Prevented" value="5.2 kg" color="text-blue-600" />
                <ImpactStat label="CO₂ Reduced" value="12.8 kg" color="text-purple-600" />
              </div>
              <p className="text-sm text-gray-500 mt-6">
                Great job! You're making a positive environmental impact. 🌍
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Modal Popup */}
      {selectedItem && (
        <PantryItemDetail 
            item={selectedItem} 
            onClose={() => setSelectedItem(null)} 
            onConsume={handleConsume}
        />
      )}
    </div>
  );
}

// Enhanced Stat Card Component
function StatCard({ title, value, icon, gradient, description, alert }) {
  return (
    <div className={`group bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${alert ? 'ring-2 ring-orange-400' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
          {icon}
        </div>
        {alert && (
          <div className="animate-pulse">
            <FaExclamationCircle className="text-orange-500 text-xl" />
          </div>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wide mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}

// Enhanced Pantry Card Component
function PantryCard({ item, onClick }) {
    const { status, daysLeft } = calculateExpiry(item.purchaseDate, item.shelfLifeDays);
    
    let statusConfig = {
      bg: 'from-green-500 to-emerald-500',
      text: `${daysLeft} days left`,
      badge: 'bg-green-100 text-green-700',
      ring: 'ring-green-200'
    };

    if (status === 'expired') {
      statusConfig = {
        bg: 'from-red-500 to-pink-500',
        text: 'Expired',
        badge: 'bg-red-100 text-red-700',
        ring: 'ring-red-200'
      };
    } else if (daysLeft <= 3) {
      statusConfig = {
        bg: 'from-orange-500 to-red-500',
        text: `${daysLeft} days left`,
        badge: 'bg-orange-100 text-orange-700',
        ring: 'ring-orange-200'
      };
    } else if (daysLeft <= 7) {
      statusConfig = {
        bg: 'from-yellow-500 to-orange-500',
        text: `${daysLeft} days left`,
        badge: 'bg-yellow-100 text-yellow-700',
        ring: 'ring-yellow-200'
      };
    }

    const freshnessPercent = Math.max(0, Math.min(100, (daysLeft / item.shelfLifeDays) * 100));

    return (
      <div 
        onClick={onClick}
        className={`group bg-white rounded-2xl shadow-sm border-2 ${statusConfig.ring} hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 overflow-hidden`}
      >
        {/* Image Section */}
        <div className="h-48 bg-gray-100 relative overflow-hidden">
          <img 
            src={item.product?.imageUrl || 'https://placehold.co/600x400?text=Food'} 
            alt={item.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Status Badge */}
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${statusConfig.badge} backdrop-blur-sm shadow-lg`}>
            {statusConfig.text}
          </div>
          {/* Expiry Indicator */}
          {status === 'expiring_soon' && (
            <div className="absolute top-3 left-3 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold animate-pulse shadow-lg">
              {daysLeft}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{item.name}</h3>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <FaCalendarAlt className="text-emerald-500" />
            <span>Added {new Date(item.purchaseDate).toLocaleDateString()}</span>
          </div>

          {/* Freshness Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Freshness</span>
              <span className="font-semibold">{Math.round(freshnessPercent)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${statusConfig.bg} transition-all duration-500 rounded-full`}
                style={{ width: `${freshnessPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Price Tag */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Value</span>
            <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              ৳{item.product?.price || 0}
            </span>
          </div>
        </div>
      </div>
    );
}

// Impact Stat Component
function ImpactStat({ label, value, color }) {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
      <span className="text-gray-700 font-medium">{label}</span>
      <span className={`text-xl font-bold ${color}`}>{value}</span>
    </div>
  );
}