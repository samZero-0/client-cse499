import Link from 'next/link';
import Image from 'next/image';

const extraFilters = [{ key: 'inStock', label: 'In stock only' }];

function SectionTitle({ children }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{children}</h3>
  );
}

export default function FilterSidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  priceRange,
  onPriceChange,
  selectedFilters,
  onFilterChange,
}) {
  const handleFilterToggle = (filterName) => {
    onFilterChange({
      ...selectedFilters,
      [filterName]: !selectedFilters[filterName],
    });
  };

  const categoryButton = (value, label) => {
    const active = selectedCategory === value;
    return (
      <li key={value}>
        <button
          type="button"
          onClick={() => onSelectCategory(value)}
          aria-pressed={active}
          className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-colors ${
            active ? 'bg-primary text-on-primary' : 'text-ink-muted hover:bg-surface-muted hover:text-ink'
          }`}
        >
          {label}
        </button>
      </li>
    );
  };

  return (
    <aside className="w-full space-y-8 lg:w-60 xl:w-64">
      {/* Categories */}
      <div>
        <SectionTitle>Categories</SectionTitle>
        <ul className="mt-4 space-y-1">
          {categoryButton('All', 'All products')}
          {categories.map((cat) => categoryButton(cat, cat))}
        </ul>
      </div>

      {/* Price Range */}
      <div className="border-t border-line pt-8">
        <div className="flex items-baseline justify-between">
          <SectionTitle>Max price</SectionTitle>
          <span className="text-sm font-bold text-ink tabular-nums">৳{priceRange}</span>
        </div>
        <input
          type="range"
          min="0"
          max="5000"
          step="100"
          value={priceRange}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          aria-label="Maximum price"
          className="mt-5 w-full cursor-pointer accent-primary"
        />
        <div className="mt-2 flex justify-between text-xs text-ink-muted tabular-nums">
          <span>৳0</span>
          <span>৳5000</span>
        </div>
      </div>

      {/* Additional Filters */}
      <div className="border-t border-line pt-8">
        <SectionTitle>Filters</SectionTitle>
        <div className="mt-4 space-y-3">
          {extraFilters.map((filter) => (
            <label key={filter.key} className="flex cursor-pointer items-center gap-3 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={selectedFilters[filter.key]}
                onChange={() => handleFilterToggle(filter.key)}
                className="h-4 w-4 cursor-pointer rounded accent-primary"
              />
              {filter.label}
            </label>
          ))}
        </div>
      </div>

      {/* Offer */}
      <Link
        href="/subscription"
        className="group relative isolate block overflow-hidden rounded-[1.5rem] p-6 text-[#F6F7EF]"
      >
        <Image
          src="/images/feature-subscription.jpg"
          alt=""
          fill
          sizes="256px"
          className="-z-20 object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[#1B241E]/95 via-[#1B241E]/70 to-[#1B241E]/30" />
        <p className="pt-16 text-xs font-semibold uppercase tracking-[0.16em] text-lime">Subscribe and save</p>
        <p className="mt-2 text-lg font-bold leading-snug">15% off and free delivery on every subscription order</p>
        <p className="mt-4 text-sm font-semibold underline decoration-lime/60 decoration-2 underline-offset-4 group-hover:decoration-lime">
          Build a bundle
        </p>
      </Link>
    </aside>
  );
}
