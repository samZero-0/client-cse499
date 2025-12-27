'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/common/Navbar';
import ProductCard from '@/components/products/ProductCard';
import FilterSidebar from '@/components/products/FilterSidebar';
import useAxios from '@/hooks/useAxios';
import { FaThLarge, FaThList, FaFilter, FaTimes, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function ShopPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState(5000);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('featured');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        inStock: false,
        onSale: false,
        organic: false,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);
    const axios = useAxios();

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

    // Advanced filter logic
    const filteredProducts = products.filter(product => {
        const catMatch = selectedCategory === 'All' || product.category === selectedCategory;
        const priceMatch = product.price <= priceRange;
        const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const stockMatch = !selectedFilters.inStock || product.stock > 0;
        
        return catMatch && priceMatch && searchMatch && stockMatch;
    });

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch(sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'name':
                return a.name.localeCompare(b.name);
            case 'newest':
                return new Date(b.createdAt) - new Date(a.createdAt);
            default:
                return 0;
        }
    });

    const categories = ['Dairy', 'Protein', 'Staples', 'Vegetables', 'Snacks', 'Fruits', 'Beverages', 'Bakery'];

    const clearAllFilters = () => {
        setSelectedCategory('All');
        setPriceRange(5000);
        setSearchTerm('');
        setSelectedFilters({ inStock: false, onSale: false, organic: false });
        setCurrentPage(1);
    };

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, priceRange, searchTerm, sortBy, selectedFilters]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;
        
        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600 text-lg">Loading amazing products...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
            <Navbar />
            
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Fresh Groceries</h1>
                    <p className="text-xl text-emerald-50 mb-6 max-w-2xl">
                        Discover quality products at unbeatable prices. Free delivery on orders over ৳500!
                    </p>
                    
                    {/* Search Bar */}
                    <div className="max-w-2xl">
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                            <input
                                type="text"
                                placeholder="Search for products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-300 shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 flex-grow">
                {/* Toolbar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4 flex-wrap">
                            <button
                                onClick={() => setShowMobileFilters(!showMobileFilters)}
                                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-medium hover:bg-emerald-200 transition-all"
                            >
                                <FaFilter />
                                Filters
                            </button>
                            
                            <div className="flex items-center gap-2 text-gray-600">
                                <span className="font-semibold text-gray-900">{sortedProducts.length}</span>
                                <span>products found</span>
                            </div>

                            {(selectedCategory !== 'All' || searchTerm || selectedFilters.inStock) && (
                                <button
                                    onClick={clearAllFilters}
                                    className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                                >
                                    <FaTimes />
                                    Clear filters
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Sort Dropdown */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-gray-700"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="name">Name: A to Z</option>
                                <option value="newest">Newest First</option>
                            </select>

                            {/* View Mode Toggle */}
                            <div className="hidden sm:flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-all ${
                                        viewMode === 'grid' 
                                            ? 'bg-white text-emerald-600 shadow-sm' 
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <FaThLarge className="text-lg" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-all ${
                                        viewMode === 'list' 
                                            ? 'bg-white text-emerald-600 shadow-sm' 
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <FaThList className="text-lg" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block">
                        <FilterSidebar 
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onSelectCategory={setSelectedCategory}
                            priceRange={priceRange}
                            onPriceChange={setPriceRange}
                            selectedFilters={selectedFilters}
                            onFilterChange={setSelectedFilters}
                        />
                    </div>

                    {/* Mobile Filter Modal */}
                    {showMobileFilters && (
                        <div className="lg:hidden fixed inset-0 bg-black/50 z-50 animate-fade-in">
                            <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto animate-slide-in-right">
                                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                                    <button
                                        onClick={() => setShowMobileFilters(false)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                                    >
                                        <FaTimes className="text-xl text-gray-600" />
                                    </button>
                                </div>
                                <div className="p-4">
                                    <FilterSidebar 
                                        categories={categories}
                                        selectedCategory={selectedCategory}
                                        onSelectCategory={setSelectedCategory}
                                        priceRange={priceRange}
                                        onPriceChange={setPriceRange}
                                        selectedFilters={selectedFilters}
                                        onFilterChange={setSelectedFilters}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Products Grid/List */}
                    <div className="flex-grow">
                        {sortedProducts.length > 0 ? (
                            <>
                                <div className={
                                    viewMode === 'grid'
                                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                        : "flex flex-col gap-4"
                                }>
                                    {currentProducts.map(product => (
                                        <ProductCard 
                                            key={product._id} 
                                            product={{...product, id: product._id}} 
                                            viewMode={viewMode}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                                        <div className="text-sm text-gray-600">
                                            Showing <span className="font-semibold text-gray-900">{indexOfFirstProduct + 1}</span> to{' '}
                                            <span className="font-semibold text-gray-900">
                                                {Math.min(indexOfLastProduct, sortedProducts.length)}
                                            </span>{' '}
                                            of <span className="font-semibold text-gray-900">{sortedProducts.length}</span> products
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {/* Previous Button */}
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                                    currentPage === 1
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                                }`}
                                            >
                                                <FaChevronLeft className="text-xs" />
                                                <span className="hidden sm:inline">Previous</span>
                                            </button>

                                            {/* Page Numbers */}
                                            <div className="flex items-center gap-1">
                                                {getPageNumbers().map((page, index) => (
                                                    page === '...' ? (
                                                        <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                                                            ...
                                                        </span>
                                                    ) : (
                                                        <button
                                                            key={page}
                                                            onClick={() => handlePageChange(page)}
                                                            className={`min-w-[40px] h-10 rounded-lg font-medium transition-all ${
                                                                currentPage === page
                                                                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                                                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                                            }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    )
                                                ))}
                                            </div>

                                            {/* Next Button */}
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                                    currentPage === totalPages
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                                }`}
                                            >
                                                <span className="hidden sm:inline">Next</span>
                                                <FaChevronRight className="text-xs" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                                <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
                                <button
                                    onClick={clearAllFilters}
                                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}