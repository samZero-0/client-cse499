'use client';
import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/common/Navbar';
import PageBanner from '@/components/common/PageBanner';
import StatTile from '@/components/common/StatTile';
import SignInPrompt from '@/components/common/SignInPrompt';
import OpenAssistantButton from '@/components/ai/OpenAssistantButton';
import useAxios from '@/hooks/useAxios';
import { AuthContext } from '@/context/AuthContext';
import { getExpiryInfo } from '@/utils/calculateExpiry';

const shortDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const longDate = (date) =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const money = (value) => `৳${Number(value || 0).toLocaleString()}`;
const itemQty = (item) => item.qty ?? item.quantity ?? 0;
const unitCount = (order) => order.orderItems.reduce((sum, item) => sum + itemQty(item), 0);

const quickActions = [
  { title: 'Shop groceries', text: 'Fresh products, delivered', href: '/products', image: '/images/feature-assistant.jpg' },
  { title: 'Manage pantry', text: 'See what to use first', href: '/pantry', image: '/images/feature-pantry.jpg' },
  { title: 'Subscriptions', text: 'Essentials on repeat', href: '/subscription', image: '/images/feature-subscription.jpg' },
];

export default function Dashboard() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [pantry, setPantry] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const axios = useAxios();

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/stats');
        setStats(data);
        if (data.role !== 'admin') {
          const pantryRes = await axios.get('/pantry').catch(() => ({ data: [] }));
          setPantry(pantryRes.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const showSignIn = !authLoading && !user;
  const isLoading = !showSignIn && (authLoading || loading);
  const isAdmin = stats?.role === 'admin';
  const firstName = user?.name?.split(' ')[0];

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar wide />

      <main className="mx-auto w-full max-w-[1600px] flex-grow px-5 pb-16 pt-4 lg:px-8 lg:pt-6">
        <PageBanner
          eyebrow={isAdmin ? 'Admin dashboard' : 'Dashboard'}
          title={showSignIn ? 'Your kitchen at a glance.' : `Welcome back${firstName ? `, ${firstName}` : ''}.`}
          description={
            isAdmin
              ? 'Store performance, customers and the latest orders.'
              : 'Your spending, pantry and deliveries in one place.'
          }
          image="/images/market-stall.jpg"
          imagePosition="center 60%"
        >
          {!showSignIn && !isAdmin && (
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/products"
                className="rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-forest transition-opacity hover:opacity-90"
              >
                Shop groceries
              </Link>
              <OpenAssistantButton className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-[#F6F7EF] transition-colors hover:border-white">
                Ask the assistant
              </OpenAssistantButton>
            </div>
          )}
          {isAdmin && (
            <Link
              href="/admin/products"
              className="rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-forest transition-opacity hover:opacity-90"
            >
              Manage products
            </Link>
          )}
        </PageBanner>

        {showSignIn ? (
          <SignInPrompt
            title="Log in to see your dashboard."
            description="Track spending, see what is expiring and manage deliveries from one place."
          />
        ) : isLoading ? (
          <DashboardSkeleton />
        ) : !stats ? (
          <div className="mt-10 rounded-[2rem] border border-dashed border-line px-6 py-16 text-center">
            <p className="text-xl font-extrabold tracking-tight text-ink">We could not load your dashboard.</p>
            <p className="mt-2 text-ink-muted">Please refresh the page in a moment.</p>
          </div>
        ) : isAdmin ? (
          <AdminView stats={stats} onSelectOrder={setSelectedOrder} />
        ) : (
          <UserView stats={stats} pantry={pantry} onSelectOrder={setSelectedOrder} />
        )}
      </main>

      {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </div>
  );
}

/* ---------------------------------- Views --------------------------------- */

function UserView({ stats, pantry, onSelectOrder }) {
  const withExpiry = pantry.map((item) => ({ item, expiry: getExpiryInfo(item) }));
  const expiredCount = withExpiry.filter((p) => p.expiry.status === 'expired').length;
  const useSoon = withExpiry
    .filter((p) => p.expiry.status !== 'expired')
    .sort((a, b) => a.expiry.daysLeft - b.expiry.daysLeft)
    .slice(0, 5);

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Total spent" value={money(stats.totalSpent)} note="across all orders" tone="lime" />
        <StatTile label="Subscription savings" value={money(stats.savings)} note="15% off every subscription delivery" />
        <StatTile
          label="Pantry"
          value={`${stats.pantryCount} items`}
          href="/pantry"
          cta="Open pantry"
        />
        <StatTile
          label="Next delivery"
          value={
            stats.subscriptionStatus === 'paused' ? 'Paused' : stats.nextDelivery ? shortDate(stats.nextDelivery) : 'None'
          }
          href="/subscription"
          cta={
            stats.subscriptionStatus === 'paused'
              ? 'Resume deliveries'
              : stats.nextDelivery
                ? 'Edit bundle'
                : 'Start a subscription'
          }
          tone="sky"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <Panel className="lg:col-span-8" eyebrow="Spending" title="Your recent orders">
          {stats.recentOrders.length === 0 ? (
            <p className="py-16 text-center text-ink-muted">Your orders will appear here after your first purchase.</p>
          ) : (
            <OrdersChart orders={stats.recentOrders} onSelect={onSelectOrder} />
          )}
        </Panel>

        <Panel
          className="lg:col-span-4"
          eyebrow="Pantry"
          title="Use these soon"
          action={
            <Link href="/pantry" className="text-sm font-semibold text-ink underline decoration-olive decoration-2 underline-offset-4 hover:decoration-ink">
              View all
            </Link>
          }
        >
          {useSoon.length === 0 ? (
            <p className="py-10 text-center text-sm text-ink-muted">
              {pantry.length === 0 ? 'Your pantry is empty. Items you buy land here.' : 'Nothing is close to expiring.'}
            </p>
          ) : (
            <ul className="-my-3 divide-y divide-line">
              {useSoon.map(({ item, expiry }) => (
                <li key={item._id} className="flex items-center gap-4 py-3">
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
                    {item.product?.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.product.imageUrl} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
                    <p className="text-xs text-ink-muted">Use by {shortDate(expiry.expiryDate)}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${expiry.classes.pill}`}>
                    {expiry.label}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {expiredCount > 0 && (
            <p className="mt-5 border-t border-line pt-4 text-sm text-danger">
              {expiredCount} {expiredCount === 1 ? 'item has' : 'items have'} already expired.
            </p>
          )}
        </Panel>
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group relative isolate flex min-h-[11rem] flex-col justify-end overflow-hidden rounded-[1.5rem] p-6 text-white"
          >
            <Image
              src={action.image}
              alt=""
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="-z-20 object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />
            <p className="text-xl font-bold tracking-tight">{action.title}</p>
            <p className="mt-0.5 text-sm text-white/80">{action.text}</p>
          </Link>
        ))}
      </div>

      {/* Recent purchases */}
      <Panel className="mt-6" eyebrow="History" title="Recent purchases">
        {stats.recentOrders.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-ink-muted">No purchases yet.</p>
            <Link
              href="/products"
              className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <ul className="-my-2 divide-y divide-line">
            {stats.recentOrders.map((order) => (
              <li key={order._id}>
                <button
                  type="button"
                  onClick={() => onSelectOrder(order)}
                  className="-mx-3 flex w-[calc(100%+1.5rem)] flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl px-3 py-4 text-left transition-colors hover:bg-surface-muted"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-ink">
                      Order #{order._id.slice(-6).toUpperCase()}
                      {order.source === 'subscription' && (
                        <span className="ml-2 rounded-full bg-sky px-2 py-0.5 text-xs font-bold text-forest">Subscription</span>
                      )}
                    </p>
                    <p className="text-sm text-ink-muted">
                      {longDate(order.createdAt)} &middot; {unitCount(order)} items
                    </p>
                  </div>
                  <StatusPill order={order} />
                  <span className="w-24 text-right text-lg font-extrabold tracking-tight text-ink tabular-nums">
                    {money(order.totalPrice)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}

function AdminView({ stats, onSelectOrder }) {
  // Top items across the recent orders we have
  const itemTotals = {};
  stats.recentOrders.forEach((order) =>
    order.orderItems.forEach((item) => {
      itemTotals[item.name] = (itemTotals[item.name] || 0) + itemQty(item);
    })
  );
  const topItems = Object.entries(itemTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const topMax = topItems[0]?.[1] || 1;

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Revenue collected" value={money(stats.totalRevenue)} note="paid on delivery" tone="lime" />
        <StatTile label="Orders" value={stats.totalOrders.toLocaleString()} note="all time" href="/admin/orders" cta="View orders" />
        <StatTile label="Customers" value={stats.totalUsers.toLocaleString()} note="registered accounts" />
        <StatTile label="Products" value={stats.totalProducts.toLocaleString()} note="in the catalog" href="/admin/products" cta="Manage" tone="sky" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <Panel className="lg:col-span-8" eyebrow="Revenue" title="Latest order values">
          {stats.recentOrders.length === 0 ? (
            <p className="py-16 text-center text-ink-muted">No orders yet.</p>
          ) : (
            <OrdersChart orders={stats.recentOrders} onSelect={onSelectOrder} />
          )}
        </Panel>

        <Panel className="lg:col-span-4" eyebrow="Products" title="Top items in recent orders">
          {topItems.length === 0 ? (
            <p className="py-10 text-center text-sm text-ink-muted">No items sold yet.</p>
          ) : (
            <ul className="space-y-4">
              {topItems.map(([name, qty]) => (
                <li key={name}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="truncate font-medium text-ink">{name}</span>
                    <span className="shrink-0 text-ink-muted tabular-nums">{qty} sold</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(qty / topMax) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <Panel
        className="mt-6"
        eyebrow="Orders"
        title="Recent orders"
        action={
          <Link href="/admin/orders" className="text-sm font-semibold text-ink underline decoration-olive decoration-2 underline-offset-4 hover:decoration-ink">
            View all
          </Link>
        }
      >
        <div className="-mx-6 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-[0.14em] text-accent">
                <th className="px-6 pb-3 font-semibold">Order</th>
                <th className="px-6 pb-3 font-semibold">Customer</th>
                <th className="px-6 pb-3 font-semibold">Date</th>
                <th className="px-6 pb-3 font-semibold">Status</th>
                <th className="px-6 pb-3 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {stats.recentOrders.map((order) => (
                <tr key={order._id} onClick={() => onSelectOrder(order)} className="cursor-pointer transition-colors hover:bg-surface-muted">
                  <td className="px-6 py-4 font-semibold text-ink">#{order._id.slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lime text-xs font-bold text-forest">
                        {order.user?.name?.charAt(0) || 'U'}
                      </span>
                      <span className="text-ink">{order.user?.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-ink-muted">{longDate(order.createdAt)}</td>
                  <td className="px-6 py-4">
                    <StatusPill order={order} />
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-ink tabular-nums">{money(order.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

/* ------------------------------- Components ------------------------------- */

function Panel({ eyebrow, title, action, className = '', children }) {
  return (
    <section className={`rounded-[1.75rem] border border-line bg-surface p-6 ${className}`}>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{eyebrow}</p>
          <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function StatusPill({ order }) {
  const delivered = order.isDelivered;
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
        delivered ? 'bg-success/12 text-success' : 'bg-warning/12 text-warning'
      }`}
    >
      {delivered ? 'Delivered' : 'Processing'}
    </span>
  );
}

// Round the axis maximum up to a clean number
function niceMax(value) {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * magnitude >= value);
  return step * magnitude;
}

/** Single-series bar chart of order totals, oldest to newest. Hover a column for details, click to open. */
function OrdersChart({ orders, onSelect }) {
  const data = [...orders].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const max = niceMax(Math.max(...data.map((o) => o.totalPrice)));
  const ticks = [max, max / 2, 0];
  const latestId = data[data.length - 1]._id;

  return (
    <figure>
      <div className="relative h-60 pl-14">
        {/* Grid + y labels */}
        {ticks.map((tick) => (
          <div
            key={tick}
            className="absolute inset-x-0 flex items-center gap-3"
            style={{ bottom: `${(tick / max) * 100}%`, transform: 'translateY(50%)' }}
          >
            <span className="w-11 text-right text-xs text-ink-muted tabular-nums">{money(tick)}</span>
            <span className={`h-px flex-1 ${tick === 0 ? 'bg-line' : 'bg-line/60'}`} />
          </div>
        ))}

        {/* Bars */}
        <div className="relative flex h-full items-end gap-[2px]">
          {data.map((order) => {
            const height = (order.totalPrice / max) * 100;
            const isLatest = order._id === latestId;
            return (
              <button
                key={order._id}
                type="button"
                onClick={() => onSelect(order)}
                aria-label={`Order on ${longDate(order.createdAt)}, ${money(order.totalPrice)}`}
                className="group relative flex h-full flex-1 items-end justify-center rounded-lg outline-none transition-colors hover:bg-surface-muted/60 focus-visible:bg-surface-muted/60"
              >
                <span
                  className="relative w-full max-w-12 rounded-t-[4px] bg-primary transition-opacity group-hover:opacity-85"
                  style={{ height: `${Math.max(height, 1)}%` }}
                >
                  {isLatest && (
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold text-ink tabular-nums group-hover:opacity-0">
                      {money(order.totalPrice)}
                    </span>
                  )}
                </span>

                {/* Tooltip */}
                <span
                  role="tooltip"
                  className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-xl border border-line bg-surface px-3 py-2 text-left text-xs opacity-0 shadow-lg shadow-black/10 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                  style={{ bottom: `calc(${Math.max(height, 1)}% + 8px)` }}
                >
                  <span className="block font-semibold text-ink tabular-nums">{money(order.totalPrice)}</span>
                  <span className="block text-ink-muted">
                    {longDate(order.createdAt)} &middot; {unitCount(order)} items
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* x labels */}
      <div className="mt-3 flex gap-[2px] pl-14">
        {data.map((order) => (
          <span key={order._id} className="flex-1 text-center text-xs text-ink-muted">
            {shortDate(order.createdAt)}
          </span>
        ))}
      </div>

      <figcaption className="mt-4 text-xs text-ink-muted">Order totals for your {data.length} most recent orders. Select a bar for details.</figcaption>

      {/* Table view for assistive tech */}
      <table className="sr-only">
        <caption>Recent order totals</caption>
        <thead>
          <tr>
            <th>Date</th>
            <th>Items</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((order) => (
            <tr key={order._id}>
              <td>{longDate(order.createdAt)}</td>
              <td>{unitCount(order)}</td>
              <td>{money(order.totalPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

function DashboardSkeleton() {
  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-36 animate-pulse rounded-[1.5rem] bg-surface-muted" />
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="h-80 animate-pulse rounded-[1.75rem] bg-surface-muted lg:col-span-8" />
        <div className="h-80 animate-pulse rounded-[1.75rem] bg-surface-muted lg:col-span-4" />
      </div>
    </>
  );
}

function OrderDetailModal({ order, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const facts = [
    { label: 'Date', value: longDate(order.createdAt) },
    { label: 'Status', value: order.isDelivered ? 'Delivered' : 'Processing' },
    { label: 'Payment', value: order.isPaid ? 'Paid' : 'Cash due' },
  ];
  // Orders placed before the price breakdown was stored only have a total
  const subtotal = order.subtotal || order.orderItems.reduce((sum, item) => sum + itemQty(item) * item.price, 0);
  const breakdown = [
    { label: 'Subtotal', value: money(subtotal) },
    ...(order.discount ? [{ label: 'Subscription discount', value: `−${money(order.discount)}`, success: true }] : []),
    ...(order.subtotal ? [{ label: 'Delivery', value: order.deliveryFee ? money(order.deliveryFee) : 'Free' }] : []),
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Order details">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />

      <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-[2rem] bg-surface shadow-2xl animate-fade-in-up">
        <div className="flex items-start justify-between gap-4 bg-primary px-6 py-5 text-on-primary sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-70">
              {order.source === 'subscription' ? 'Subscription delivery' : 'Order details'}
            </p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight">#{order._id.slice(-6).toUpperCase()}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-on-primary/15"
          >
            Close
          </button>
        </div>

        <div className="overflow-y-auto p-6 sm:p-8">
          <dl className="grid grid-cols-3 divide-x divide-line rounded-2xl border border-line">
            {facts.map((fact) => (
              <div key={fact.label} className="px-4 py-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{fact.label}</dt>
                <dd className="mt-1 text-sm font-bold text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-8 text-sm font-bold text-ink">Items</h3>
          <ul className="mt-3 divide-y divide-line">
            {order.orderItems.map((item, idx) => (
              <li key={idx} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{item.name}</p>
                  <p className="text-sm text-ink-muted tabular-nums">
                    {itemQty(item)} &times; {money(item.price)}
                  </p>
                </div>
                <p className="shrink-0 font-bold text-ink tabular-nums">{money(itemQty(item) * item.price)}</p>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
            {breakdown.map((row) => (
              <div key={row.label} className={`flex justify-between ${row.success ? 'text-success' : 'text-ink-muted'}`}>
                <dt>{row.label}</dt>
                <dd className="tabular-nums">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-3 flex items-baseline justify-between border-t border-line pt-3">
            <span className="font-bold text-ink">Total</span>
            <span className="text-2xl font-extrabold tracking-tight text-ink tabular-nums">{money(order.totalPrice)}</span>
          </div>

          {(order.shippingAddress?.address || order.paymentMethod) && (
            <p className="mt-6 rounded-2xl bg-surface-muted px-4 py-3 text-sm text-ink-muted">
              {order.paymentMethod || 'Cash on Delivery'}
              {order.shippingAddress?.address && (
                <>
                  {' '}&middot; {order.shippingAddress.address}, {order.shippingAddress.city}
                </>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
