'use client';
import { useState, useEffect, useContext, Suspense } from 'react';
import Navbar from '@/components/common/Navbar';
import { useCart } from '@/context/CartContext';
import { AuthContext } from '@/context/AuthContext';
import useAxios from '@/hooks/useAxios';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  FaTrash, FaShoppingBag, FaTruck, FaTag, FaCheckCircle, FaTimes,
  FaPlus, FaMinus, FaArrowRight, FaGift, FaUser, FaMapMarkerAlt, FaSave
} from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

function CartPageContent() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, total, fetchCart } = useCart();
  const { user } = useContext(AuthContext);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [saveInfo, setSaveInfo] = useState(false); // <--- Checkbox State
  
  // Checkout Form State
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    paymentMethod: 'Cash on Delivery'
  });

  const axios = useAxios();
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. SMART CHECKOUT TRIGGER (From AI)
  useEffect(() => {
    if (searchParams.get('openCheckout') === 'true') {
      setShowCheckoutModal(true);
      // Clean up URL without refresh
      window.history.replaceState(null, '', '/cart');
    }
  }, [searchParams]);

  // 2. Pre-fill Form if User Data exists
  useEffect(() => {
    if (user) {
      setCustomerInfo(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',       // Assuming you added phone to User model
        address: user.address || '',   // Assuming you added address to User model
        city: user.city || ''          // Assuming you added city to User model
      }));
    }
  }, [user]);

  const deliveryFee = 60;
  const discount = 0;
  const finalTotal = total + deliveryFee - discount;

  const handleQuantityChange = (productId, change, currentQty) => {
    const newQuantity = Math.max(1, currentQty + change);
    updateQuantity(productId, newQuantity);
  };

  const handleConfirmCheckout = async () => {
    // Validation
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address || !customerInfo.city) {
      toast.error('Please fill in all required fields marked with *');
      return;
    }

    setIsProcessing(true);
    try {
      // A. Create Order
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item._id, // Ensure this matches your Context structure
          name: item.name,
          qty: item.quantity,
          price: item.price
        })),
        totalPrice: finalTotal,
        shippingAddress: {
          address: customerInfo.address,
          city: customerInfo.city
        },
        paymentMethod: customerInfo.paymentMethod,
        customerInfo: {
            name: customerInfo.name,
            phone: customerInfo.phone,
            email: customerInfo.email
        }
      };

      await axios.post('/orders', orderData);

      // B. Save User Info (If Checkbox Checked) - For "Smart Checkout" next time
      if (saveInfo) {
          try {
            await axios.put('/users/profile', {
                name: customerInfo.name,
                phone: customerInfo.phone,
                address: customerInfo.address,
                city: customerInfo.city
            });
            toast.success("Address saved for future AI checkouts!");
          } catch (err) {
            console.error("Failed to save profile info", err);
          }
      }

      // C. Success & Cleanup
      setIsProcessing(false);
      toast.success('🎉 Order placed successfully!');
      clearCart(); // Clear Context & DB
      setShowCheckoutModal(false);
      
      setTimeout(() => router.push('/dashboard'), 1500);

    } catch (error) {
      setIsProcessing(false);
      console.error(error);
      toast.error('Checkout failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <Toaster position="top-center" />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaShoppingBag className="text-emerald-600" />
            Shopping Cart
          </h1>
          <p className="text-gray-500">
            {cartItems.length > 0 ? `You have ${cartItems.length} items ready for checkout.` : 'Your cart is empty.'}
          </p>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingBag className="text-4xl text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Cart is Empty</h2>
            <p className="text-gray-500 mb-6">Go add some goodies to your cart!</p>
            <button 
              onClick={() => router.push('/products')}
              className="px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold transition shadow-lg"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* --- LEFT COLUMN: ITEMS --- */}
            <div className="lg:col-span-2 space-y-4">
              {/* Delivery Banner */}
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3 text-emerald-800">
                <FaTruck className="text-xl" />
                <div>
                  <p className="font-bold text-sm">Standard Delivery (৳{deliveryFee})</p>
                  <p className="text-xs">Estimated delivery: 24-48 hours</p>
                </div>
              </div>

              {/* Items List */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {cartItems.map((item) => (
                  <div key={item._id} className="p-6 border-b border-gray-100 last:border-0 flex flex-col sm:flex-row gap-4 items-center">
                    {/* Image */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={item.imageUrl || item.image || 'https://placehold.co/100'} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-grow text-center sm:text-left">
                      <h3 className="font-bold text-gray-800">{item.name}</h3>
                      <p className="text-emerald-600 font-medium">৳{item.price}</p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button 
                          onClick={() => handleQuantityChange(item._id, -1, item.quantity)}
                          className="px-3 py-1 hover:bg-gray-100 text-gray-600"
                        >
                          <FaMinus size={10} />
                        </button>
                        <span className="px-2 font-bold text-gray-800 text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item._id, 1, item.quantity)}
                          className="px-3 py-1 hover:bg-gray-100 text-gray-600"
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>
                      <button
                        onClick={async () => {
                          try {
                            await removeFromCart(item._id);
                            toast.success("Item removed from cart!", { icon: '🗑️' });
                          } catch (error) {
                            toast.error("Failed to remove item");
                          }
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Remove Item"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* --- RIGHT COLUMN: SUMMARY --- */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>
                
                <div className="space-y-3 text-sm border-b border-gray-100 pb-4 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>৳{total}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span>৳{deliveryFee}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-emerald-600">৳{finalTotal}</span>
                </div>

                <button
                  onClick={() => setShowCheckoutModal(true)}
                  className="w-full py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold shadow-lg transition flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <FaArrowRight />
                </button>

                <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
                  <FaCheckCircle className="text-green-500" /> Secure Checkout
                </p>
              </div>
              
              {/* Promo / Subscription Ad */}
              <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-6 text-white shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <FaGift className="text-xl" />
                  <h3 className="font-bold">Buying often?</h3>
                </div>
                <p className="text-sm opacity-90 mb-4">
                  Create a monthly subscription for these items and save 10%!
                </p>
                <button onClick={() => toast("Ask the AI Chatbot to 'Subscribe'!", { icon: '🤖' })} className="w-full py-2 bg-white text-orange-600 rounded-lg font-bold text-sm">
                  Ask AI to Subscribe
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* --- CHECKOUT MODAL --- */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
            
            {/* Modal Header */}
            <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-xl font-bold text-gray-800">Checkout Details</h2>
              <button onClick={() => setShowCheckoutModal(false)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500">
                <FaTimes />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              
              {/* Personal Info */}
              <div>
                <h3 className="text-sm font-bold text-emerald-600 uppercase mb-3 flex items-center gap-2">
                   <FaUser /> Contact Info
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Full Name *</label>
                    <input 
                      type="text" 
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Phone Number *</label>
                    <input 
                      type="text" 
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      placeholder="017..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1">Email</label>
                    <input 
                      type="email" 
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Address Info */}
              <div>
                <h3 className="text-sm font-bold text-emerald-600 uppercase mb-3 flex items-center gap-2">
                   <FaMapMarkerAlt /> Delivery Details
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1">Full Address *</label>
                    <textarea 
                      rows="2"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                      placeholder="House, Road, Area..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">City *</label>
                    <input 
                      type="text" 
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Payment Method</label>
                    <select 
                      value={customerInfo.paymentMethod}
                      onChange={(e) => setCustomerInfo({...customerInfo, paymentMethod: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                    >
                      <option>Cash on Delivery</option>
                      <option>Credit Card</option>
                      <option>Bkash / Nagad</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* --- SAVE INFO CHECKBOX --- */}
              <div className="bg-emerald-50 p-3 rounded-lg flex items-center gap-3 border border-emerald-100">
                <input 
                    type="checkbox" 
                    id="saveInfo"
                    checked={saveInfo}
                    onChange={(e) => setSaveInfo(e.target.checked)}
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <label htmlFor="saveInfo" className="text-sm text-gray-700 cursor-pointer select-none">
                    <strong>Save this address?</strong> <br/>
                    <span className="text-xs text-gray-500">Enable "Smart Checkout" so the AI won't ask for details next time.</span>
                </label>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-4 sticky bottom-0">
              <button 
                onClick={() => setShowCheckoutModal(false)}
                className="flex-1 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmCheckout}
                disabled={isProcessing}
                className="flex-[2] py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Processing...' : `Confirm Order (৳${finalTotal})`}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-700">Loading cart...</div>}>
      <CartPageContent />
    </Suspense>
  );
}