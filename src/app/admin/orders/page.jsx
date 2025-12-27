'use client';
import Navbar from '@/components/common/Navbar';

export default function AdminOrders() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Customer Orders</h1>
                <div className="bg-white p-12 rounded-xl border border-gray-200 text-center text-gray-500">
                    <p>Order management interface goes here...</p>
                </div>
            </div>
        </div>
    );
}