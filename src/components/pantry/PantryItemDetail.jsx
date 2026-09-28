'use client';
import { useEffect, useState } from 'react';
import { getExpiryInfo } from '@/utils/calculateExpiry';
import OpenAssistantButton from '@/components/ai/OpenAssistantButton';

const PLACEHOLDER = 'https://placehold.co/800x500/EDF0DC/5A6558?text=PantryPal';

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function PantryItemDetail({ item, onClose, onConsume, onRemove }) {
  const [busy, setBusy] = useState(false);
  // Close on Escape
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!item) return null;

  const expiry = getExpiryInfo(item);
  const units = item.quantity ?? 1;
  const unitPrice = item.price ?? item.product?.price ?? 0;
  const facts = [
    { label: 'Bought', value: formatDate(item.purchaseDate) },
    { label: 'Use by', value: formatDate(expiry.expiryDate) },
    { label: 'Left', value: `${units} × ৳${unitPrice}` },
  ];

  const run = (action) => async () => {
    setBusy(true);
    await action();
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={item.name}>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
      />

      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[2rem] bg-surface shadow-2xl animate-fade-in-up">
        {/* Photo header */}
        <div className="relative h-60 overflow-hidden bg-surface-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.product?.imageUrl || PLACEHOLDER} alt={item.name} className="h-full w-full object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-surface/90 px-4 py-2 text-xs font-semibold text-ink backdrop-blur transition-colors hover:bg-surface"
          >
            Close
          </button>
          <div className="absolute inset-x-6 bottom-5 text-white">
            <span className={`inline-block rounded-full bg-surface px-3 py-1 text-xs font-bold ${expiry.classes.text}`}>
              {expiry.label}
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight">{item.name}</h2>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {/* Facts */}
          <dl className="grid grid-cols-3 divide-x divide-line rounded-2xl border border-line">
            {facts.map((fact) => (
              <div key={fact.label} className="px-4 py-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{fact.label}</dt>
                <dd className="mt-1 text-sm font-bold text-ink sm:text-base">{fact.value}</dd>
              </div>
            ))}
          </dl>

          {/* Freshness */}
          <div className="mt-6">
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-semibold text-ink">Freshness</p>
              <p className={`text-sm font-bold tabular-nums ${expiry.classes.text}`}>{Math.round(expiry.percent)}%</p>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-muted">
              <div
                className={`h-full rounded-full transition-all duration-700 ${expiry.classes.bar}`}
                style={{ width: `${expiry.percent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-ink-muted">Based on a {item.shelfLifeDays}-day shelf life from the purchase date.</p>
          </div>

          {/* Use it up */}
          <div className="mt-6 rounded-2xl bg-lime p-5 text-forest">
            <p className="text-sm font-bold">Not sure what to cook?</p>
            <p className="mt-1 text-sm opacity-80">
              Ask the assistant for a quick recipe that uses your {item.name.toLowerCase()} before it goes off.
            </p>
            <OpenAssistantButton
              message={`Suggest a quick recipe using ${item.name}`}
              className="mt-4 rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-[#F6F7EF] transition-opacity hover:opacity-90"
            >
              Ask for recipe ideas
            </OpenAssistantButton>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3 border-t border-line pt-6">
            <button
              type="button"
              onClick={run(onConsume)}
              disabled={busy}
              className="flex-1 rounded-full bg-primary py-3.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
            >
              {units > 1 ? `Mark one as used (${units} left)` : 'Mark as used'}
            </button>
            <button
              type="button"
              onClick={run(onRemove)}
              disabled={busy}
              className="rounded-full border border-line px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-danger hover:text-danger disabled:opacity-60"
            >
              Remove from pantry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
