'use client';
import { FaTimes, FaUtensils, FaTrash, FaCheck, FaCalendarAlt, FaBoxOpen, FaInfoCircle } from 'react-icons/fa';
import { calculateExpiry } from '@/utils/calculateExpiry';

export default function PantryItemDetail({ item, onClose, onConsume }) {
  if (!item) return null;

  const { daysLeft, status } = calculateExpiry(item.purchaseDate, item.shelfLifeDays);
  
  // Calculate percentage for Freshness Bar
  const freshnessPercent = Math.max(0, Math.min(100, (daysLeft / item.shelfLifeDays) * 100));
  
  // Dynamic Color based on freshness
  let statusConfig = {
    gradient: 'from-green-500 to-emerald-500',
    badge: 'bg-green-100 text-green-700',
    text: `${daysLeft} Days Left`
  };

  if (status === 'expired') {
    statusConfig = {
      gradient: 'from-red-500 to-pink-500',
      badge: 'bg-red-100 text-red-700',
      text: 'Expired'
    };
  } else if (daysLeft <= 3) {
    statusConfig = {
      gradient: 'from-orange-500 to-red-500',
      badge: 'bg-orange-100 text-orange-700',
      text: `${daysLeft} Days Left`
    };
  } else if (daysLeft <= 7) {
    statusConfig = {
      gradient: 'from-yellow-500 to-orange-500',
      badge: 'bg-yellow-100 text-yellow-700',
      text: `${daysLeft} Days Left`
    };
  }

  // Mock Recipe Data
  const mockRecipes = [
    { name: `Spicy ${item.name} Curry`, time: '30 mins', difficulty: 'Easy' },
    { name: `Fried ${item.name} with Rice`, time: '20 mins', difficulty: 'Easy' },
    { name: `Healthy ${item.name} Salad`, time: '10 mins', difficulty: 'Very Easy' }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden transform animate-scale-in max-h-[90vh] overflow-y-auto">
        
        {/* Header Image */}
        <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
          <img 
            src={item.product?.imageUrl || 'https://placehold.co/600x400?text=Pantry+Item'} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white text-gray-800 transition-all shadow-lg group"
          >
            <FaTimes className="group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Status Badge */}
          <div className={`absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-bold ${statusConfig.badge} backdrop-blur-sm shadow-lg flex items-center gap-2`}>
            <FaInfoCircle />
            {statusConfig.text}
          </div>

          {/* Item Name on Image */}
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">{item.name}</h2>
            <p className="text-white/90 text-sm mt-1 flex items-center gap-2">
              <FaCalendarAlt />
              Added on {new Date(item.purchaseDate).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>

        <div className="p-8">
          {/* Item Details Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <DetailCard 
              label="Shelf Life"
              value={`${item.shelfLifeDays} days`}
              icon={<FaBoxOpen />}
              gradient="from-blue-500 to-cyan-500"
            />
            <DetailCard 
              label="Days Left"
              value={daysLeft >= 0 ? daysLeft : 0}
              icon={<FaCalendarAlt />}
              gradient={statusConfig.gradient}
            />
            <DetailCard 
              label="Value"
              value={`৳${item.product?.price || 0}`}
              icon={<FaBoxOpen />}
              gradient="from-emerald-500 to-teal-500"
            />
          </div>

          {/* Freshness Meter */}
          <div className="mb-8 bg-gray-50 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-900 text-lg">Freshness Level</h3>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {Math.round(freshnessPercent)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
              <div 
                className={`h-full bg-gradient-to-r ${statusConfig.gradient} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`} 
                style={{ width: `${freshnessPercent}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 flex items-center gap-2">
              <FaInfoCircle />
              Based on {item.shelfLifeDays}-day shelf life from purchase date
            </p>
          </div>

          {/* Recipe Suggestions */}
          <div className="mb-8">
            <h3 className="font-bold text-gray-900 text-xl mb-4 flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white">
                <FaUtensils />
              </div>
              Recipe Suggestions
            </h3>
            <div className="space-y-3">
              {mockRecipes.map((recipe, idx) => (
                <div 
                  key={idx} 
                  className="group flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 rounded-xl border-2 border-orange-200 hover:border-orange-300 cursor-pointer transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{recipe.name}</p>
                      <p className="text-xs text-gray-600">{recipe.difficulty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-orange-700 bg-white px-3 py-1 rounded-lg font-medium shadow-sm">
                      {recipe.time}
                    </span>
                    <FaUtensils className="text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full py-3 border-2 border-dashed border-orange-300 text-orange-600 rounded-xl font-medium hover:bg-orange-50 transition-all">
              + View More Recipes
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button 
              onClick={onConsume}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold hover:from-emerald-700 hover:to-teal-700 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <FaCheck className="text-lg" />
              Mark as Consumed
            </button>
            <button className="px-6 py-4 border-2 border-gray-200 text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all group">
              <FaTrash className="group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Pro Tip */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-900">
              <span className="font-bold">💡 Pro Tip:</span> Store {item.name} properly to maximize freshness. 
              Keep in a cool, dry place away from direct sunlight.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Detail Card Component
function DetailCard({ label, value, icon, gradient }) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-all">
      <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center text-white mx-auto mb-2`}>
        {icon}
      </div>
      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}