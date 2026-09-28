'use client';
import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Navbar from '@/components/common/Navbar';
import PageBanner from '@/components/common/PageBanner';
import StatTile from '@/components/common/StatTile';
import SignInPrompt from '@/components/common/SignInPrompt';
import PantryItemDetail from '@/components/pantry/PantryItemDetail';
import useAxios from '@/hooks/useAxios';
import { AuthContext } from '@/context/AuthContext';
import { getExpiryInfo } from '@/utils/calculateExpiry';
import { apiError } from '@/utils/pricing';

const PLACEHOLDER = 'https://placehold.co/600x400/EDF0DC/5A6558?text=PantryPal';

const filters = [
  { value: 'all', label: 'All' },
  { value: 'fresh', label: 'Fresh' },
  { value: 'expiring', label: 'Use soon' },
  { value: 'expired', label: 'Expired' },
];

const sortOptions = [
  { value: 'expiry', label: 'Expiry: soonest first' },
  { value: 'recent', label: 'Recently added' },
  { value: 'name', label: 'Name: A to Z' },
];

// Items saved before quantities/prices were tracked count as one unit at the current price
const unitsOf = (item) => item.quantity ?? 1;
const unitPriceOf = (item) => item.price ?? item.product?.price ?? 0;

const matchesFilter = (status, filter) =>
  filter === 'all' ||
  (filter === 'fresh' && status === 'fresh') ||
  (filter === 'expiring' && status === 'expiring_soon') ||
  (filter === 'expired' && status === 'expired');

export default function PantryPage() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('expiry');
  const axios = useAxios();

  const fetchPantry = async () => {
    try {
      const { data } = await axios.get('/pantry');
      setItems(data);
    } catch (error) {
      console.error('Error fetching pantry', error);
      toast.error('Failed to load pantry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchPantry();
  }, [user]);

  // --- Stats ---
  const withExpiry = items.map((item) => ({ item, expiry: getExpiryInfo(item) }));
  const counts = { all: items.length, fresh: 0, expiring: 0, expired: 0 };
  let totalValue = 0;
  withExpiry.forEach(({ item, expiry }) => {
    if (expiry.status === 'expired') counts.expired++;
    else if (expiry.status === 'expiring_soon') counts.expiring++;
    else counts.fresh++;
    totalValue += unitPriceOf(item) * unitsOf(item);
  });

  // --- Filter & sort ---
  const visible = withExpiry
    .filter(({ item, expiry }) => {
      const name = (item.name || item.product?.name || '').toLowerCase();
      return name.includes(searchTerm.toLowerCase()) && matchesFilter(expiry.status, filterStatus);
    })
    .sort((a, b) => {
      if (sortBy === 'expiry') return a.expiry.daysLeft - b.expiry.daysLeft;
      if (sortBy === 'name') return (a.item.name || '').localeCompare(b.item.name || '');
      return new Date(b.item.purchaseDate) - new Date(a.item.purchaseDate);
    });

  // Use up one unit; the server removes the item when none are left
  const handleConsume = async (item) => {
    try {
      const { data } = await axios.patch(`/pantry/${item._id}/consume`, { amount: 1 });
      if (data.removed) {
        setItems((prev) => prev.filter((i) => i._id !== item._id));
        setSelectedItem(null);
        toast.success(`${item.name} used up and removed from your pantry`);
      } else {
        setItems((prev) => prev.map((i) => (i._id === item._id ? data : i)));
        setSelectedItem(data);
        toast.success(`Marked one ${item.name} as used. ${data.quantity} left.`);
      }
    } catch (error) {
      toast.error(apiError(error, 'Could not update this item'));
    }
  };

  const handleRemove = async (item) => {
    try {
      await axios.delete(`/pantry/${item._id}`);
      setItems((prev) => prev.filter((i) => i._id !== item._id));
      setSelectedItem(null);
      toast.success(`${item.name} removed from your pantry`);
    } catch (error) {
      toast.error(apiError(error, 'Could not remove this item'));
    }
  };

  const showSignIn = !authLoading && !user;
  const isLoading = !showSignIn && (authLoading || loading);

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar wide />

      <main className="mx-auto w-full max-w-[1600px] flex-grow px-5 pb-16 pt-4 lg:px-8 lg:pt-6">
        <PageBanner
          eyebrow="My pantry"
          title="Everything in your kitchen."
          description="Items you buy land here with their expiry dates, so you can use them before they go to waste."
          image="/images/auth-register.jpg"
          imagePosition="center 30%"
        >
          <div className="w-full md:w-80 lg:w-96">
            <label htmlFor="pantry-search" className="sr-only">
              Search pantry
            </label>
            <input
              id="pantry-search"
              type="search"
              placeholder="Search your pantry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={showSignIn}
              className="w-full rounded-full bg-surface px-5 py-3 text-sm text-ink shadow-xl shadow-black/20 placeholder:text-ink-muted focus:outline-none disabled:opacity-60"
            />
          </div>
        </PageBanner>

        {showSignIn ? (
          <SignInPrompt
            title="Log in to see your pantry."
            description="Your pantry fills up automatically as you shop, and shows what to use before it expires."
          />
        ) : (
          <>
            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatTile label="In your pantry" value={isLoading ? '...' : counts.all} note="products tracked" tone="lime" />
              <StatTile
                label="Use soon"
                value={isLoading ? '...' : counts.expiring}
                note="within 3 days"
                highlight={counts.expiring > 0}
              />
              <StatTile label="Expired" value={isLoading ? '...' : counts.expired} note="past their date" />
              <StatTile label="Pantry value" value={isLoading ? '...' : `৳${totalValue}`} note="what you paid for what is left" tone="sky" />
            </div>

            {/* Toolbar */}
            <div className="mt-10 flex flex-col gap-4 border-b border-line pb-5 md:flex-row md:items-center md:justify-between">
              <div
                role="group"
                aria-label="Filter by freshness"
                className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:px-0"
              >
                {filters.map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setFilterStatus(filter.value)}
                    aria-pressed={filterStatus === filter.value}
                    className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      filterStatus === filter.value
                        ? 'border-primary bg-primary text-on-primary'
                        : 'border-line bg-surface text-ink-muted hover:text-ink'
                    }`}
                  >
                    {filter.label}
                    <span className="ml-2 tabular-nums opacity-60">{isLoading ? '' : counts[filter.value]}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <label htmlFor="pantry-sort" className="sr-only">
                  Sort pantry
                </label>
                <select
                  id="pantry-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink focus:border-olive focus:outline-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Items */}
            <div className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="overflow-hidden rounded-[1.5rem] border border-line bg-surface">
                      <div className="aspect-[4/3] animate-pulse bg-surface-muted" />
                      <div className="space-y-3 p-5">
                        <div className="h-4 w-2/3 animate-pulse rounded-full bg-surface-muted" />
                        <div className="h-2 w-full animate-pulse rounded-full bg-surface-muted" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : items.length === 0 ? (
                <EmptyState
                  title="Your pantry is empty."
                  text="Everything you order is added here automatically, with its use-by date."
                  action={
                    <Link
                      href="/products"
                      className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
                    >
                      Shop groceries
                    </Link>
                  }
                />
              ) : visible.length === 0 ? (
                <EmptyState
                  title="Nothing matches."
                  text="Try another search or a different freshness filter."
                  action={
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm('');
                        setFilterStatus('all');
                      }}
                      className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
                    >
                      Show everything
                    </button>
                  }
                />
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-5">
                  {visible.map(({ item, expiry }) => (
                    <PantryCard key={item._id} item={item} expiry={expiry} onClick={() => setSelectedItem(item)} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {selectedItem && (
        <PantryItemDetail
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onConsume={() => handleConsume(selectedItem)}
          onRemove={() => handleRemove(selectedItem)}
        />
      )}
    </div>
  );
}

function EmptyState({ title, text, action }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-line px-6 py-20 text-center">
      <h3 className="text-2xl font-extrabold tracking-tight text-ink">{title}</h3>
      <p className="mx-auto mt-3 max-w-sm text-ink-muted">{text}</p>
      <div className="mt-8">{action}</div>
    </div>
  );
}

function PantryCard({ item, expiry, onClick }) {
  const useBy = new Date(expiry.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-line bg-surface text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.product?.imageUrl || PLACEHOLDER}
          alt={item.name}
          onError={(e) => {
            if (e.currentTarget.src !== PLACEHOLDER) e.currentTarget.src = PLACEHOLDER;
          }}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className={`absolute left-3 top-3 rounded-full bg-surface px-3 py-1 text-xs font-bold ${expiry.classes.text}`}>
          {expiry.label}
        </span>
      </div>

      <div className="flex w-full flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-lg font-bold tracking-tight text-ink">{item.name}</h3>
          <span className="shrink-0 text-sm font-semibold text-ink-muted tabular-nums">&times; {unitsOf(item)}</span>
        </div>
        <p className="mt-1 text-sm text-ink-muted">
          {expiry.status === 'expired' ? 'Expired' : 'Use by'} {useBy}
        </p>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-muted">
          <div className={`h-full rounded-full ${expiry.classes.bar}`} style={{ width: `${expiry.percent}%` }} />
        </div>
      </div>
    </button>
  );
}
