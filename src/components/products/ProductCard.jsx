'use client';
import Button from '@/components/common/Button';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition duration-300 flex flex-col h-full">
      {/* IMAGE SECTION */}
      <div className="h-48 bg-gray-100 relative">
        <img 
            src={product.imageUrl || 'https://placehold.co/600x400?text=No+Image'} 
            alt={product.name}
            className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
           <Link href={`/products/${product._id}`} className="hover:text-green-600 transition">
             <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{product.name}</h3>
           </Link>
           <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ml-2">
             {product.category}
           </span>
        </div>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>
        
        <div className="flex justify-between items-center mt-auto">
          <span className="text-xl font-bold text-gray-900">৳{product.price}</span>
          <Button onClick={() => addToCart(product)} className="text-sm px-3 py-1">
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}