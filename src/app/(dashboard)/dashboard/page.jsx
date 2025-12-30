'use client';
import { useState, useEffect, useContext } from 'react';
import Navbar from '@/components/common/Navbar';
import Link from 'next/link';
import useAxios from '@/hooks/useAxios';
import { AuthContext } from '@/context/AuthContext';
import { 
  FaBox, FaUsers, FaMoneyBillWave, FaShoppingBag, FaLeaf, FaClock, 
  FaArrowUp, FaArrowDown, FaChartLine, FaBoxOpen, FaExclamationTriangle,
  FaCheckCircle, FaShippingFast, FaStar, FaCalendarAlt, FaArrowRight, FaTimes, FaReceipt
} from 'react-icons/fa';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  
  // NEW: State for the Order Detail Modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  const axios = useAxios();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/stats');
        setStats(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setLoading(false);
      }
    };
    
    if (user) {
        fetchStats();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        
        {/* --- HEADER --- */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                {stats?.role === 'admin' ? 'Admin Dashboard' : `Welcome back, ${user?.name}! 👋`}
              </h1>
              <p className="text-gray-600 text-lg">
                {stats?.role === 'admin' 
                  ? 'Monitor your business performance and insights' 
                  : 'Track your grocery spending and pantry management'}
              </p>
            </div>
            
            {/* Time Range Selector */}
            <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 p-1">
              {['Today', 'Week', 'Month', 'Year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedTimeRange(range.toLowerCase())}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedTimeRange === range.toLowerCase()
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- ADMIN VIEW --- */}
        {stats?.role === 'admin' && (
            <>
                {/* Stats Grid (Revenue, Orders, etc.) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Total Revenue" value={`৳${stats.totalRevenue.toLocaleString()}`} change="+12.5%" isPositive={true} icon={<FaMoneyBillWave />} gradient="from-emerald-500 to-teal-500"/>
                    <StatCard title="Total Orders" value={stats.totalOrders} change="+8.2%" isPositive={true} icon={<FaShoppingBag />} gradient="from-blue-500 to-cyan-500"/>
                    <StatCard title="Registered Users" value={stats.totalUsers} change="+15.3%" isPositive={true} icon={<FaUsers />} gradient="from-purple-500 to-pink-500"/>
                    <StatCard title="Products in Stock" value={stats.totalProducts} change="-2.4%" isPositive={false} icon={<FaBox />} gradient="from-orange-500 to-red-500"/>
                </div>

                {/* Charts Section */}
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                  <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div><h3 className="font-bold text-gray-900 text-xl flex items-center gap-2"><FaChartLine className="text-emerald-600" /> Revenue Overview</h3><p className="text-sm text-gray-500 mt-1">Monthly sales performance</p></div>
                    </div>
                    <RevenueChart />
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 text-xl mb-6 flex items-center gap-2"><FaStar className="text-yellow-500" /> Top Products</h3>
                    <div className="space-y-4">
                      {[{ name: 'Organic Milk', sales: 245, color: 'bg-blue-500' }, { name: 'Fresh Vegetables', sales: 198, color: 'bg-green-500' }, { name: 'Brown Rice', sales: 156, color: 'bg-orange-500' }, { name: 'Olive Oil', sales: 134, color: 'bg-yellow-500' }, { name: 'Chicken Breast', sales: 98, color: 'bg-red-500' }].map((product, index) => (
                        <div key={index} className="flex items-center gap-3"><div className="flex-grow"><div className="flex justify-between items-center mb-1"><span className="text-sm font-medium text-gray-700">{product.name}</span><span className="text-xs text-gray-500">{product.sales} sold</span></div><div className="w-full bg-gray-100 rounded-full h-2"><div className={`${product.color} h-2 rounded-full transition-all duration-500`} style={{ width: `${(product.sales / 245) * 100}%` }}></div></div></div></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-gray-900 text-xl">Recent Orders</h3>
                          <p className="text-sm text-gray-500 mt-1">Latest transactions from customers</p>
                        </div>
                        <Link href="/admin/orders" className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium group">View All <FaArrowRight className="group-hover:translate-x-1 transition-transform" /></Link>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                          <thead className="bg-gray-50">
                              <tr>
                                  <th className="p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                                  <th className="p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                                  <th className="p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                                  <th className="p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                  <th className="p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                              {stats.recentOrders.map((order, index) => (
                                  <tr 
                                    key={order._id} 
                                    // 1. CLICK HANDLER FOR ADMIN TABLE
                                    onClick={() => setSelectedOrder(order)}
                                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                                  >
                                      <td className="p-4"><span className="font-mono text-sm text-gray-900 font-medium">#{order._id.substring(0,8)}</span></td>
                                      <td className="p-4">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">{order.user?.name?.charAt(0) || 'U'}</div>
                                          <span className="font-medium text-gray-900">{order.user?.name || 'Unknown'}</span>
                                        </div>
                                      </td>
                                      <td className="p-4"><span className="font-bold text-gray-900">৳{order.totalPrice}</span></td>
                                      <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${index % 3 === 0 ? 'bg-green-100 text-green-700' : index % 3 === 1 ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                          {order.isDelivered ? 'Delivered' : 'Processing'}
                                        </span>
                                      </td>
                                      <td className="p-4 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                    </div>
                </div>
            </>
        )}

        {/* --- USER VIEW --- */}
        {stats?.role === 'user' && (
            <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Total Spent" value={`৳${stats.totalSpent.toLocaleString()}`} subtext={`Savings: ৳${stats.savings}`} icon={<FaMoneyBillWave />} gradient="from-emerald-500 to-teal-500"/>
                    <StatCard title="Pantry Items" value={`${stats.pantryCount} Items`} subtext="Check expiring food" icon={<FaLeaf />} gradient="from-green-500 to-emerald-500" link="/pantry"/>
                    <StatCard title="Next Delivery" value={stats.nextDelivery ? new Date(stats.nextDelivery).toLocaleDateString() : 'No Active Sub'} icon={<FaClock />} gradient="from-blue-500 to-cyan-500" link="/subscription"/>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                  <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-6"><div><h3 className="font-bold text-gray-900 text-xl flex items-center gap-2"><FaChartLine className="text-emerald-600" /> Spending Overview</h3><p className="text-sm text-gray-500 mt-1">Your monthly grocery expenses</p></div></div>
                    <SpendingChart />
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 text-xl mb-4 flex items-center gap-2"><FaExclamationTriangle className="text-orange-500" /> Expiring Soon</h3>
                    <div className="space-y-3">{[{ name: 'Milk', days: 2, color: 'red' }, { name: 'Yogurt', days: 3, color: 'orange' }, { name: 'Lettuce', days: 5, color: 'yellow' }].map((item, index) => (<div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"><div><p className="font-medium text-gray-900">{item.name}</p><p className="text-xs text-gray-500">{item.days} days left</p></div><div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${item.color === 'red' ? 'bg-red-500' : item.color === 'orange' ? 'bg-orange-500' : 'bg-yellow-500'}`}>{item.days}d</div></div>))}</div>
                    <Link href="/pantry" className="mt-4 flex items-center justify-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium group">View Full Pantry <FaArrowRight className="group-hover:translate-x-1 transition-transform" /></Link>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <ActionCard title="Shop Groceries" description="Browse our fresh products" icon={<FaShoppingBag />} gradient="from-emerald-500 to-teal-500" link="/products"/>
                  <ActionCard title="Manage Pantry" description="Track your food inventory" icon={<FaLeaf />} gradient="from-green-500 to-emerald-500" link="/pantry"/>
                  <ActionCard title="Subscriptions" description="Set up recurring orders" icon={<FaCalendarAlt />} gradient="from-blue-500 to-cyan-500" link="/subscription"/>
                </div>

                {/* Recent Purchases List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div><h2 className="text-xl font-bold text-gray-900">Recent Purchases</h2><p className="text-sm text-gray-500 mt-1">Your latest orders and transactions</p></div>
                    </div>
                    {stats.recentOrders.length === 0 ? (
                        <div className="text-center py-12"><div className="text-6xl mb-4">🛒</div><p className="text-gray-500 mb-4">No purchases yet</p><Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-teal-700 transition-all">Start Shopping <FaArrowRight /></Link></div>
                    ) : (
                        <div className="space-y-4">
                            {stats.recentOrders.map((order, index) => (
                                <div 
                                    key={order._id} 
                                    // 2. CLICK HANDLER FOR USER LIST
                                    onClick={() => setSelectedOrder(order)}
                                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer border border-transparent hover:border-emerald-200"
                                >
                                    <div className="flex items-center gap-4">
                                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl ${index % 3 === 0 ? 'bg-gradient-to-br from-emerald-500 to-teal-500' : index % 3 === 1 ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`}><FaShoppingBag /></div>
                                      <div><p className="font-bold text-gray-900">Order #{order._id.slice(-6)}</p><p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {order.orderItems.length} Items</p></div>
                                    </div>
                                    <div className="flex items-center gap-4"><span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">৳{order.totalPrice}</span></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </>
        )}

      </div>

      {/* 3. ORDER DETAIL MODAL */}
      {selectedOrder && (
        <OrderDetailModal 
            order={selectedOrder} 
            onClose={() => setSelectedOrder(null)} 
        />
      )}

    </div>
  );
}

// --- SUB-COMPONENTS ---

// THE NEW MODAL COMPONENT
function OrderDetailModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 animate-fade-in-up">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <FaReceipt className="opacity-80" />
                    Order Details
                </h2>
                <p className="text-emerald-100 mt-1">ID: #{order._id}</p>
            </div>
            <button 
                onClick={onClose}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
                <FaTimes />
            </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
            
            {/* Order Meta Data */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                    <p className="font-semibold text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold mt-1 ${
                        order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                        {order.isDelivered ? 'Delivered' : 'Processing'}
                    </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Payment</p>
                    <p className="font-semibold text-gray-900">
                        {order.isPaid ? 'Paid' : 'Pending'}
                    </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                    <p className="font-bold text-emerald-600 text-lg">
                        ৳{order.totalPrice}
                    </p>
                </div>
            </div>

            {/* Items List */}
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaShoppingBag className="text-emerald-600" />
                Items Purchased
            </h3>
            <div className="space-y-3">
                {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                            {/* Product Image Fallback */}
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <FaBoxOpen className="text-2xl" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">{item.name}</p>
                                <p className="text-sm text-gray-500">
                                    {item.quantity} x ৳{item.price}
                                </p>
                            </div>
                        </div>
                        <p className="font-bold text-gray-900">
                            ৳{item.quantity * item.price}
                        </p>
                    </div>
                ))}
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
                Close
            </button>
            <button className="px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
                Download Receipt
            </button>
        </div>
      </div>
    </div>
  );
}

// ... (Existing StatCard, OrderStatusCard, ActionCard, RevenueChart, SpendingChart components remain unchanged below)
function StatCard({ title, value, subtext, change, isPositive, icon, gradient, link }) {
    const Content = () => (
        <div className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    {icon}
                </div>
                {change && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
                    isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {isPositive ? <FaArrowUp /> : <FaArrowDown />}
                    {change}
                  </div>
                )}
            </div>
            <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wide mb-2">{title}</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
            {subtext && <p className="text-sm text-gray-500">{subtext}</p>}
        </div>
    );
    return link ? <Link href={link}><Content /></Link> : <Content />;
}

function OrderStatusCard({ label, count, icon, color }) {
  return (
    <div className={`${color} rounded-xl p-4 flex items-center gap-3`}>
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="text-2xl font-bold">{count}</p>
        <p className="text-sm font-medium opacity-80">{label}</p>
      </div>
    </div>
  );
}

function ActionCard({ title, description, icon, gradient, link }) {
  return (
    <Link href={link}>
      <div className={`group bg-gradient-to-br ${gradient} rounded-2xl shadow-lg p-6 text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}>
        <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-white/80 mb-4">{description}</p>
        <div className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all">
          Get Started <FaArrowRight />
        </div>
      </div>
    </Link>
  );
}

function RevenueChart() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const data = [42000, 48000, 51000, 47000, 54000, 58000];
  const maxValue = Math.max(...data);
  return (
    <div className="h-64">
      <div className="flex items-end justify-between h-full gap-4">
        {months.map((month, index) => (
          <div key={month} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-gray-100 rounded-t-xl relative overflow-hidden group">
              <div 
                className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-xl transition-all duration-1000 ease-out hover:from-emerald-600 hover:to-teal-500"
                style={{ height: `${(data[index] / maxValue) * 240}px` }}
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-600">{month}</span>
            <span className="text-xs text-gray-500">৳{(data[index] / 1000).toFixed(0)}k</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpendingChart() {
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const data = [1200, 1500, 980, 1800];
  const maxValue = Math.max(...data);
  return (
    <div className="h-64">
      <div className="flex items-end justify-between h-full gap-4">
        {weeks.map((week, index) => (
          <div key={week} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-gray-100 rounded-t-xl relative overflow-hidden group">
              <div 
                className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-xl transition-all duration-1000 ease-out hover:from-blue-600 hover:to-cyan-500"
                style={{ height: `${(data[index] / maxValue) * 240}px` }}
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-600">{week}</span>
            <span className="text-xs text-gray-500">৳{data[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}