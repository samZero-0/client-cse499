'use client';
import { useState, useEffect } from 'react';
import { FaTrashAlt, FaPlus, FaMinus, FaSave, FaBox, FaTags } from 'react-icons/fa';

export default function BundleBuilder({ initialItems, onSave, savings }) {
  const [items, setItems] = useState(initialItems || []);

  // Keep items in sync with parent's changes
  useEffect(() => {
    setItems(initialItems || []);
  }, [initialItems]);

  // 1. Update Quantity (or remove if zero)
  const updateQuantity = (id, change) => {
    setItems(prev => {
        return prev
            .map(item => item._id === id 
                 ? { ...item, quantity: item.quantity + change }
                 : item
            )
            .filter(item => item.quantity > 0); // Remove if qty goes to zero
    });
  };

  // 2. Remove Item
  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item._id !== id));
  };

  // 3. Calculate Totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = savings || Math.round(subtotal * 0.15);
  const total = subtotal - discount;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <FaBox className="text-3xl" />
              Your Bundle
            </h3>
            <p className="text-emerald-50">
              {items.length === 0 ? 'Start building your subscription' : `${items.length} items selected`}
            </p>
          </div>
          {items.length > 0 && (
            <div className="text-right">
              <p className="text-sm text-emerald-100">Estimated Savings</p>
              <p className="text-3xl font-bold">৳{discount}</p>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBox className="text-4xl text-gray-400" />
            </div>
            <h4 className="text-xl font-bold text-gray-800 mb-2">Bundle is Empty</h4>
            <p className="text-gray-500 max-w-md mx-auto">
              Browse products below and click "Add to Bundle" to start building your subscription package
            </p>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="space-y-3 mb-6">
              {items.map((item, index) => (
                <div 
                  key={item._id} 
                  className="group flex items-start gap-4 p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all duration-300"
                  style={{ animation: `fadeInUp 0.3s ease-out ${index * 0.05}s` }}
                >
                  {/* Item Image */}
                  <div className="w-16 h-16 bg-white rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
                    <img 
                      src={item.imageUrl || 'https://placehold.co/100x100?text=Item'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Item Info */}
                  <div className="flex-grow">
                    <h4 className="font-bold text-gray-900 mb-1">{item.name}</h4>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-600">৳{item.price} × {item.quantity}</span>
                      <span className="font-bold text-emerald-600">= ৳{item.price * item.quantity}</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-col gap-2">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item._id, -1)} 
                        className="p-2 hover:bg-red-50 text-red-600 transition-colors"
                        title="Decrease quantity"
                      >
                        <FaMinus className="text-xs" />
                      </button>
                      <span className="font-bold text-gray-800 px-3 text-center min-w-[2rem]">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item._id, 1)}
                        className="p-2 hover:bg-green-50 text-green-600 transition-colors"
                        title="Increase quantity"
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item._id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      title="Remove item"
                    >
                      <FaTrashAlt className="text-xs" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Breakdown */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 mb-6 border-2 border-emerald-200">
              <div className="space-y-3">
                {/* Subtotal */}
                <div className="flex justify-between items-center text-gray-700">
                  <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span className="font-semibold">৳{subtotal}</span>
                </div>

                {/* Discount */}
                <div className="flex justify-between items-center text-green-600">
                  <span className="flex items-center gap-2">
                    <FaTags />
                    Subscription Discount (15%)
                  </span>
                  <span className="font-semibold">- ৳{discount}</span>
                </div>

                {/* Divider */}
                <div className="border-t-2 border-emerald-300 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 line-through">৳{subtotal}</div>
                      <div className="text-2xl font-bold text-emerald-600">৳{total}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button 
              onClick={() => onSave(items)} 
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
            >
              <FaSave className="text-xl group-hover:scale-110 transition-transform" />
              Save Subscription Bundle
            </button>

            {/* Info Note */}
            <p className="text-center text-sm text-gray-500 mt-4">
              💡 You can modify your bundle anytime. Changes will apply to your next delivery.
            </p>
          </>
        )}
      </div>
    </div>
  );
}