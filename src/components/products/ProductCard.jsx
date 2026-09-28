'use client';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useCart } from '@/context/CartContext';

const PLACEHOLDER = 'https://placehold.co/600x600/EDF0DC/5A6558?text=PantryPal';

// Swap in the placeholder if a product image URL is broken
const handleImageError = (e) => {
  if (e.currentTarget.src !== PLACEHOLDER) e.currentTarget.src = PLACEHOLDER;
};

function stockInfo(stock) {
  if (stock > 10) return { status: 'in-stock', label: 'In stock', className: 'text-ink-muted' };
  if (stock > 0) return { status: 'low-stock', label: `Only ${stock} left`, className: 'text-[#B06A2B] dark:text-[#E0A96D]' };
  return { status: 'out-of-stock', label: 'Out of stock', className: 'text-[#B4543A] dark:text-[#E08A74]' };
}

function Badges({ discount, isNew }) {
  if (!discount && !isNew) return null;
  return (
    <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
      {discount > 0 && (
        <span className="rounded-full bg-lime px-2.5 py-1 text-xs font-bold text-forest">{discount}% off</span>
      )}
      {isNew && (
        <span className="rounded-full bg-sky px-2.5 py-1 text-xs font-bold text-forest">New</span>
      )}
    </div>
  );
}

export default function ProductCard({ product, viewMode = 'grid' }) {
  const { addToCart } = useCart();

  const stock = stockInfo(product.stock);
  const soldOut = stock.status === 'out-of-stock';
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const href = `/products/${product._id}`;

  const addButton = (
    <button
      type="button"
      onClick={async () => {
        if (await addToCart(product)) toast.success(`${product.name} added to cart`);
      }}
      disabled={soldOut}
      className="shrink-0 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-muted"
    >
      {soldOut ? 'Sold out' : 'Add to cart'}
    </button>
  );

  const price = (
    <div className="flex items-baseline gap-2">
      <span className="text-xl font-extrabold tracking-tight text-ink tabular-nums">৳{product.price}</span>
      {discount > 0 && (
        <span className="text-sm text-ink-muted line-through tabular-nums">৳{product.originalPrice}</span>
      )}
    </div>
  );

  if (viewMode === 'list') {
    return (
      <article className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-line bg-surface transition-shadow duration-300 hover:shadow-xl hover:shadow-black/5 sm:flex-row">
        <Link href={href} className="relative block aspect-[4/3] shrink-0 overflow-hidden bg-surface-muted sm:aspect-auto sm:w-56">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl || PLACEHOLDER}
            alt={product.name}
            onError={handleImageError}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <Badges discount={discount} isNew={product.isNew} />
        </Link>

        <div className="flex flex-1 flex-col justify-between gap-5 p-6">
          <div>
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{product.category}</p>
              <p className={`text-xs font-medium ${stock.className}`}>{stock.label}</p>
            </div>
            <Link href={href}>
              <h3 className="mt-2 text-xl font-bold tracking-tight text-ink transition-colors hover:text-accent">
                {product.name}
              </h3>
            </Link>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-muted">{product.description}</p>
          </div>
          <div className="flex items-center justify-between gap-4">
            {price}
            {addButton}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5">
      <Link href={href} className="relative block aspect-square overflow-hidden bg-surface-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl || PLACEHOLDER}
          alt={product.name}
          onError={handleImageError}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <Badges discount={discount} isNew={product.isNew} />
        {stock.status !== 'in-stock' && (
          <span className="absolute bottom-3 left-3 rounded-full bg-surface/90 px-2.5 py-1 text-xs font-semibold text-ink backdrop-blur">
            {stock.label}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{product.category}</p>
        <Link href={href}>
          <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-snug tracking-tight text-ink transition-colors hover:text-accent">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-muted">{product.description}</p>

        <div className="mt-5 flex items-center justify-between gap-2">
          {price}
          {addButton}
        </div>
      </div>
    </article>
  );
}
