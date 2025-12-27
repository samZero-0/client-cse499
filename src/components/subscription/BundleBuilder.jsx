'use client';
import { useState, useEffect } from 'react';
import Button from '@/components/common/Button';

export default function BundleBuilder({ initialItems, onSave }) {
  const [items, setItems] = useState(initialItems);

  // --- THE FIX: Sync state when props change ---
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]); 
  // ---------------------------------------------

  const updateQuantity = (id, change) => {
    setItems(prevItems => prevItems.map(item => {
      if (item._id === id) { // Make sure to use _id
        const newQty = Math.max(0, item.quantity + change);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0)); // Remove if qty is 0
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Your Monthly Bundle</h3>
      
      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-dashed border-2">
            <p>Your bundle is empty.</p>
            <p className="text-sm">Add items from the list below 👇</p>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={item._id} className="flex justify-between items-center border-b border-gray-100 pb-2">
              <div>
                <p className="font-semibold text-gray-700">{item.name}</p>
                <p className="text-xs text-gray-500">৳{item.price} each</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                    onClick={() => updateQuantity(item._id, -1)} 
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold flex items-center justify-center"
                >
                    -
                </button>
                <span className="w-4 text-center font-medium">{item.quantity}</span>
                <button 
                    onClick={() => updateQuantity(item._id, 1)} 
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-green-600 font-bold flex items-center justify-center"
                >
                    +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div>
          <p className="text-sm text-gray-500">Estimated Total</p>
          <p className="text-2xl font-bold text-green-600">৳{total}</p>
        </div>
        <Button onClick={() => onSave(items)} disabled={items.length === 0}>
          Save Bundle
        </Button>
      </div>
    </div>
  );
}