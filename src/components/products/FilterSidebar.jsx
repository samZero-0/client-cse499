import { FaCheck } from 'react-icons/fa';

export default function FilterSidebar({ 
  categories, 
  selectedCategory, 
  onSelectCategory, 
  priceRange, 
  onPriceChange,
  selectedFilters,
  onFilterChange 
}) {
  const handleFilterToggle = (filterName) => {
    onFilterChange({
      ...selectedFilters,
      [filterName]: !selectedFilters[filterName]
    });
  };

  return (
    <aside className="w-full lg:w-72 space-y-6">
      {/* Categories */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></span>
          Categories
        </h3>
        <ul className="space-y-2">
          <li>
            <button 
              onClick={() => onSelectCategory('All')}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
                selectedCategory === 'All' 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>All Products</span>
                {selectedCategory === 'All' && <FaCheck className="text-sm" />}
              </div>
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat}>
              <button 
                onClick={() => onSelectCategory(cat)}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
                  selectedCategory === cat 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{cat}</span>
                  {selectedCategory === cat && <FaCheck className="text-sm" />}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></span>
          Price Range
        </h3>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">Up to:</span>
            <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              ৳{priceRange}
            </span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="5000" 
            step="100"
            value={priceRange} 
            onChange={(e) => onPriceChange(e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>৳0</span>
            <span>৳5000</span>
          </div>
        </div>
      </div>

      {/* Additional Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></span>
          Filters
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={selectedFilters.inStock}
                onChange={() => handleFilterToggle('inStock')}
                className="sr-only"
              />
              <div className={`w-6 h-6 rounded-lg border-2 transition-all ${
                selectedFilters.inStock 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-600' 
                  : 'border-gray-300 group-hover:border-emerald-400'
              }`}>
                {selectedFilters.inStock && (
                  <FaCheck className="text-white text-xs absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                )}
              </div>
            </div>
            <span className="text-gray-700 font-medium">In Stock Only</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={selectedFilters.onSale}
                onChange={() => handleFilterToggle('onSale')}
                className="sr-only"
              />
              <div className={`w-6 h-6 rounded-lg border-2 transition-all ${
                selectedFilters.onSale 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-600' 
                  : 'border-gray-300 group-hover:border-emerald-400'
              }`}>
                {selectedFilters.onSale && (
                  <FaCheck className="text-white text-xs absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                )}
              </div>
            </div>
            <span className="text-gray-700 font-medium">On Sale</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={selectedFilters.organic}
                onChange={() => handleFilterToggle('organic')}
                className="sr-only"
              />
              <div className={`w-6 h-6 rounded-lg border-2 transition-all ${
                selectedFilters.organic 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-600' 
                  : 'border-gray-300 group-hover:border-emerald-400'
              }`}>
                {selectedFilters.organic && (
                  <FaCheck className="text-white text-xs absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                )}
              </div>
            </div>
            <span className="text-gray-700 font-medium">Organic</span>
          </label>
        </div>
      </div>

      {/* Special Offers Banner */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-6 rounded-2xl shadow-lg text-white">
        <div className="text-3xl mb-3">🎁</div>
        <h4 className="font-bold text-lg mb-2">Special Offer!</h4>
        <p className="text-emerald-50 text-sm mb-4">
          Get 15% off on your first subscription order
        </p>
        <button className="w-full bg-white text-emerald-600 font-bold py-2 px-4 rounded-lg hover:bg-emerald-50 transition-all">
          Learn More
        </button>
      </div>
    </aside>
  );
}