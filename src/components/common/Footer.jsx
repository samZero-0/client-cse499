import Link from 'next/link';

const columns = [
  {
    title: 'Shop',
    links: [
      { name: 'All products', href: '/products' },
      { name: 'Subscriptions', href: '/subscription' },
      { name: 'Cart', href: '/cart' },
    ],
  },
  {
    title: 'Account',
    links: [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'My pantry', href: '/pantry' },
      { name: 'Profile', href: '/profile' },
    ],
  },
];

// Store terms, kept in sync with the server's pricing rules
const terms = ['Free delivery on orders over ৳500', 'Cash on delivery', '15% off every subscription delivery'];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-forest text-[#DDE2CC] dark:bg-surface dark:text-ink-muted dark:border-t dark:border-line">
      <div className="mx-auto max-w-7xl px-5 pt-20 pb-10 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-5">
            <p className="max-w-sm text-2xl font-semibold leading-snug tracking-tight text-[#F6F7EF] dark:text-ink">
              Groceries that fit your week, and a pantry that wastes nothing.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/register"
                className="rounded-full bg-lime px-6 py-3 text-sm font-semibold text-forest transition-opacity hover:opacity-90"
              >
                Create an account
              </Link>
              <Link
                href="/products"
                className="text-sm font-semibold underline decoration-lime/60 decoration-2 underline-offset-4 hover:decoration-lime dark:decoration-olive"
              >
                Shop groceries
              </Link>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-olive">{column.title}</h3>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-sm transition-colors hover:text-lime dark:hover:text-ink">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-olive">Good to know</h3>
              <ul className="mt-5 space-y-3 text-sm">
                {terms.map((term) => (
                  <li key={term}>{term}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Wordmark */}
        <div
          aria-hidden="true"
          className="mt-20 select-none pb-[0.14em] text-[18vw] font-extrabold leading-[0.8] tracking-[-0.06em] text-white/[0.06] lg:text-[13rem] dark:text-ink/[0.05]"
        >
          PantryPal
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm md:flex-row md:items-center md:justify-between dark:border-line">
          <p>&copy; {currentYear} PantryPal. All rights reserved.</p>
          <p>Shop, track your pantry and manage deliveries in one place.</p>
        </div>
      </div>
    </footer>
  );
}
