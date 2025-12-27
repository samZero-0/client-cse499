'use client';
import Button from '@/components/common/Button';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { FaShoppingCart, FaHeart, FaEye, FaStar, FaFire } from 'react-icons/fa';
import { useState } from 'react';

export default function ProductCard({ product, viewMode = 'grid' }) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const stockStatus = product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock';
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row group">
        {/* Image Section */}
        <div className="w-full sm:w-48 h-48 sm:h-auto relative overflow-hidden bg-gray-100 flex-shrink-0">
          <img 
            src={product.imageUrl || 'https://placehold.co/600x400?text=No+Image'} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
              <FaFire className="text-xs" />
              {discount}% OFF
            </div>
          )}
        </div>
        
        <div className="p-6 flex-grow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <Link href={`/products/${product._id}`} className="hover:text-emerald-600 transition flex-grow">
                <h3 className="font-bold text-xl text-gray-900">{product.name}</h3>
              </Link>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-4 whitespace-nowrap ${
                product.category === 'Vegetables' ? 'bg-green-100 text-green-700' :
                product.category === 'Fruits' ? 'bg-red-100 text-red-700' :
                product.category === 'Dairy' ? 'bg-blue-100 text-blue-700' :
                'bg-emerald-100 text-emerald-700'
              }`}>
                {product.category}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < 4 ? 'fill-current' : 'text-gray-300'} />
                ))}
                <span className="text-gray-600 text-sm ml-1">(4.0)</span>
              </div>
              <div className={`text-sm font-medium ${
                stockStatus === 'in-stock' ? 'text-green-600' :
                stockStatus === 'low-stock' ? 'text-orange-600' :
                'text-red-600'
              }`}>
                {stockStatus === 'in-stock' ? '✓ In Stock' :
                 stockStatus === 'low-stock' ? '⚠ Only few left' :
                 '✗ Out of Stock'}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              {discount > 0 && (
                <span className="text-gray-400 line-through text-lg mr-2">৳{product.originalPrice}</span>
              )}
              <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                ৳{product.price}
              </span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-3 rounded-xl transition-all ${
                  isFavorite 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                <FaHeart className={isFavorite ? 'fill-current' : ''} />
              </button>
              <Button 
                onClick={() => addToCart(product)} 
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 flex items-center gap-2"
                disabled={stockStatus === 'out-of-stock'}
              >
                <FaShoppingCart />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full group transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="h-56 bg-gray-100 relative overflow-hidden">
        <img 
          src={product.imageUrl || 'https://placehold.co/600x400?text=No+Image'} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
              <FaFire className="text-xs" />
              {discount}% OFF
            </div>
          )}
          {product.isNew && (
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              NEW
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
        }`}>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-600'
            }`}
          >
            <FaHeart className={isFavorite ? 'fill-current' : ''} />
          </button>
          <Link
            href={`/products/${product._id}`}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition-all shadow-lg text-gray-600"
          >
            <FaEye />
          </Link>
        </div>

        {/* Stock Status Bar */}
        {stockStatus === 'low-stock' && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs py-1 px-3 text-center font-medium">
            Hurry! Only {product.stock} left
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            product.category === 'Vegetables' ? 'bg-green-100 text-green-700' :
            product.category === 'Fruits' ? 'bg-red-100 text-red-700' :
            product.category === 'Dairy' ? 'bg-blue-100 text-blue-700' :
            'bg-emerald-100 text-emerald-700'
          }`}>
            {product.category}
          </span>
        </div>

        <Link href={`/products/${product._id}`} className="hover:text-emerald-600 transition mb-2">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2 min-h-[3.5rem]">{product.name}</h3>
        </Link>
        
        <p className="text-gray-500 text-sm mb-3 line-clamp-2 flex-grow">{product.description}</p>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className={`text-sm ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} />
          ))}
          <span className="text-gray-500 text-xs ml-1">(4.0)</span>
        </div>

        {/* Price and Action */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              ৳{product.price}
            </span>
            {discount > 0 && (
              <span className="text-gray-400 line-through text-sm">৳{product.originalPrice}</span>
            )}
          </div>
          
          <Button 
            onClick={() => addToCart(product)} 
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
            disabled={stockStatus === 'out-of-stock'}
          >
            <FaShoppingCart />
            {stockStatus === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
}