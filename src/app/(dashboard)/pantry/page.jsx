'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/common/Navbar';
import PantryItemDetail from '@/components/pantry/PantryItemDetail';
import useAxios from '@/hooks/useAxios';
import { calculateExpiry } from '@/utils/calculateExpiry'; // Ensure you have this utility
import toast, { Toaster } from 'react-hot-toast';
import { 
  FaBoxOpen, FaExclamationCircle, FaLeaf, FaSearch, 
  FaPlus, FaChartPie, FaCalendarAlt, FaFire, FaCheckCircle, FaClock, FaTrash 
} from 'react-icons/fa';

export default function PantryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('expiry');
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
          toast.error("Failed to load pantry");
          setLoading(false);
      }
  };

  // --- STATS LOGIC ---
  const calculateStats = () => {
    let expiring = 0;
    let expired = 0;
    let fresh = 0;
    let totalVal = 0;

    items.forEach(item => {
        const { status, daysLeft } = calculateExpiry(item.purchaseDate, item.shelfLifeDays);
        if (status === 'expired') expired++;
        else if (daysLeft <= 3) expiring++;
        else fresh++;

        // Handle case where product might be null (deleted from store)
        const price = item.product?.price || 0;
        totalVal += price;
    });

    return { expiring, expired, fresh, totalVal };
  };

  const { expiring, expired, fresh, totalVal } = calculateStats();

  // --- FILTER & SORT ---
  const filteredItems = items.filter(item => {
    const itemName = item.name || item.product?.name || "Unknown";
    const matchesSearch = itemName.toLowerCase().includes(searchTerm.toLowerCase());
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
      return (a.name || "").localeCompare(b.name || "");
    } else {
      return new Date(b.purchaseDate) - new Date(a.purchaseDate);
    }
  });

  const handleConsume = () => {
    toast.success("Item updated! ✅");
    setSelectedItem(null);
    fetchPantry();
  };

  if (loading) return <div className="text-center py-20">Loading Pantry...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 py-8 flex-grow">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Smart Pantry 🥬</h1>
            <p className="text-gray-500">Track what you bought & reduce waste.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Items" value={items.length} icon={<FaBoxOpen />} color="blue" />
          <StatCard title="Value" value={`৳${totalVal}`} icon={<FaChartPie />} color="emerald" />
          <StatCard title="Expiring Soon" value={expiring} icon={<FaClock />} color="orange" alert={expiring > 0} />
          <StatCard title="Fresh" value={fresh} icon={<FaCheckCircle />} color="green" />
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search items..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
             {['all', 'fresh', 'expiring', 'expired'].map(status => (
                <button 
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap ${filterStatus === status ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  {status}
                </button>
             ))}
          </div>
        </div>

        {/* Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No items found. Go buy something!</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <PantryCard 
                key={item._id} 
                item={item} 
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </div>
        )}

      </div>

      {/* Modal */}
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

// Sub-components
function StatCard({ title, value, icon, color, alert }) {
    const colors = {
        blue: 'bg-blue-100 text-blue-600',
        emerald: 'bg-emerald-100 text-emerald-600',
        orange: 'bg-orange-100 text-orange-600',
        green: 'bg-green-100 text-green-600'
    };
    return (
        <div className={`bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4 ${alert ? 'ring-2 ring-orange-400' : ''}`}>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${colors[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-500 text-xs uppercase font-bold">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
}

function PantryCard({ item, onClick }) {
    const { status, daysLeft } = calculateExpiry(item.purchaseDate, item.shelfLifeDays);
    
    // Config based on status
    let badgeColor = 'bg-green-100 text-green-700';
    let label = `${daysLeft} days left`;
    
    if (status === 'expired') {
        badgeColor = 'bg-red-100 text-red-700';
        label = 'Expired';
    } else if (daysLeft <= 3) {
        badgeColor = 'bg-orange-100 text-orange-700';
    }

    // Use fallback image if product populated data is missing
    const imgUrl = item.product?.imageUrl || 'https://placehold.co/600x400?text=No+Image';
    const price = item.product?.price || 0;

    return (
      <div 
        onClick={onClick}
        className="group bg-white rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer overflow-hidden"
      >
        <div className="h-40 bg-gray-100 relative">
          <img src={imgUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
          <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${badgeColor}`}>
            {label}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-gray-800 line-clamp-1">{item.name}</h3>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">Added: {new Date(item.purchaseDate).toLocaleDateString()}</span>
            <span className="font-bold text-emerald-600">৳{price}</span>
          </div>
        </div>
      </div>
    );
}