'use client';
import Navbar from '@/components/common/Navbar';
import Link from 'next/link';

// Mock Data for Analytics
const spendingData = [
    { category: 'Vegetables', amount: 1200, color: 'bg-green-500' },
    { category: 'Staples (Rice/Flour)', amount: 2500, color: 'bg-yellow-500' },
    { category: 'Dairy', amount: 800, color: 'bg-blue-500' },
    { category: 'Snacks', amount: 600, color: 'bg-red-400' },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm uppercase tracking-wide font-semibold">Total Spent (Oct)</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">৳5,100</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm uppercase tracking-wide font-semibold">Pantry Items</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">24 Items</p>
                <Link href="/pantry" className="text-sm text-blue-500 hover:underline mt-1 block">View Pantry &rarr;</Link>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm uppercase tracking-wide font-semibold">Next Subscription</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">Nov 1st</p>
                <Link href="/subscription" className="text-sm text-green-500 hover:underline mt-1 block">Manage Bundle &rarr;</Link>
            </div>
        </div>

        {/* Analytics Section */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Monthly Spending Breakdown</h2>
            <div className="space-y-4">
                {spendingData.map((item) => (
                    <div key={item.category}>
                        <div className="flex justify-between text-sm font-medium mb-1">
                            <span>{item.category}</span>
                            <span>৳{item.amount}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className={`${item.color} h-2.5 rounded-full`} style={{ width: `${(item.amount / 5100) * 100}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}