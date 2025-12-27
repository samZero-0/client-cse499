'use client';
import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { FaShoppingBasket, FaLeaf } from 'react-icons/fa';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useCart();

  return (
    <nav className="bg-green-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold flex items-center gap-2">
          <FaLeaf className="text-green-200"/> PantryPal
        </Link>
        
        <div className="hidden md:flex gap-6 items-center font-medium">
          <Link href="/products" className="hover:text-green-200 transition">Shop</Link>
          {user && (
            <>
              <Link href="/dashboard" className="hover:text-green-200 transition">Dashboard</Link>
              <Link href="/pantry" className="hover:text-green-200 transition">My Pantry</Link>
              <Link href="/subscription" className="hover:text-green-200 transition">Subscriptions</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
           {user ? (
            <div className="flex items-center gap-4">
                <span className="hidden sm:block text-sm">{user.name}</span>
                <button onClick={logout} className="text-sm bg-green-700 px-3 py-1 rounded hover:bg-green-800 transition">
                    Logout
                </button>
            </div>
           ) : (
            <div className="flex gap-2">
                <Link href="/login" className="px-3 py-1 rounded hover:bg-green-700 transition">Login</Link>
                <Link href="/register" className="bg-white text-green-700 px-3 py-1 rounded font-bold hover:bg-gray-100 transition">Register</Link>
            </div>
           )}
           
           <Link href="/cart" className="relative p-2">
            <FaShoppingBasket className="text-2xl" />
            {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItems.length}
                </span>
            )}
           </Link>
        </div>
      </div>
    </nav>
  );
}