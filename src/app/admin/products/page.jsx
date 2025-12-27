'use client';
import { useState, useEffect, useContext } from 'react';
import Navbar from '@/components/common/Navbar';
import Button from '@/components/common/Button';
import useAxios from '@/hooks/useAxios';
import { AuthContext } from '@/context/AuthContext';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const { user } = useContext(AuthContext);
    
    // Form State (Now includes imageUrl)
    const [formData, setFormData] = useState({
        name: '', category: 'Dairy', price: '', stock: '', shelfLifeDays: '', description: '', imageUrl: ''
    });

    const axios = useAxios();

    // 1. Fetch Products on Load
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/products');
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    // 2. Handle Create Product
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/products', formData);
            alert('Product Added!');
            setShowForm(false);
            // Reset form
            setFormData({ name: '', category: 'Dairy', price: '', stock: '', shelfLifeDays: '', description: '', imageUrl: '' }); 
            fetchProducts(); // Refresh list
        } catch (error) {
            alert('Failed to add product.');
            console.error(error);
        }
    };

    // 3. Security Check: Block non-admins
    // Note: user might be null while loading, so we can check if user is loaded first if desired, 
    // but this simple check works for immediate protection.
    if (user && user.role !== 'admin') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-red-600">
                <h1 className="text-3xl font-bold">Access Denied</h1>
                <p>You must be an administrator to view this page.</p>
                <Button className="mt-4" onClick={() => window.location.href = '/'}>Go Home</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
                    <Button onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : '+ Add New Product'}
                    </Button>
                </div>

                {/* Create Product Form */}
                {showForm && (
                    <div className="bg-white p-6 rounded-xl shadow-md border border-green-100 mb-8">
                        <h3 className="text-lg font-bold mb-4">Add New Item</h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input 
                                placeholder="Product Name" required
                                className="border p-2 rounded"
                                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                            <select 
                                className="border p-2 rounded"
                                value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                            >
                                <option>Dairy</option>
                                <option>Protein</option>
                                <option>Staples</option>
                                <option>Vegetables</option>
                                <option>Snacks</option>
                                <option>Electronics</option>
                            </select>
                            <input 
                                type="number" placeholder="Price (৳)" required
                                className="border p-2 rounded"
                                value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                            />
                            <input 
                                type="number" placeholder="Stock Qty" required
                                className="border p-2 rounded"
                                value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})}
                            />
                            <input 
                                type="number" placeholder="Shelf Life (Days)" required
                                className="border p-2 rounded"
                                value={formData.shelfLifeDays} onChange={(e) => setFormData({...formData, shelfLifeDays: e.target.value})}
                            />
                            {/* IMAGE URL INPUT */}
                            <input 
                                placeholder="Image URL (e.g. https://imgur.com/...)" 
                                className="border p-2 rounded"
                                value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                            />
                            
                            <textarea 
                                placeholder="Description"
                                className="border p-2 rounded md:col-span-2"
                                value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
                            <Button type="submit" className="md:col-span-2">Save Product</Button>
                        </form>
                    </div>
                )}

                {/* Product List Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-semibold uppercase text-xs">
                            <tr>
                                <th className="p-4">Image</th>
                                <th className="p-4">Product Name</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Stock</th>
                                <th className="p-4">Shelf Life</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50 transition">
                                    <td className="p-4">
                                        <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                                            <img 
                                                src={product.imageUrl || 'https://placehold.co/100x100?text=No+Img'} 
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium text-gray-900">{product.name}</td>
                                    <td className="p-4 text-gray-500">{product.category}</td>
                                    <td className="p-4 text-gray-900">৳{product.price}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock < 20 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {product.stock} units
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500">{product.shelfLifeDays} Days</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}