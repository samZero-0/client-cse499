'use client';
import { useState, useEffect, useContext, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Navbar from '@/components/common/Navbar';
import PageBanner from '@/components/common/PageBanner';
import SignInPrompt from '@/components/common/SignInPrompt';
import OpenAssistantButton from '@/components/ai/OpenAssistantButton';
import { OPEN_CHECKOUT_EVENT } from '@/components/ai/ChatBot';
import { useCart } from '@/context/CartContext';
import { AuthContext } from '@/context/AuthContext';
import useAxios from '@/hooks/useAxios';
import { deliveryFeeFor, FREE_DELIVERY_THRESHOLD, apiError } from '@/utils/pricing';

const PLACEHOLDER = 'https://placehold.co/200x200/EDF0DC/5A6558?text=Item';
const PAYMENT_METHOD = 'Cash on Delivery'; // The only method the server accepts

const inputClass =
  'w-full rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted transition-colors focus:border-olive focus:outline-none focus:ring-4 focus:ring-olive/15';
const labelClass = 'mb-1.5 block text-xs font-semibold text-ink';

function CartPageContent() {
  const { cartItems, removeFromCart, updateQuantity, fetchCart, total } = useCart();
  const { user, loading: authLoading, updateUser } = useContext(AuthContext);
  const searchParams = useSearchParams();
  // The assistant can send people here with ?openCheckout=true
  const [showCheckout, setShowCheckout] = useState(() => searchParams.get('openCheckout') === 'true');
  const [isProcessing, setIsProcessing] = useState(false);
  const [saveInfo, setSaveInfo] = useState(false);
  // Only fields the user has typed; everything else falls back to their profile
  const [edits, setEdits] = useState({});
  const axios = useAxios();
  const router = useRouter();

  // The assistant can also open checkout while this page is already showing
  useEffect(() => {
    const open = () => setShowCheckout(true);
    window.addEventListener(OPEN_CHECKOUT_EVENT, open);
    return () => window.removeEventListener(OPEN_CHECKOUT_EVENT, open);
  }, []);

  // Drop the ?openCheckout flag from the URL without a reload
  useEffect(() => {
    if (searchParams.get('openCheckout') === 'true') window.history.replaceState(null, '', '/cart');
  }, [searchParams]);

  const customerInfo = {
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    ...edits,
  };
  const setField = (field) => (e) => setEdits((prev) => ({ ...prev, [field]: e.target.value }));

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryFee = deliveryFeeFor(total);
  const finalTotal = total + deliveryFee;
  const toFreeDelivery = FREE_DELIVERY_THRESHOLD - total;

  const handleQuantityChange = (cartItemId, change, currentQty) => {
    updateQuantity(cartItemId, Math.max(1, currentQty + change));
  };

  const handleRemove = async (item) => {
    if (await removeFromCart(item._id)) toast.success(`${item.name} removed`);
  };

  const handleConfirmCheckout = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address || !customerInfo.city) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);
    try {
      // The server prices the order from the catalog; only products and quantities are sent
      const orderData = {
        orderItems: cartItems.map((item) => ({ product: item.productId, qty: item.quantity })),
        shippingAddress: { address: customerInfo.address, city: customerInfo.city },
        paymentMethod: PAYMENT_METHOD,
        customerInfo: { name: customerInfo.name, phone: customerInfo.phone, email: customerInfo.email },
      };

      const { data: order } = await axios.post('/orders', orderData);

      // Save details so the next checkout (and the assistant) can reuse them
      if (saveInfo) {
        try {
          await updateUser({
            name: customerInfo.name,
            phone: customerInfo.phone,
            address: customerInfo.address,
            city: customerInfo.city,
          });
        } catch (err) {
          toast.error(apiError(err, 'Order placed, but your details could not be saved'));
        }
      }

      toast.success(`Order placed. ৳${order.totalPrice}, cash on delivery.`);
      setShowCheckout(false);
      await fetchCart(); // The server empties the cart once the order exists
      setTimeout(() => router.push('/dashboard'), 1200);
    } catch (error) {
      toast.error(apiError(error, 'Checkout failed. Please try again.'));
      await fetchCart(); // Stock or prices may have changed
    } finally {
      setIsProcessing(false);
    }
  };

  const showSignIn = !authLoading && !user;

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar wide />

      <main className="mx-auto w-full max-w-[1600px] flex-grow px-5 pb-16 pt-4 lg:px-8 lg:pt-6">
        <PageBanner
          eyebrow="Your cart"
          title={cartItems.length > 0 ? 'Ready when you are.' : 'Your cart is waiting.'}
          description={
            cartItems.length > 0
              ? `${itemCount} ${itemCount === 1 ? 'item' : 'items'} ready for checkout. Pay cash when it arrives.`
              : 'Add a few essentials and check out in a couple of taps.'
          }
          image="/images/auth-login.jpg"
          imagePosition="center 40%"
        />

        {showSignIn ? (
          <SignInPrompt title="Log in to see your cart." description="Your cart is saved to your account, so it follows you across devices." />
        ) : cartItems.length === 0 ? (
          <div className="mt-6 rounded-[2rem] border border-dashed border-line px-6 py-20 text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-ink">Nothing in your cart yet.</h2>
            <p className="mx-auto mt-3 max-w-sm text-ink-muted">
              Browse fresh produce and everyday staples, or ask the assistant to fill it for you.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              <Link
                href="/products"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
              >
                Start shopping
              </Link>
              <OpenAssistantButton
                message="Add milk, eggs and bread to my cart"
                className="text-sm font-semibold text-ink underline decoration-olive decoration-2 underline-offset-8 hover:decoration-ink"
              >
                Ask the assistant
              </OpenAssistantButton>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-12 xl:gap-8">
            {/* Items */}
            <section className="rounded-[1.75rem] border border-line bg-surface p-6 lg:col-span-8">
              <div className="flex items-end justify-between gap-4 border-b border-line pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Items</p>
                  <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
                  </h2>
                </div>
                <Link
                  href="/products"
                  className="text-sm font-semibold text-ink underline decoration-olive decoration-2 underline-offset-4 hover:decoration-ink"
                >
                  Keep shopping
                </Link>
              </div>

              <ul className="divide-y divide-line">
                {cartItems.map((item) => (
                  <li key={item._id} className="flex flex-wrap items-center gap-x-5 gap-y-3 py-5 sm:flex-nowrap">
                    <Link
                      href={`/products/${item.productId}`}
                      className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-surface-muted"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl || item.image || PLACEHOLDER}
                        alt={item.name}
                        onError={(e) => {
                          if (e.currentTarget.src !== PLACEHOLDER) e.currentTarget.src = PLACEHOLDER;
                        }}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link href={`/products/${item.productId}`} className="font-semibold text-ink hover:text-accent">
                        {item.name}
                      </Link>
                      <p className="mt-0.5 text-sm text-ink-muted tabular-nums">
                        ৳{item.price} each
                        {item.quantity >= item.stock && <span className="ml-2 text-warning">Max available</span>}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemove(item)}
                        className="mt-1 text-xs font-medium text-ink-muted underline-offset-2 hover:text-danger hover:underline"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="flex items-center rounded-full border border-line">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item._id, -1, item.quantity)}
                        disabled={item.quantity <= 1}
                        aria-label={`Decrease ${item.name}`}
                        className="h-9 w-9 rounded-full text-lg text-ink-muted transition-colors hover:text-ink disabled:opacity-40"
                      >
                        &minus;
                      </button>
                      <span className="min-w-7 text-center text-sm font-bold text-ink tabular-nums">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item._id, 1, item.quantity)}
                        disabled={item.quantity >= item.stock}
                        aria-label={`Increase ${item.name}`}
                        className="h-9 w-9 rounded-full text-lg text-ink-muted transition-colors hover:text-ink disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <p className="w-24 text-right text-lg font-extrabold tracking-tight text-ink tabular-nums">
                      ৳{item.price * item.quantity}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Summary */}
            <aside className="space-y-6 lg:col-span-4">
              <div className="rounded-[1.75rem] border border-line bg-surface p-6 lg:sticky lg:top-24">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Summary</p>
                <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink">Order total</h2>

                <dl className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between text-ink-muted">
                    <dt>Subtotal ({itemCount} items)</dt>
                    <dd className="tabular-nums">৳{total}</dd>
                  </div>
                  <div className="flex justify-between text-ink-muted">
                    <dt>Delivery</dt>
                    <dd className="tabular-nums">{deliveryFee === 0 ? 'Free' : `৳${deliveryFee}`}</dd>
                  </div>
                  {toFreeDelivery > 0 && (
                    <p className="rounded-xl bg-surface-muted px-3 py-2 text-xs text-ink-muted">
                      Add <span className="font-semibold text-ink tabular-nums">৳{toFreeDelivery}</span> more for free delivery.
                    </p>
                  )}
                  <div className="flex items-baseline justify-between border-t border-line pt-4">
                    <dt className="font-bold text-ink">Total</dt>
                    <dd className="text-3xl font-extrabold tracking-tight text-ink tabular-nums">৳{finalTotal}</dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={() => setShowCheckout(true)}
                  className="mt-6 w-full rounded-full bg-primary py-4 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
                >
                  Checkout
                </button>
                <p className="mt-3 text-center text-xs text-ink-muted">
                  Cash on delivery. Free delivery on orders over ৳{FREE_DELIVERY_THRESHOLD}.
                </p>
              </div>

              <div className="relative isolate overflow-hidden rounded-[1.75rem] p-6 text-[#F6F7EF]">
                <Image
                  src="/images/feature-subscription.jpg"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 400px, 100vw"
                  className="-z-20 object-cover"
                />
                <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[#1B241E]/95 via-[#1B241E]/75 to-[#1B241E]/40" />
                <p className="pt-10 text-xs font-semibold uppercase tracking-[0.16em] text-lime">Buying these often?</p>
                <p className="mt-2 text-lg font-bold leading-snug">Turn them into a subscription and save 15% on every delivery.</p>
                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Link
                    href="/subscription"
                    className="rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-forest transition-opacity hover:opacity-90"
                  >
                    Build a bundle
                  </Link>
                  <OpenAssistantButton
                    message="Turn my cart into a weekly subscription"
                    className="text-sm font-semibold underline decoration-lime/60 decoration-2 underline-offset-4 hover:decoration-lime"
                  >
                    Ask the assistant
                  </OpenAssistantButton>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      {showCheckout && !showSignIn && cartItems.length > 0 && (
        <CheckoutModal
          info={customerInfo}
          setField={setField}
          saveInfo={saveInfo}
          setSaveInfo={setSaveInfo}
          itemCount={itemCount}
          total={finalTotal}
          processing={isProcessing}
          onConfirm={handleConfirmCheckout}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
}

function CheckoutModal({ info, setField, saveInfo, setSaveInfo, itemCount, total, processing, onConfirm, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Checkout">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />

      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] bg-surface shadow-2xl animate-fade-in-up">
        <div className="flex items-start justify-between gap-4 bg-primary px-6 py-5 text-on-primary sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-70">Checkout</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight">Where should we deliver?</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-on-primary/15">
            Close
          </button>
        </div>

        <div className="space-y-8 overflow-y-auto p-6 sm:p-8">
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Contact</legend>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="co-name" className={labelClass}>
                  Full name <span className="text-danger">*</span>
                </label>
                <input id="co-name" type="text" autoComplete="name" value={info.name} onChange={setField('name')} className={inputClass} />
              </div>
              <div>
                <label htmlFor="co-phone" className={labelClass}>
                  Phone <span className="text-danger">*</span>
                </label>
                <input id="co-phone" type="tel" autoComplete="tel" placeholder="017..." value={info.phone} onChange={setField('phone')} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="co-email" className={labelClass}>
                  Email
                </label>
                <input id="co-email" type="email" autoComplete="email" value={info.email} onChange={setField('email')} className={inputClass} />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Delivery</legend>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label htmlFor="co-address" className={labelClass}>
                  Address <span className="text-danger">*</span>
                </label>
                <input
                  id="co-address"
                  type="text"
                  autoComplete="street-address"
                  placeholder="House, road, area"
                  value={info.address}
                  onChange={setField('address')}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="co-city" className={labelClass}>
                  City <span className="text-danger">*</span>
                </label>
                <input id="co-city" type="text" autoComplete="address-level2" value={info.city} onChange={setField('city')} className={inputClass} />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Payment</legend>
            <div className="mt-4 rounded-2xl border border-primary bg-surface-muted p-4">
              <p className="text-sm font-semibold text-ink">Cash on delivery</p>
              <p className="text-xs text-ink-muted">Pay the courier when your groceries arrive.</p>
            </div>
          </fieldset>

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-lime p-4 text-forest">
            <input
              type="checkbox"
              checked={saveInfo}
              onChange={(e) => setSaveInfo(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#37493D]"
            />
            <span className="text-sm">
              <span className="font-bold">Save these details</span>
              <span className="block opacity-80">Saved to your profile so checkout is filled in next time.</span>
            </span>
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line px-6 py-5 sm:px-8">
          <p className="text-sm text-ink-muted">
            {itemCount} items &middot; <span className="font-bold text-ink tabular-nums">৳{total}</span> incl. delivery
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={processing}
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
            >
              {processing ? 'Placing order...' : 'Place order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<div className="p-6 text-ink-muted">Loading cart...</div>}>
      <CartPageContent />
    </Suspense>
  );
}
