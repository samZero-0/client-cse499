'use client';
import { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import Navbar from '@/components/common/Navbar';
import PageBanner from '@/components/common/PageBanner';
import SignInPrompt from '@/components/common/SignInPrompt';
import BundleBuilder from '@/components/subscription/BundleBuilder';
import useAxios from '@/hooks/useAxios';
import { AuthContext } from '@/context/AuthContext';
import { apiError } from '@/utils/pricing';
import { DATA_CHANGED_EVENT } from '@/components/ai/ChatBot';

const PLACEHOLDER = 'https://placehold.co/400x400/EDF0DC/5A6558?text=PantryPal';
const frequencies = ['Weekly', 'Bi-Weekly', 'Monthly'];
const PRODUCTS_PER_PAGE = 12;

const benefits = [
  { title: 'Save 15%', text: 'On every subscription delivery' },
  { title: 'Free delivery', text: 'On every subscription delivery' },
  { title: 'Skip or pause', text: 'Whenever you need to' },
];

// Comparable snapshot of what is saved, used to detect unsaved changes
const snapshot = (items, frequency) =>
  JSON.stringify({ frequency, items: items.map((i) => [i._id, i.quantity]) });

export default function SubscriptionPage() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [bundle, setBundle] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [frequency, setFrequency] = useState('Monthly');
  const [nextDelivery, setNextDelivery] = useState(null);
  const [status, setStatus] = useState('active');
  const [hasSubscription, setHasSubscription] = useState(false);
  const [savedSnapshot, setSavedSnapshot] = useState(snapshot([], 'Monthly'));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const axios = useAxios();

  // Mirror a subscription returned by the server into page state
  const applySubscription = (sub) => {
    const formattedItems = sub.items.map((i) => {
      const productObj = i.product || {};
      return {
        _id: productObj._id || i._id,
        name: productObj.name || i.name || 'Unknown item',
        price: productObj.price ?? i.price ?? 0,
        imageUrl: productObj.imageUrl || '',
        quantity: i.quantity,
      };
    });
    const savedFrequency = sub.frequency || 'Monthly';
    setBundle(formattedItems);
    setFrequency(savedFrequency);
    setNextDelivery(sub.nextDeliveryDate);
    setStatus(sub.status || 'active');
    setHasSubscription(formattedItems.length > 0);
    setSavedSnapshot(snapshot(formattedItems, savedFrequency));
  };

  const fetchData = async () => {
    try {
      const prodRes = await axios.get('/products');
      setAvailableProducts(prodRes.data);

      try {
        const subRes = await axios.get('/subscription');
        if (subRes.data && subRes.data.items) {
          applySubscription(subRes.data);
        }
      } catch {
        // 404 = the user has not subscribed yet
        setBundle([]);
        setHasSubscription(false);
      }
    } catch (error) {
      console.error('Error fetching page data:', error);
      toast.error('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  // The assistant can add items to the subscription; reload when it does
  useEffect(() => {
    const reload = () => user && fetchData();
    window.addEventListener(DATA_CHANGED_EVENT, reload);
    return () => window.removeEventListener(DATA_CHANGED_EVENT, reload);
  }, [user]);

  const addToBundle = (product) => {
    if (bundle.some((item) => item._id === product._id)) {
      toast.error(`${product.name} is already in your bundle`);
      return;
    }
    setBundle([...bundle, { ...product, quantity: 1 }]);
    toast.success(`${product.name} added to your bundle`);
  };

  const handleSave = async (items) => {
    setSaving(true);
    try {
      // The schema requires name and price on each item
      const backendItems = items.map((item) => ({
        product: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));
      const { data } = await axios.post('/subscription', { items: backendItems, frequency });
      applySubscription(data);
      toast.success(items.length ? 'Subscription saved' : 'Subscription emptied. No more deliveries until you add items.');
    } catch (error) {
      toast.error(apiError(error, 'Could not save your subscription. Please try again.'));
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = async () => {
    try {
      const { data } = await axios.post('/subscription/skip');
      setNextDelivery(data.nextDeliveryDate);
      toast.success(`Skipped. Next delivery: ${new Date(data.nextDeliveryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);
    } catch (error) {
      toast.error(apiError(error, 'Could not skip the delivery'));
    }
  };

  const handleStatus = async (nextStatus) => {
    try {
      const { data } = await axios.put('/subscription/status', { status: nextStatus });
      setStatus(data.status);
      setNextDelivery(data.nextDeliveryDate);
      toast.success(nextStatus === 'paused' ? 'Deliveries paused' : 'Deliveries resumed');
    } catch (error) {
      toast.error(apiError(error, 'Could not update your subscription'));
    }
  };

  const changeSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };
  const changeCategory = (value) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const categories = ['All', ...[...new Set(availableProducts.map((p) => p.category))].sort()];
  const filteredProducts = availableProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const dirty = snapshot(bundle, frequency) !== savedSnapshot;
  const showSignIn = !authLoading && !user;
  const isLoading = !showSignIn && (authLoading || loading);

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar wide />

      <main className="mx-auto w-full max-w-[1600px] flex-grow px-5 pb-16 pt-4 lg:px-8 lg:pt-6">
        <PageBanner
          eyebrow="Subscriptions"
          title="Essentials on repeat."
          description="Build a bundle once and it arrives on your schedule. Skip, swap or change it any time."
          image="/images/produce-baskets.jpg"
        >
          {!showSignIn && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#D5DAC6]">Deliver every</p>
              <div role="group" aria-label="Delivery frequency" className="inline-flex rounded-full bg-white/10 p-1 backdrop-blur">
                {frequencies.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFrequency(option)}
                    aria-pressed={frequency === option}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      frequency === option ? 'bg-lime text-forest' : 'text-[#F6F7EF] hover:bg-white/10'
                    }`}
                  >
                    {option === 'Bi-Weekly' ? '2 weeks' : option === 'Weekly' ? 'Week' : 'Month'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </PageBanner>

        {showSignIn ? (
          <SignInPrompt
            title="Log in to manage subscriptions."
            description="Set up a recurring bundle of your essentials and save 15% on every delivery."
          />
        ) : (
          <>
            {/* Benefits */}
            <div className="mt-6 grid border-y border-line sm:grid-cols-3">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.title}
                  className={`py-5 sm:px-6 sm:text-center ${index > 0 ? 'border-t border-line sm:border-l sm:border-t-0' : ''}`}
                >
                  <p className="text-sm font-semibold text-ink">{benefit.title}</p>
                  <p className="mt-0.5 text-sm text-ink-muted">{benefit.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-12 xl:gap-10">
              {/* Product picker */}
              <section className="lg:col-span-8">
                <div className="flex flex-col gap-4 border-b border-line pb-5 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Add to your bundle</p>
                    <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">Pick your essentials</h2>
                  </div>
                  <div className="w-full md:w-72">
                    <label htmlFor="bundle-search" className="sr-only">
                      Search products
                    </label>
                    <input
                      id="bundle-search"
                      type="search"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => changeSearch(e.target.value)}
                      className="w-full rounded-full border border-line bg-surface px-5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-olive focus:outline-none"
                    />
                  </div>
                </div>

                <div className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0">
                  {categories.map((cat) => (
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
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="mt-6">
                  {isLoading ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="overflow-hidden rounded-[1.25rem] border border-line bg-surface">
                          <div className="aspect-square animate-pulse bg-surface-muted" />
                          <div className="space-y-2 p-4">
                            <div className="h-4 w-3/4 animate-pulse rounded-full bg-surface-muted" />
                            <div className="h-8 w-full animate-pulse rounded-full bg-surface-muted" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="rounded-[2rem] border border-dashed border-line px-6 py-16 text-center">
                      <p className="text-xl font-extrabold tracking-tight text-ink">No products found</p>
                      <p className="mt-2 text-ink-muted">Try another search or category.</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                        {currentProducts.map((product) => (
                          <PickerCard
                            key={product._id}
                            product={product}
                            onAdd={() => addToBundle(product)}
                            isInBundle={bundle.some((item) => item._id === product._id)}
                          />
                        ))}
                      </div>

                      {totalPages > 1 && (
                        <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
                          <button
                            type="button"
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Previous
                          </button>
                          <span className="text-sm text-ink-muted tabular-nums">
                            Page {currentPage} of {totalPages}
                          </span>
                          <button
                            type="button"
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </section>

              {/* Bundle */}
              <aside className="lg:col-span-4">
                <div className="lg:sticky lg:top-24">
                  <BundleBuilder
                    items={bundle}
                    onChange={setBundle}
                    onSave={handleSave}
                    saving={saving}
                    dirty={dirty}
                    frequency={frequency}
                    nextDelivery={nextDelivery}
                    status={status}
                    canManage={hasSubscription && !dirty}
                    onSkip={handleSkip}
                    onStatusChange={handleStatus}
                  />
                </div>
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function PickerCard({ product, onAdd, isInBundle }) {
  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-[1.25rem] border bg-surface transition-all duration-300 ${
        isInBundle ? 'border-primary ring-1 ring-primary' : 'border-line hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5'
      }`}
    >
      <div className="relative aspect-square overflow-hidden bg-surface-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl || PLACEHOLDER}
          alt={product.name}
          onError={(e) => {
            if (e.currentTarget.src !== PLACEHOLDER) e.currentTarget.src = PLACEHOLDER;
          }}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {isInBundle && (
          <span className="absolute left-3 top-3 rounded-full bg-lime px-2.5 py-1 text-xs font-bold text-forest">
            In bundle
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="line-clamp-1 text-sm font-semibold text-ink">{product.name}</p>
        <p className="mt-0.5 text-sm text-ink-muted tabular-nums">৳{product.price}</p>
        <button
          type="button"
          onClick={onAdd}
          disabled={isInBundle}
          className="mt-3 rounded-full bg-primary py-2 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-default disabled:bg-surface-muted disabled:text-ink-muted"
        >
          {isInBundle ? 'Added' : 'Add'}
        </button>
      </div>
    </div>
  );
}
