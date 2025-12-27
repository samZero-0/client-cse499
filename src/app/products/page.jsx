'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/common/Navbar';
import ProductCard from '@/components/products/ProductCard';
import FilterSidebar from '@/components/products/FilterSidebar';
import useAxios from '@/hooks/useAxios'; // Import your custom hook

export default function ShopPage() {
    const [products, setProducts] = useState([]); // Empty array initially
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState(5000);
    const axios = useAxios(); // Initialize axios

    // Fetch products when page loads
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('/products');
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch products", error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Filter logic remains the same, but uses the 'products' state
    const filteredProducts = products.filter(product => {
        const catMatch = selectedCategory === 'All' || product.category === selectedCategory;
        const priceMatch = product.price <= priceRange;
        return catMatch && priceMatch;
    });

    const categories = ['Dairy', 'Protein', 'Staples', 'Vegetables', 'Snacks'];

    if (loading) return <div className="text-center mt-20">Loading products...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="container mx-auto px-4 py-8 flex-grow">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Shop Groceries</h1>
                
                <div className="flex flex-col md:flex-row gap-8">
                    <FilterSidebar 
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                        priceRange={priceRange}
                        onPriceChange={setPriceRange}
                    />
                    
                    <div className="flex-grow">
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map(product => (
                                    // Make sure backend uses '_id', not 'id'
                                    <ProductCard key={product._id} product={{...product, id: product._id}} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-20 bg-white rounded-xl">No products found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}