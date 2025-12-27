import Navbar from '@/components/common/Navbar';
import Button from '@/components/common/Button';

// Normally fetch data here
const getProduct = (id) => {
    return { id, name: 'Premium Basmati Rice (5kg)', price: 450, description: 'Long grain aromatic rice perfect for biryani and pulao.', category: 'Staples' };
};

export default function ProductDetail({ params }) {
    const product = getProduct(params.id);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="container mx-auto px-4 py-10 flex-grow">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden grid md:grid-cols-2">
                    <div className="bg-gray-200 h-96 flex items-center justify-center">
                        <span className="text-gray-400 text-xl font-medium">Image Placeholder</span>
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                        <span className="text-green-600 font-bold tracking-wide text-sm uppercase mb-2">{product.category}</span>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                        <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>
                        <div className="flex items-center gap-6">
                            <span className="text-4xl font-bold text-gray-900">৳{product.price}</span>
                            <Button className="px-8 py-3 text-lg">Add to Cart</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}