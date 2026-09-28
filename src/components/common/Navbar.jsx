'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import ThemeToggle from './ThemeToggle';

const publicLinks = [{ name: 'Shop', href: '/products' }];

const memberLinks = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Pantry', href: '/pantry' },
  { name: 'Subscriptions', href: '/subscription' },
];

export default function Navbar({ wide = false }) {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useCart();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  // Remember which route the mobile menu was opened on, so navigating closes it
  const [menuPath, setMenuPath] = useState(null);
  const isMenuOpen = menuPath === pathname;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = user ? [...publicLinks, ...memberLinks] : publicLinks;
  const cartCount = cartItems.length;

  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);

  const linkClass = (href) =>
    `relative text-sm font-medium transition-colors duration-200 after:absolute after:left-0 after:-bottom-1.5 after:h-px after:bg-current after:transition-all after:duration-300 ${
      isActive(href)
        ? 'text-ink after:w-full'
        : 'text-ink-muted hover:text-ink after:w-0 hover:after:w-full'
    }`;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        isScrolled || isMenuOpen
          ? 'bg-canvas/85 backdrop-blur-xl border-line'
          : 'bg-canvas border-transparent'
      }`}
    >
      <nav className={`mx-auto flex h-16 items-center gap-4 px-5 lg:h-[72px] lg:px-8 ${wide ? 'max-w-[1600px]' : 'max-w-7xl'}`}>
        {/* Brand */}
        <div className="flex lg:flex-1">
          <Link
            href="/"
            className="text-xl font-extrabold tracking-tight text-ink transition-opacity hover:opacity-80"
          >
            Pantry<span className="text-accent">Pal</span>
          </Link>
        </div>

        {/* Center links */}
        <div className="flex flex-1 items-center justify-center gap-7 lg:flex-none">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={`hidden lg:inline-block ${linkClass(link.href)}`}>
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center justify-end gap-5 lg:flex-1">
          <ThemeToggle className="hidden lg:inline-flex" />

          <Link href="/cart" className={`inline-flex items-center gap-1.5 ${linkClass('/cart')}`}>
            Cart
            {cartCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-lime px-1.5 text-[11px] font-bold text-forest">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden items-center gap-5 lg:flex">
              <Link href="/profile" className={`hidden xl:inline-block ${linkClass('/profile')}`}>
                {user.name?.split(' ')[0] || 'Profile'}
              </Link>
              <button
                onClick={logout}
                className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-ink"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-5 lg:flex">
              <Link href="/login" className={linkClass('/login')}>
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
              >
                Sign up
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMenuPath(isMenuOpen ? null : pathname)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            className="rounded-full border border-line px-3.5 py-1.5 text-sm font-semibold text-ink transition-colors hover:border-ink lg:hidden"
          >
            {isMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div id="mobile-menu" className="border-t border-line bg-canvas lg:hidden animate-fade-in">
          <div className={`mx-auto px-5 py-6 ${wide ? 'max-w-[1600px]' : 'max-w-7xl'}`}>
            <div className="flex flex-col">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`border-b border-line py-4 text-2xl font-semibold tracking-tight transition-colors ${
                    isActive(link.href) ? 'text-ink' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {user && (
                <Link
                  href="/profile"
                  className={`border-b border-line py-4 text-2xl font-semibold tracking-tight transition-colors ${
                    isActive('/profile') ? 'text-ink' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  Profile
                </Link>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm text-ink-muted">Appearance</span>
              <ThemeToggle />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {user ? (
                <button
                  onClick={logout}
                  className="col-span-2 rounded-full border border-line py-3 text-sm font-semibold text-ink"
                >
                  Log out
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-full border border-line py-3 text-center text-sm font-semibold text-ink"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-full bg-primary py-3 text-center text-sm font-semibold text-on-primary"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
