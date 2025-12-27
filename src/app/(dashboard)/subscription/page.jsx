'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/common/Navbar';
import BundleBuilder from '@/components/subscription/BundleBuilder';
import useAxios from '@/hooks/useAxios';

export default function SubscriptionPage() {
  const [activeBundle, setActiveBundle] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [frequency, setFrequency] = useState('Monthly');
  const [nextDelivery, setNextDelivery] = useState(null);
  const axios = useAxios();

  // 1. Fetch Subscription AND All Products on Load
  useEffect(() => {
    const fetchData = async () => {
        try {
            // A. Get all products (to show in the "Add Items" list)
            const prodRes = await axios.get('/products');
            setAvailableProducts(prodRes.data);

            // B. Get current subscription (if it exists)
            try {
                const subRes = await axios.get('/subscription');
                if (subRes.data) {
                    // Transform backend data (nested objects) to frontend flat format
                    const formattedItems = subRes.data.items.map(i => ({
                        _id: i.product._id, // Crucial: use _id
                        name: i.product.name,
                        price: i.product.price,
                        quantity: i.quantity
                    }));
                    setActiveBundle(formattedItems);
                    setFrequency(subRes.data.frequency);
                    setNextDelivery(subRes.data.nextDeliveryDate);
                }
            } catch (err) {
                console.log("No active subscription found (New user).");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    fetchData();
  }, []);

  // 2. Function to Add an Item to the Bundle
  const addToBundle = (product) => {
    let itemExists = false;

    setActiveBundle(prev => {
        // Check if item already exists in the bundle
        const exists = prev.find(item => item._id === product._id);
        
        if (exists) {
            itemExists = true;
            return prev; // Do nothing if it exists
        }
        
        // Add new item with quantity 1
        return [...prev, { ...product, quantity: 1 }];
    });

    // Visual feedback
    if (itemExists) {
        alert(`${product.name} is already in your bundle! You can increase the quantity in the builder above.`);
    }
  };

  // 3. Save Subscription to Backend
  const handleSave = async (newItems) => {
    try {
        // Transform frontend items back to backend format (product ID + qty)
        const backendItems = newItems.map(item => ({
            product: item._id,
            quantity: item.quantity
        }));

        const payload = {
            items: backendItems,
            frequency
        };

        const { data } = await axios.post('/subscription', payload);
        
        // Refresh state with returned data
        const formattedItems = data.items.map(i => ({
             _id: i.product._id, 
             name: i.product.name,
             price: i.product.price,
             quantity: i.quantity
        }));
        
        setActiveBundle(formattedItems);
        setNextDelivery(data.nextDeliveryDate);
        alert('Subscription Updated Successfully!');
    } catch (error) {
        alert('Error saving subscription');
        console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Subscription Manager</h1>
                <p className="text-gray-500">Customize your recurring essential deliveries.</p>
            </div>
            
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border shadow-sm">
                <label className="font-semibold text-gray-700">Frequency:</label>
                <select 
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-green-600 font-bold cursor-pointer outline-none"
                >
                    <option>Weekly</option>
                    <option>Bi-Weekly</option>
                    <option>Monthly</option>
                </select>
            </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Column: Bundle Builder & Item Picker */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* 1. The Bundle Builder (Selected Items) */}
                <BundleBuilder initialItems={activeBundle} onSave={handleSave} />

                {/* 2. Add New Items Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Add Items to Bundle</h3>
                    
                    {availableProducts.length === 0 ? (
                        <p className="text-gray-500">Loading products...</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {availableProducts.map(product => (
                                <div 
                                    key={product._id} 
                                    className="border p-4 rounded-lg hover:border-green-500 hover:shadow-md cursor-pointer transition flex flex-col justify-between bg-gray-50 hover:bg-white"
                                    onClick={() => addToBundle(product)}
                                >
                                    <div>
                                        <p className="font-semibold text-gray-800 line-clamp-1">{product.name}</p>
                                        <p className="text-sm text-gray-500">৳{product.price}</p>
                                    </div>
                                    <button className="text-green-600 text-sm font-bold mt-3 text-left">
                                        + Add to Bundle
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Right Column: Status Card */}
            <div className="bg-green-600 text-white p-6 rounded-xl shadow-md h-fit sticky top-24">
                <h3 className="font-bold text-xl mb-4">Subscription Status</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-green-500 pb-2">
                         <span className="text-green-100">Next Delivery</span>
                         <span className="font-semibold">
                             {nextDelivery ? new Date(nextDelivery).toDateString() : 'Not Set'}
                         </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-green-500">
                        <span className="text-green-100">Frequency</span>
                        <span className="font-semibold">{frequency}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2">
                        <span className="text-green-100">Total Items</span>
                        <span className="font-semibold">{activeBundle.length}</span>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}