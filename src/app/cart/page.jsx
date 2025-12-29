'use client';
import { useState } from 'react';
import Navbar from '@/components/common/Navbar';
import { useCart } from '@/context/CartContext';
import useAxios from '@/hooks/useAxios';
import { useRouter } from 'next/navigation';
import { 
  FaTrash, FaShoppingBag, FaTruck, FaTag, FaCheckCircle, FaTimes,
  FaPlus, FaMinus, FaArrowRight, FaGift, FaCreditCard, FaMapMarkerAlt,
  FaUser, FaPhone, FaEnvelope
} from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryFee] = useState(60);
  const [discount] = useState(0);
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

  const subtotal = total;
  const finalTotal = subtotal + deliveryFee - discount;

  const handleQuantityChange = (productId, change) => {
    const item = cartItems.find(item => item._id === productId);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      updateQuantity(productId, newQuantity);
    }
  };

  const openCheckoutModal = () => {
    setShowCheckoutModal(true);
  };

  const closeCheckoutModal = () => {
    setShowCheckoutModal(false);
  };

  const handleConfirmCheckout = async () => {
    // Validate customer info
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address || !customerInfo.city) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);
    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item._id,
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
      
      // Success animation
      setIsProcessing(false);
      toast.success('🎉 Order placed successfully!', { duration: 4000 });
      clearCart();
      closeCheckoutModal();
      setTimeout(() => router.push('/dashboard'), 1000);
    } catch (error) {
      setIsProcessing(false);
      console.error(error);
      toast.error('Checkout failed. Please make sure you are logged in.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <FaShoppingBag className="text-emerald-600" />
            Shopping Cart
          </h1>
          <p className="text-gray-600 text-lg">
            {cartItems.length > 0 ? `${cartItems.length} item${cartItems.length > 1 ? 's' : ''} in your cart` : 'Your cart is empty'}
          </p>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingBag className="text-6xl text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Your Cart is Empty</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Looks like you haven't added any items yet. Start shopping to fill your cart!
            </p>
            <button 
              onClick={() => router.push('/products')}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 font-bold text-lg transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-3"
            >
              <FaShoppingBag />
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Free Delivery Banner */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl flex items-center gap-3 shadow-md">
                <FaTruck className="text-2xl" />
                <div>
                  <p className="font-bold">Free Delivery Available!</p>
                  <p className="text-sm text-green-50">Your order qualifies for free shipping</p>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {cartItems.map((item, index) => (
                  <div 
                    key={item._id} 
                    className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-all duration-300"
                    style={{ animation: `fadeInUp 0.3s ease-out ${index * 0.05}s` }}
                  >
                    <div className="flex items-start gap-4 flex-grow w-full sm:w-auto mb-4 sm:mb-0">
                      {/* Product Image */}
                      <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200 flex-shrink-0 group-hover:border-emerald-300 transition-all">
                        <img 
                          src={item.imageUrl || 'https://placehold.co/150x150?text=Product'} 
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="font-bold text-gray-900 text-lg mb-1">{item.name}</h3>
                        <p className="text-gray-500 text-sm mb-2">Unit Price: ৳{item.price}</p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 bg-gray-100 border border-gray-300 rounded-lg overflow-hidden">
                            <button 
                              onClick={() => handleQuantityChange(item._id, -1)}
                              className="p-2 hover:bg-red-50 text-red-600 transition-colors"
                            >
                              <FaMinus className="text-xs" />
                            </button>
                            <span className="font-bold text-gray-800 px-4 text-center min-w-[3rem]">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => handleQuantityChange(item._id, 1)}
                              className="p-2 hover:bg-green-50 text-green-600 transition-colors"
                            >
                              <FaPlus className="text-xs" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
                          >
                            <FaTrash className="text-sm" />
                            <span className="text-sm font-medium hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Item Total */}
                    <div className="text-right sm:ml-4 w-full sm:w-auto flex sm:block justify-between items-center">
                      <span className="text-sm text-gray-500 sm:hidden">Subtotal:</span>
                      <p className="font-bold text-2xl text-emerald-600">
                        ৳{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping Button */}
              <button
                onClick={() => router.push('/products')}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium flex items-center justify-center gap-2"
              >
                <FaShoppingBag />
                Continue Shopping
              </button>
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              {/* Summary Card */}
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden sticky top-24">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-1">Order Summary</h3>
                  <p className="text-emerald-50 text-sm">{cartItems.length} items</p>
                </div>
                
                <div className="p-6 space-y-4">
                  {/* Pricing Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span className="font-semibold">৳{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span className="flex items-center gap-2">
                        <FaTruck className="text-emerald-600" />
                        Delivery Fee
                      </span>
                      <span className="font-semibold">৳{deliveryFee}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span className="flex items-center gap-2">
                          <FaTag />
                          Discount
                        </span>
                        <span className="font-semibold">- ৳{discount}</span>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t-2 border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold text-gray-900">Total</span>
                      <span className="text-3xl font-bold text-emerald-600">৳{finalTotal}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={openCheckoutModal}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
                  >
                    Proceed to Checkout
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-2">
                    <FaCheckCircle className="text-green-500" />
                    <span>Secure Checkout</span>
                  </div>
                </div>
              </div>

              {/* Promo Card */}
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <FaGift className="text-2xl" />
                  <h3 className="font-bold text-xl">Special Offer!</h3>
                </div>
                <p className="text-white/90 text-sm mb-4">
                  Subscribe and save 15% on recurring orders
                </p>
                <button
                  onClick={() => router.push('/subscription')}
                  className="w-full py-2 bg-white text-orange-600 rounded-lg font-semibold text-sm hover:bg-orange-50 transition-all"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{ animation: 'scaleIn 0.3s ease-out' }}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Checkout Confirmation</h2>
                  <p className="text-emerald-50 text-sm">Review your order and complete purchase</p>
                </div>
                <button
                  onClick={closeCheckoutModal}
                  className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-all"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Customer Information Form */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaUser className="text-emerald-600" />
                  Customer Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-emerald-600" />
                  Delivery Address
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <textarea
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                      rows="3"
                      placeholder="House/Flat, Street, Area"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                      placeholder="Dhaka, Chittagong, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <select
                      value={customerInfo.paymentMethod}
                      onChange={(e) => setCustomerInfo({...customerInfo, paymentMethod: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option>Cash on Delivery</option>
                      <option>Credit/Debit Card</option>
                      <option>Mobile Banking</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border-2 border-emerald-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-2 mb-4">
                  {cartItems.map(item => (
                    <div key={item._id} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-semibold text-gray-900">৳{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t-2 border-emerald-300 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">৳{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Delivery</span>
                    <span className="font-semibold">৳{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
                    <span>Total</span>
                    <span className="text-emerald-600">৳{finalTotal}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={closeCheckoutModal}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-bold transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmCheckout}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      Confirm & Place Order
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}