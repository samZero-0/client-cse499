export default function FilterSidebar({ categories, selectedCategory, onSelectCategory, priceRange, onPriceChange }) {
  return (
    <aside className="w-full md:w-64 bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit">
      <h3 className="font-bold text-gray-800 mb-4 text-lg">Categories</h3>
      <ul className="space-y-2 mb-8">
        <li>
            <button 
                onClick={() => onSelectCategory('All')}
                className={`w-full text-left px-2 py-1 rounded ${selectedCategory === 'All' ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
            >
                All Products
            </button>
        </li>
        {categories.map((cat) => (
          <li key={cat}>
            <button 
                onClick={() => onSelectCategory(cat)}
                className={`w-full text-left px-2 py-1 rounded ${selectedCategory === cat ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>

      <h3 className="font-bold text-gray-800 mb-4 text-lg">Max Price: ৳{priceRange}</h3>
      <input 
        type="range" 
        min="0" 
        max="5000" 
        value={priceRange} 
        onChange={(e) => onPriceChange(e.target.value)}
        className="w-full accent-green-600"
      />
    </aside>
  );
}