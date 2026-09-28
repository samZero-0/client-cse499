'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/common/Navbar';
import ProductCard from '@/components/products/ProductCard';
import FilterSidebar from '@/components/products/FilterSidebar';
import useAxios from '@/hooks/useAxios';


const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: low to high' },
  { value: 'price-high', label: 'Price: high to low' },
  { value: 'name', label: 'Name: A to Z' },
  { value: 'newest', label: 'Newest first' },
];

const defaultFilters = { inStock: false };
const MAX_PRICE = 5000;
const PRODUCTS_PER_PAGE = 12;

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-line bg-surface">
      <div className="aspect-square animate-pulse bg-surface-muted" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-1/3 animate-pulse rounded-full bg-surface-muted" />
        <div className="h-5 w-3/4 animate-pulse rounded-full bg-surface-muted" />
        <div className="h-3 w-full animate-pulse rounded-full bg-surface-muted" />
        <div className="flex items-center justify-between pt-3">
          <div className="h-6 w-16 animate-pulse rounded-full bg-surface-muted" />
          <div className="h-10 w-28 animate-pulse rounded-full bg-surface-muted" />
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(MAX_PRICE);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(defaultFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const axios = useAxios();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/products');
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Any filter change sends the user back to the first page
  const withPageReset = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };
  const changeCategory = withPageReset(setSelectedCategory);
  const changePrice = withPageReset(setPriceRange);
  const changeSearch = withPageReset(setSearchTerm);
  const changeSort = withPageReset(setSortBy);
  const changeFilters = withPageReset(setSelectedFilters);

  const categories = [...new Set(products.map((p) => p.category))].sort();

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    const catMatch = selectedCategory === 'All' || product.category === selectedCategory;
    const priceMatch = product.price <= priceRange;
    const searchMatch =
      product.name.toLowerCase().includes(term) || product.description.toLowerCase().includes(term);
    const stockMatch = !selectedFilters.inStock || product.stock > 0;

    return catMatch && priceMatch && searchMatch && stockMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
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

  const hasActiveFilters =
    selectedCategory !== 'All' || searchTerm || selectedFilters.inStock || Number(priceRange) < MAX_PRICE;

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setPriceRange(MAX_PRICE);
    setSearchTerm('');
    setSelectedFilters(defaultFilters);
    setCurrentPage(1);
  };

  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...');
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
    return pages;
  };

  const sidebarProps = {
    categories,
    selectedCategory,
    onSelectCategory: changeCategory,
    priceRange,
    onPriceChange: changePrice,
    selectedFilters,
    onFilterChange: changeFilters,
  };

  const pagerButton =
    'rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line';

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar wide />

      <div className="mx-auto w-full max-w-[1600px] flex-grow px-5 pb-16 pt-4 lg:px-8 lg:pt-6">
        <div className="flex gap-8 xl:gap-10">
          {/* Desktop sidebar */}
          <div className="hidden shrink-0 lg:block">
            <div className="sticky top-24 pb-8">
              <FilterSidebar {...sidebarProps} />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            {/* Header */}
            <section className="relative isolate overflow-hidden rounded-[1.5rem] px-6 py-6 text-[#F6F7EF] sm:px-8 lg:py-7">
              <Image
                src="/images/shop-hero.jpg"
                alt=""
                fill
                priority
                sizes="(min-width: 1600px) 1300px, 100vw"
                className="-z-20 object-cover object-[center_40%]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-gradient-to-r from-[#1B241E]/95 via-[#1B241E]/80 to-[#1B241E]/55"
              />
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-10">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime">Shop</p>
                  <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">
                    Fresh groceries, delivered.
                  </h1>
                  <p className="mt-1.5 text-sm text-[#D5DAC6]">
                    Everyday essentials at fair prices. Free delivery on orders over ৳500.
                  </p>
                </div>

                <div className="w-full md:max-w-sm lg:max-w-md">
                  <label htmlFor="product-search" className="sr-only">
                    Search products
                  </label>
                  <div className="flex items-center gap-2 rounded-full bg-surface p-1 pl-5 shadow-xl shadow-black/20">
                    <input
                      id="product-search"
                      type="search"
                      placeholder="Search milk, apples, bread..."
                      value={searchTerm}
                      onChange={(e) => changeSearch(e.target.value)}
                      className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => changeSearch('')}
                        className="rounded-full px-4 py-2 text-sm font-semibold text-ink-muted transition-colors hover:text-ink"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Category chips (mobile / tablet) */}
            <div className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] lg:hidden">
              {['All', ...categories].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => changeCategory(cat)}
                  aria-pressed={selectedCategory === cat}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'border-primary bg-primary text-on-primary'
                      : 'border-line bg-surface text-ink-muted hover:text-ink'
                  }`}
                >
                  {cat === 'All' ? 'All products' : cat}
                </button>
              ))}
            </div>

            {/* Toolbar */}
            <div className="mt-6 flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-center sm:justify-between lg:mt-8">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-ink">
                  {selectedCategory === 'All' ? 'All products' : selectedCategory}
                </h2>
                <span className="text-sm text-ink-muted">
                  {loading ? 'Loading...' : `${sortedProducts.length} items`}
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-sm font-semibold text-ink underline decoration-olive decoration-2 underline-offset-4 hover:decoration-ink"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(true)}
                  className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-ink lg:hidden"
                >
                  Filters
                </button>

                <label htmlFor="sort" className="sr-only">
                  Sort products
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => changeSort(e.target.value)}
                  className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink focus:border-olive focus:outline-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <div
                  role="group"
                  aria-label="Layout"
                  className="hidden items-center rounded-full border border-line bg-surface-muted p-0.5 sm:inline-flex"
                >
                  {['grid', 'list'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setViewMode(mode)}
                      aria-pressed={viewMode === mode}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors ${
                        viewMode === mode ? 'bg-surface text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="mt-6">
              {loading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-5">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </div>
              ) : sortedProducts.length > 0 ? (
                <>
                  <div
                    className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-5'
                        : 'flex flex-col gap-4'
                    }
                  >
                    {currentProducts.map((product) => (
                      <ProductCard key={product._id} product={{ ...product, id: product._id }} viewMode={viewMode} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <nav
                      aria-label="Pagination"
                      className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 sm:flex-row"
                    >
                      <p className="text-sm text-ink-muted">
                        Showing <span className="font-semibold text-ink">{indexOfFirstProduct + 1}</span>&ndash;
                        <span className="font-semibold text-ink">
                          {Math.min(indexOfLastProduct, sortedProducts.length)}
                        </span>{' '}
                        of <span className="font-semibold text-ink">{sortedProducts.length}</span>
                      </p>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={pagerButton}
                        >
                          Previous
                        </button>
                        <div className="hidden items-center gap-1 sm:flex">
                          {getPageNumbers().map((page, index) =>
                            page === '...' ? (
                              <span key={`ellipsis-${index}`} className="px-2 text-ink-muted">
                                &hellip;
                              </span>
                            ) : (
                              <button
                                key={page}
                                type="button"
                                onClick={() => handlePageChange(page)}
                                aria-current={currentPage === page ? 'page' : undefined}
                                className={`h-10 min-w-10 rounded-full text-sm font-semibold tabular-nums transition-colors ${
                                  currentPage === page
                                    ? 'bg-primary text-on-primary'
                                    : 'text-ink-muted hover:bg-surface-muted hover:text-ink'
                                }`}
                              >
                                {page}
                              </button>
                            )
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={pagerButton}
                        >
                          Next
                        </button>
                      </div>
                    </nav>
                  )}
                </>
              ) : (
                <div className="rounded-[2rem] border border-dashed border-line px-6 py-20 text-center">
                  <h3 className="text-2xl font-extrabold tracking-tight text-ink">Nothing matches that search</h3>
                  <p className="mx-auto mt-3 max-w-sm text-ink-muted">
                    Try a different word, pick another category or widen the price range.
                  </p>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="mt-8 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setShowMobileFilters(false)}
            className="absolute inset-0 bg-black/40 animate-fade-in"
          />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-canvas shadow-2xl animate-slide-in-right">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="text-lg font-bold text-ink">Filters</h2>
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="text-sm font-semibold text-ink-muted hover:text-ink"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <FilterSidebar {...sidebarProps} />
            </div>
            <div className="border-t border-line p-5">
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-on-primary"
              >
                Show {sortedProducts.length} items
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
