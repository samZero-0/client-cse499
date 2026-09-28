'use client';
import { useState, useContext } from 'react';
import Link from 'next/link';
import { AuthContext } from '@/context/AuthContext';
import AuthShell, { inputClass, labelClass, primaryButtonClass } from '@/components/auth/AuthShell';

const panel = {
  image: '/images/auth-login.jpg',
  alt: 'Crate of fresh oranges, pears, peppers and herbs',
  eyebrow: 'Welcome back',
  title: 'Your pantry missed you.',
  points: [
    'See what is expiring soon and use it first',
    'Pick up your subscriptions where you left off',
    'Ask the assistant to restock in one message',
  ],
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
  };

  return (
    <AuthShell panel={panel}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Log in</p>
      <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.03em] text-ink sm:text-5xl">Good to see you.</h1>
      <p className="mt-3 text-ink-muted">Log in to manage your pantry, orders and subscriptions.</p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            className={inputClass}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              className={`${inputClass} pr-20`}
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-4 text-sm font-semibold text-ink-muted hover:text-ink"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <button type="submit" disabled={isLoading} className={`${primaryButtonClass} mt-3`}>
          {isLoading ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="mt-10 border-t border-line pt-8 text-sm text-ink-muted">
        New to PantryPal?{' '}
        <Link
          href="/register"
          className="font-semibold text-ink underline decoration-olive decoration-2 underline-offset-4 hover:decoration-ink"
        >
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
