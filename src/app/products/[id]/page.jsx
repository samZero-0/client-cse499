'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // To get the ID from URL
import useAxios from '@/hooks/useAxios';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/common/Navbar';
import Button from '@/components/common/Button';
import ProductCard from '@/components/products/ProductCard';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function ProductDetailsPage() {
    const { id } = useParams(); // Get ID from URL (e.g. products/123)
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const axios = useAxios();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // 1. Fetch the specific product
                const { data: currentProduct } = await axios.get(`/products/${id}`);
                setProduct(currentProduct);

                // 2. Fetch all products to filter "More like this"
                // (In a real large app, you'd ask the backend for ?category=Dairy)
                const { data: allProducts } = await axios.get('/products');
                
                const related = allProducts.filter(p => 
                    p.category === currentProduct.category && p._id !== currentProduct._id
                ).slice(0, 4); // Limit to 4 items

                setRelatedProducts(related);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching product details:", error);
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    if (loading) return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
    if (!product) return <div className="min-h-screen flex justify-center items-center">Product not found.</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            
            <div className="container mx-auto px-4 py-8 flex-grow">
                {/* Back Button */}
                <Link href="/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-green-600 mb-6">
                    <FaArrowLeft /> Back to Shop
                </Link>

                {/* --- MAIN PRODUCT SECTION --- */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-12">
                    <div className="grid md:grid-cols-2 gap-8 p-8">
                        
                        {/* Left: Image */}
                        <div className="bg-gray-50 rounded-lg flex items-center justify-center p-8 h-96 relative">
                            <img 
                                src={product.imageUrl || 'https://placehold.co/600x600?text=No+Image'} 
                                alt={product.name}
                                className="max-h-full max-w-full object-contain"
                            />
                        </div>

                        {/* Right: Details */}
                        <div className="flex flex-col justify-center">
                            <div className="mb-4">
                                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                                <span className="ml-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                    {product.category}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {product.name}
                            </h1>

                            <div className="flex items-end gap-4 mb-6">
                                <span className="text-4xl font-bold text-red-500">৳{product.price}</span>
                                {/* Mocking an "Original Price" for visual effect like your screenshot */}
                                <span className="text-xl text-gray-400 line-through decoration-gray-400">
                                    ৳{Math.round(product.price * 1.1)}
                                </span>
                            </div>

                            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                                {product.description || "No description available for this product."}
                            </p>

                            <div className="flex gap-4">
                                <Button 
                                    onClick={() => addToCart(product)} 
                                    className="px-8 py-3 text-lg bg-pink-600 hover:bg-pink-700 text-white w-full md:w-auto"
                                    disabled={product.stock <= 0}
                                >
                                    {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
                                </Button>
                            </div>
                            
                            <div className="mt-8 border-t pt-6 text-sm text-gray-500 space-y-2">
                                <p><strong>Shelf Life:</strong> {product.shelfLifeDays} Days</p>
                                <p><strong>Country of Origin:</strong> Bangladesh</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- MORE LIKE THIS SECTION --- */}
                {relatedProducts.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">More like this</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map(related => (
                                <ProductCard key={related._id} product={related} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}