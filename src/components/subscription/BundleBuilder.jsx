'use client';

import { SUBSCRIPTION_DISCOUNT } from '@/utils/pricing';

const PLACEHOLDER = 'https://placehold.co/120x120/EDF0DC/5A6558?text=Item';

/**
 * Controlled bundle editor. The parent owns `items`; edits go through `onChange`,
 * and `onSave` persists them.
 */
export default function BundleBuilder({
  items,
  onChange,
  onSave,
  saving,
  dirty,
  frequency,
  nextDelivery,
  status = 'active',
  canManage = false,
  onSkip,
  onStatusChange,
}) {
  const updateQuantity = (id, change) => {
    onChange(
      items
        .map((item) => (item._id === id ? { ...item, quantity: item.quantity + change } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => onChange(items.filter((item) => item._id !== id));

  const unitCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = Math.round(subtotal * SUBSCRIPTION_DISCOUNT);
  const total = subtotal - discount;

  const paused = canManage && status === 'paused';
  const nextDeliveryLabel = paused
    ? 'Paused'
    : canManage && nextDelivery
      ? new Date(nextDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Scheduled when you save';

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-line bg-surface">
      {/* Header */}
      <div className="bg-primary px-6 py-5 text-on-primary">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-70">Your bundle</p>
        <div className="mt-2 flex items-end justify-between gap-4">
          <p className="text-2xl font-extrabold tracking-tight">
            {items.length === 0 ? 'Empty' : `${unitCount} ${unitCount === 1 ? 'item' : 'items'}`}
          </p>
          <p className="text-sm opacity-80">{frequency}</p>
        </div>
        <p className="mt-1 text-sm opacity-70">Next delivery: {nextDeliveryLabel}</p>
      </div>

      {canManage && (
        <div className="flex border-b border-line text-sm">
          <button
            type="button"
            onClick={onSkip}
            disabled={paused}
            className="flex-1 py-3 font-semibold text-ink transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            Skip next delivery
          </button>
          <button
            type="button"
            onClick={() => onStatusChange(paused ? 'active' : 'paused')}
            className="flex-1 border-l border-line py-3 font-semibold text-ink transition-colors hover:bg-surface-muted"
          >
            {paused ? 'Resume deliveries' : 'Pause deliveries'}
          </button>
        </div>
      )}

      <div className="p-6">
        {items.length === 0 ? (
          <div className="py-8 text-center">
            <p className="font-bold text-ink">Nothing here yet</p>
            <p className="mx-auto mt-2 max-w-xs text-sm text-ink-muted">
              Add the essentials you buy every time. They will arrive on your schedule.
            </p>
          </div>
        ) : (
          <>
            <ul className="-my-3 divide-y divide-line">
              {items.map((item) => (
                <li key={item._id} className="flex items-center gap-4 py-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imageUrl || PLACEHOLDER} alt={item.name} className="h-full w-full object-cover" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
                    <p className="text-xs text-ink-muted tabular-nums">
                      ৳{item.price} each &middot; ৳{item.price * item.quantity}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item._id)}
                      className="mt-1 text-xs font-medium text-ink-muted underline-offset-2 hover:text-danger hover:underline"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="flex shrink-0 items-center rounded-full border border-line">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item._id, -1)}
                      aria-label={`Decrease ${item.name}`}
                      className="h-8 w-8 rounded-full text-lg leading-none text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
                    >
                      &minus;
                    </button>
                    <span className="min-w-6 text-center text-sm font-bold text-ink tabular-nums">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item._id, 1)}
                      aria-label={`Increase ${item.name}`}
                      className="h-8 w-8 rounded-full text-lg leading-none text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Totals */}
            <dl className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
              <div className="flex justify-between text-ink-muted">
                <dt>Subtotal</dt>
                <dd className="tabular-nums">৳{subtotal}</dd>
              </div>
              <div className="flex justify-between text-success">
                <dt>Subscription discount ({Math.round(SUBSCRIPTION_DISCOUNT * 100)}%)</dt>
                <dd className="tabular-nums">&minus;৳{discount}</dd>
              </div>
              <div className="flex justify-between text-success">
                <dt>Delivery</dt>
                <dd>Free</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-line pt-3">
                <dt className="font-bold text-ink">Per delivery</dt>
                <dd className="text-2xl font-extrabold tracking-tight text-ink tabular-nums">৳{total}</dd>
              </div>
            </dl>
          </>
        )}

        <button
          type="button"
          onClick={() => onSave(items)}
          disabled={saving || !dirty}
          className="mt-6 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? 'Saving...' : dirty ? 'Save changes' : 'Saved'}
        </button>
        <p className="mt-3 text-center text-xs text-ink-muted">
          {dirty
            ? 'You have unsaved changes.'
            : 'Paid cash on delivery. Prices follow the shop, so totals can change if prices do.'}
        </p>
      </div>
    </div>
  );
}
