import React, { useState, useEffect } from 'react';
import ExpiryAlert from './ExpiryAlert';
import PantryItemDetail from './PantryItemDetail'; 

const PantryList = () => {
  const [pantryItems, setPantryItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/pantry'); 
      const data = await response.json();
      setPantryItems(data);
    } catch (error) {
      console.error("Error fetching pantry items:", error);
    }
  };

  // --- 1. SMART IMAGE MAPPER ---
  // If the DB has no image, this picks one based on the name!
  const getFallbackImage = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('tomato')) return 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500';
    if (lowerName.includes('egg')) return 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500';
    if (lowerName.includes('cola') || lowerName.includes('coke') || lowerName.includes('soda')) return 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500';
    if (lowerName.includes('milk')) return 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500';
    if (lowerName.includes('rice')) return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500';
    if (lowerName.includes('potato')) return 'https://images.unsplash.com/photo-1518977676605-dcad023188ee?w=500';
    // Default placeholder if no keyword matches
    return 'https://via.placeholder.com/400x300?text=No+Image'; 
  };

  // --- 2. DATA NORMALIZER ---
  // Fixes missing images and prices before rendering
  const normalizeItem = (item) => {
    // Check DB image -> Check Product image -> Use Fallback
    const foundImage = 
      item.image || 
      item.imageUrl || 
      item.product?.imageUrl || 
      getFallbackImage(item.name); // <--- Smart Fallback applied here

    return {
      ...item,
      shelfLifeDays: item.shelfLifeDays || item.shelfLife || 0, 
      product: {
        ...item.product,
        imageUrl: foundImage,     
        price: item.price || item.product?.price || 0 
      }
    };
  };

  // Helper: Calculate Days Left
  const getDaysLeft = (purchaseDate, shelfLifeDays) => {
    if (!purchaseDate || !shelfLifeDays) return "N/A";
    const start = new Date(purchaseDate);
    const expiryDate = new Date(start);
    expiryDate.setDate(start.getDate() + parseInt(shelfLifeDays));
    
    const today = new Date();
    const diffTime = expiryDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const expiringCount = pantryItems.filter(item => {
    const days = getDaysLeft(item.purchaseDate, item.shelfLifeDays);
    return typeof days === 'number' && days <= 3 && days >= 0;
  }).length;

  const handleConsumed = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/pantry/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setPantryItems((prev) => prev.filter((i) => i._id !== id));
        setSelectedItem(null); 
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="p-4">
      <ExpiryAlert count={expiringCount} />

      {/* Detail Modal */}
      {selectedItem && (
        <PantryItemDetail 
          item={normalizeItem(selectedItem)} // Passes the fixed image to the modal
          onClose={() => setSelectedItem(null)} 
          onConsume={() => handleConsumed(selectedItem._id)}
        />
      )}

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pantryItems.map((rawItem) => {
          const item = normalizeItem(rawItem);
          const daysLeft = getDaysLeft(item.purchaseDate, item.shelfLifeDays);
          const isExpired = typeof daysLeft === 'number' && daysLeft < 0;

          return (
            <div 
              key={item._id} 
              onClick={() => setSelectedItem(rawItem)}
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
            >
              {/* Image Section */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={item.product.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=Error"; }} 
                />
                
                {/* Days Left Badge */}
                <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                  daysLeft <= 3 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {isExpired ? 'Expired' : `${daysLeft} days left`}
                </span>
              </div>

              {/* Content Section */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-400">
                      Added: {new Date(item.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                    ৳{item.product.price}
                  </span>
                </div>

                <div className="mt-auto pt-4 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); 
                      handleConsumed(item._id);
                    }}
                    className="w-full py-2 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-xl font-medium transition-colors text-sm"
                  >
                    Consumed
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PantryList;