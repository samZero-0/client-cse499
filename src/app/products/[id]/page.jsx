'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import useAxios from '@/hooks/useAxios';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/common/Navbar';
import ProductCard from '@/components/products/ProductCard';
import OpenAssistantButton from '@/components/ai/OpenAssistantButton';

const PLACEHOLDER = 'https://placehold.co/800x800/EDF0DC/5A6558?text=PantryPal';

function stockInfo(stock) {
  if (stock > 10) return { label: 'In stock', className: 'bg-success/12 text-success' };
  if (stock > 0) return { label: `Only ${stock} left`, className: 'bg-warning/12 text-warning' };
  return { label: 'Out of stock', className: 'bg-danger/12 text-danger' };
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();
  const axios = useAxios();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: currentProduct } = await axios.get(`/products/${id}`);
        setProduct(currentProduct);
        setQuantity(1);

        // "More like this": same category, excluding this product
        const { data: allProducts } = await axios.get('/products');
        setRelatedProducts(
          allProducts.filter((p) => p.category === currentProduct.category && p._id !== currentProduct._id).slice(0, 4)
        );
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleAdd = async () => {
    setAdding(true);
    const ok = await addToCart(product, quantity);
    setAdding(false);
    if (ok) toast.success(`${quantity} × ${product.name} added to cart`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar wide />

      <main className="mx-auto w-full max-w-[1600px] flex-grow px-5 pb-16 pt-4 lg:px-8 lg:pt-6">
        {loading ? (
          <DetailSkeleton />
        ) : !product ? (
          <div className="mx-auto mt-10 max-w-xl rounded-[2rem] border border-dashed border-line px-6 py-20 text-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-ink">We could not find that product.</h1>
            <p className="mt-3 text-ink-muted">It may have been removed or the link is incorrect.</p>
            <Link
              href="/products"
              className="mt-8 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
            >
              Back to the shop
            </Link>
          </div>
        ) : (
          <ProductView
            product={product}
            quantity={quantity}
            setQuantity={setQuantity}
            adding={adding}
            onAdd={handleAdd}
          />
        )}

        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <div className="flex items-end justify-between gap-4 border-b border-line pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{product.category}</p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">More like this</h2>
              </div>
              <Link
                href="/products"
                className="text-sm font-semibold text-ink underline decoration-olive decoration-2 underline-offset-4 hover:decoration-ink"
              >
                View all products
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-5">
              {relatedProducts.map((related) => (
                <ProductCard key={related._id} product={related} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function ProductView({ product, quantity, setQuantity, adding, onAdd }) {
  const stock = stockInfo(product.stock);
  const soldOut = product.stock <= 0;
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const maxQty = Math.max(1, product.stock || 1);

  const details = [
    { label: 'Category', value: product.category },
    { label: 'Shelf life', value: product.shelfLifeDays ? `${product.shelfLifeDays} days` : 'Not specified' },
    { label: 'Availability', value: soldOut ? 'Out of stock' : `${product.stock} in stock` },
  ];

  return (
    <>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
        <Link href="/products" className="hover:text-ink">
          Shop
        </Link>
        <span aria-hidden="true">/</span>
        <span>{product.category}</span>
        <span aria-hidden="true">/</span>
        <span className="font-medium text-ink">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-surface-muted lg:sticky lg:top-24 lg:self-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl || PLACEHOLDER}
            alt={product.name}
            onError={(e) => {
              if (e.currentTarget.src !== PLACEHOLDER) e.currentTarget.src = PLACEHOLDER;
            }}
            className="h-full w-full object-cover animate-fade-in"
          />
          <div className="absolute left-5 top-5 flex flex-col items-start gap-2">
            {discount > 0 && (
              <span className="rounded-full bg-lime px-3 py-1.5 text-xs font-bold text-forest">{discount}% off</span>
            )}
            {product.isNew && (
              <span className="rounded-full bg-sky px-3 py-1.5 text-xs font-bold text-forest">New</span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col animate-fade-in-up">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{product.category}</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-ink sm:text-5xl">
            {product.name}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span className="text-4xl font-extrabold tracking-tight text-ink tabular-nums">৳{product.price}</span>
            {discount > 0 && (
              <span className="text-xl text-ink-muted line-through tabular-nums">৳{product.originalPrice}</span>
            )}
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${stock.className}`}>{stock.label}</span>
          </div>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
            {product.description || 'No description available for this product yet.'}
          </p>

          {/* Quantity + add */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-line bg-surface">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={soldOut || quantity <= 1}
                aria-label="Decrease quantity"
                className="h-12 w-12 rounded-full text-xl text-ink-muted transition-colors hover:text-ink disabled:opacity-40"
              >
                &minus;
              </button>
              <span className="min-w-8 text-center font-bold text-ink tabular-nums" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                disabled={soldOut || quantity >= maxQty}
                aria-label="Increase quantity"
                className="h-12 w-12 rounded-full text-xl text-ink-muted transition-colors hover:text-ink disabled:opacity-40"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={onAdd}
              disabled={soldOut || adding}
              className="flex-1 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
              {soldOut ? 'Sold out' : adding ? 'Adding...' : `Add to cart · ৳${product.price * quantity}`}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <OpenAssistantButton
              message={`Tell me about ${product.name} and what I can cook with it`}
              className="font-semibold text-ink underline decoration-olive decoration-2 underline-offset-4 hover:decoration-ink"
            >
              Ask the assistant about this
            </OpenAssistantButton>
            <Link
              href="/subscription"
              className="font-semibold text-ink underline decoration-olive decoration-2 underline-offset-4 hover:decoration-ink"
            >
              Add to a subscription
            </Link>
          </div>

          {/* Details */}
          <dl className="mt-10 divide-y divide-line border-y border-line">
            {details.map((detail) => (
              <div key={detail.label} className="flex justify-between gap-4 py-4 text-sm">
                <dt className="text-ink-muted">{detail.label}</dt>
                <dd className="font-semibold text-ink">{detail.value}</dd>
              </div>
            ))}
          </dl>

          {/* Pantry note */}
          <div className="mt-8 rounded-[1.5rem] bg-lime p-6 text-forest">
            <p className="text-sm font-bold">Tracked in your pantry</p>
            <p className="mt-1 text-sm opacity-80">
              {product.shelfLifeDays
                ? `Keeps for about ${product.shelfLifeDays} days. When you order it, PantryPal adds it to your pantry and shows you when to use it by.`
                : 'When you order it, PantryPal adds it to your pantry and shows you when to use it by.'}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-ink">Free delivery</p>
              <p className="text-ink-muted">On orders over ৳500, otherwise ৳60</p>
            </div>
            <div>
              <p className="font-semibold text-ink">Cash on delivery</p>
              <p className="text-ink-muted">Pay when it arrives</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function DetailSkeleton() {
  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14">
      <div className="aspect-square animate-pulse rounded-[2rem] bg-surface-muted" />
      <div className="space-y-5 pt-2">
        <div className="h-3 w-24 animate-pulse rounded-full bg-surface-muted" />
        <div className="h-12 w-3/4 animate-pulse rounded-full bg-surface-muted" />
        <div className="h-10 w-40 animate-pulse rounded-full bg-surface-muted" />
        <div className="h-24 w-full animate-pulse rounded-3xl bg-surface-muted" />
        <div className="h-12 w-72 animate-pulse rounded-full bg-surface-muted" />
      </div>
    </div>
  );
}
