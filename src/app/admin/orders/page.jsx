'use client';
import { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import Navbar from '@/components/common/Navbar';
import PageBanner from '@/components/common/PageBanner';
import SignInPrompt from '@/components/common/SignInPrompt';
import useAxios from '@/hooks/useAxios';
import { AuthContext } from '@/context/AuthContext';
import { apiError } from '@/utils/pricing';

const filters = [
  { value: 'all', label: 'All' },
  { value: 'processing', label: 'Processing' },
  { value: 'delivered', label: 'Delivered' },
];

const longDate = (date) =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const money = (value) => `৳${Number(value || 0).toLocaleString()}`;

export default function AdminOrders() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState(null);
  const axios = useAxios();

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    axios
      .get('/orders')
      .then(({ data }) => !cancelled && setOrders(data))
      .catch((error) => toast.error(apiError(error, 'Could not load orders')))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  const markDelivered = async (order) => {
    setUpdating(order._id);
    try {
      const { data } = await axios.put(`/orders/${order._id}/deliver`);
      setOrders((prev) => prev.map((o) => (o._id === data._id ? data : o)));
      toast.success(`Order #${order._id.slice(-6).toUpperCase()} delivered and paid`);
    } catch (error) {
      toast.error(apiError(error, 'Could not update the order'));
    } finally {
      setUpdating(null);
    }
  };

  const counts = {
    all: orders.length,
    processing: orders.filter((o) => !o.isDelivered).length,
    delivered: orders.filter((o) => o.isDelivered).length,
  };
  const visible = orders.filter(
    (o) => filter === 'all' || (filter === 'delivered' ? o.isDelivered : !o.isDelivered)
  );
  const outstanding = orders.filter((o) => !o.isPaid).reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar wide />
      <main className="mx-auto w-full max-w-[1600px] flex-grow px-5 pb-16 pt-4 lg:px-8 lg:pt-6">
        <PageBanner
          eyebrow="Admin"
          title="Customer orders."
          description="Every order, newest first. Marking an order delivered also records the cash collected."
          image="/images/shop-hero.jpg"
        />

        {!authLoading && !user ? (
          <SignInPrompt title="Log in as an admin." description="Order management is only available to administrators." />
        ) : !authLoading && !isAdmin ? (
          <div className="mt-6 rounded-[2rem] border border-dashed border-line px-6 py-16 text-center">
            <p className="text-xl font-extrabold tracking-tight text-ink">Admins only</p>
            <p className="mt-2 text-ink-muted">Your account does not have access to order management.</p>
          </div>
        ) : (
          <>
            <div className="mt-6 flex flex-col gap-4 border-b border-line pb-5 md:flex-row md:items-center md:justify-between">
              <div role="group" aria-label="Filter orders" className="flex gap-2">
                {filters.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setFilter(f.value)}
                    aria-pressed={filter === f.value}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      filter === f.value
                        ? 'border-primary bg-primary text-on-primary'
                        : 'border-line bg-surface text-ink-muted hover:text-ink'
                    }`}
                  >
                    {f.label}
                    <span className="ml-2 tabular-nums opacity-60">{loading ? '' : counts[f.value]}</span>
                  </button>
                ))}
              </div>
              <p className="text-sm text-ink-muted">
                Cash still to collect: <span className="font-bold text-ink tabular-nums">{money(outstanding)}</span>
              </p>
            </div>

            <section className="mt-6 overflow-hidden rounded-[1.75rem] border border-line bg-surface">
              {loading ? (
                <div className="space-y-3 p-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-12 animate-pulse rounded-2xl bg-surface-muted" />
                  ))}
                </div>
              ) : visible.length === 0 ? (
                <p className="px-6 py-16 text-center text-ink-muted">No orders here.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-line text-xs uppercase tracking-[0.14em] text-accent">
                        <th className="px-6 py-4 font-semibold">Order</th>
                        <th className="px-6 py-4 font-semibold">Customer</th>
                        <th className="px-6 py-4 font-semibold">Deliver to</th>
                        <th className="px-6 py-4 font-semibold">Items</th>
                        <th className="px-6 py-4 text-right font-semibold">Total</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {visible.map((order) => (
                        <tr key={order._id} className="align-top">
                          <td className="px-6 py-4">
                            <p className="font-semibold text-ink">#{order._id.slice(-6).toUpperCase()}</p>
                            <p className="text-xs text-ink-muted">{longDate(order.createdAt)}</p>
                            {order.source === 'subscription' && (
                              <span className="mt-1 inline-block rounded-full bg-sky px-2 py-0.5 text-xs font-bold text-forest">
                                Subscription
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-ink">{order.customerInfo?.name || order.user?.name || 'Unknown'}</p>
                            <p className="text-xs text-ink-muted">{order.customerInfo?.phone || order.user?.email}</p>
                          </td>
                          <td className="px-6 py-4 text-ink-muted">
                            {order.shippingAddress?.address
                              ? `${order.shippingAddress.address}, ${order.shippingAddress.city}`
                              : 'No address on file'}
                          </td>
                          <td className="px-6 py-4 text-ink-muted">
                            {order.orderItems.map((item) => `${item.qty} × ${item.name}`).join(', ')}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="font-bold text-ink tabular-nums">{money(order.totalPrice)}</p>
                            <p className="text-xs text-ink-muted">{order.isPaid ? 'Paid' : 'Cash due'}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                                order.isDelivered ? 'bg-success/12 text-success' : 'bg-warning/12 text-warning'
                              }`}
                            >
                              {order.isDelivered ? `Delivered ${longDate(order.deliveredAt || order.updatedAt)}` : 'Processing'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {!order.isDelivered && (
                              <button
                                type="button"
                                onClick={() => markDelivered(order)}
                                disabled={updating === order._id}
                                className="whitespace-nowrap rounded-full bg-primary px-4 py-2 text-xs font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
                              >
                                {updating === order._id ? 'Saving...' : 'Mark delivered'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
