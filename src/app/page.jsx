import Link from 'next/link';
import NavBar from '@/components/common/Navbar';
import Button from '@/components/common/Button';

export default function Home() {
  return (
    <main className="flex-grow flex flex-col">
      <NavBar />
      {/* Hero Section */}
      <section className="bg-white py-20 lg:py-32 border-b border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Groceries made <span className="text-green-600">Intelligent.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop wasting food and money. PantryPal tracks your expiration dates, automates your essentials, and helps you shop smarter.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/products">
              <Button className="w-full sm:w-auto text-lg px-8 py-4">Start Shopping</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="w-full sm:w-auto text-lg px-8 py-4">Create Account</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-10">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-2xl">🥬</div>
                    <h3 className="text-xl font-bold mb-3">Digital Pantry</h3>
                    <p className="text-gray-600">Track what you have at home. Get alerts before your food expires.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-2xl">📦</div>
                    <h3 className="text-xl font-bold mb-3">Smart Subscriptions</h3>
                    <p className="text-gray-600">Never run out of rice or oil. Customize your monthly essential bundles.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-2xl">📊</div>
                    <h3 className="text-xl font-bold mb-3">Budget Analytics</h3>
                    <p className="text-gray-600">Visualize your spending habits and find ways to save money.</p>
                </div>
            </div>
        </div>
      </section>
    </main>
  );
}