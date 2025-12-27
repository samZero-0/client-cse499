'use client';
import Navbar from '@/components/common/Navbar';
import Button from '@/components/common/Button';
import { useCart } from '@/context/CartContext';
import useAxios from '@/hooks/useAxios';
import { useRouter } from 'next/navigation';
import { FaTrash } from 'react-icons/fa';

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart, total } = useCart();
  const axios = useAxios();
  const router = useRouter();

  const handleCheckout = async () => {
    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item._id, // Ensure we send the Product ID
          name: item.name,
          qty: item.quantity,
          price: item.price
        })),
        totalPrice: total + 60 // Including delivery
      };

      await axios.post('/orders', orderData);
      
      alert('Order placed successfully!');
      clearCart();
      router.push('/dashboard'); // Redirect to dashboard
    } catch (error) {
      console.error(error);
      alert('Checkout failed. Make sure you are logged in.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                <p className="text-gray-500 text-lg mb-4">Your basket is empty.</p>
                <Button onClick={() => router.push('/products')}>Go Shopping</Button>
            </div>
        ) : (
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {cartItems.map((item) => (
                        <div key={item._id} className="flex items-center justify-between p-6 border-b border-gray-100 last:border-0">
                            <div className="flex items-center gap-4">
                                {/* PRODUCT IMAGE */}
                                <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-200">
                                    <img 
                                        src={item.imageUrl || 'https://placehold.co/100x100?text=No+Img'} 
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                
                                <div>
                                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                                    <p className="text-gray-500 text-sm">৳{item.price} x {item.quantity}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <p className="font-bold text-gray-900">৳{item.price * item.quantity}</p>
                                <button onClick={() => removeFromCart(item._id)} className="text-red-400 hover:text-red-600">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="h-fit bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>
                    <div className="flex justify-between mb-2 text-gray-600">
                        <span>Subtotal</span>
                        <span>৳{total}</span>
                    </div>
                    <div className="flex justify-between mb-4 text-gray-600">
                        <span>Delivery</span>
                        <span>৳60</span>
                    </div>
                    <div className="flex justify-between pt-4 border-t border-gray-200 mb-6 font-bold text-lg text-gray-900">
                        <span>Total</span>
                        <span>৳{total + 60}</span>
                    </div>
                    <Button onClick={handleCheckout} className="w-full py-3 text-lg">
                        Checkout Now
                    </Button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}