'use client';
import { useState, useContext } from 'react';
import Link from 'next/link';
import { AuthContext } from '@/context/AuthContext';
import AuthShell, { inputClass, labelClass, primaryButtonClass } from '@/components/auth/AuthShell';

const panel = {
  image: '/images/auth-register.jpg',
  alt: 'Bowls of fresh vegetables, grains and fruit laid out on a table',
  eyebrow: 'Join PantryPal',
  title: 'Less waste starts with your next shop.',
  points: [
    'Free to join, no card required',
    'Expiry tracking for everything you buy',
    'Subscriptions you can skip or pause anytime',
  ],
};

const strengthStyles = [
  { label: 'Weak', bar: 'bg-[#B4543A]', text: 'text-[#B4543A] dark:text-[#E08A74]' },
  { label: 'Fair', bar: 'bg-[#C98A3A]', text: 'text-[#B06A2B] dark:text-[#E0A96D]' },
  { label: 'Good', bar: 'bg-olive', text: 'text-accent' },
  { label: 'Strong', bar: 'bg-[#6FA37F]', text: 'text-[#3F7A52] dark:text-[#8FC49D]' },
];

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { register } = useContext(AuthContext);

  const handlePasswordChange = (password) => {
    setFormData({ ...formData, password });

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    setIsLoading(true);
    await register(formData);
    setIsLoading(false);
  };

  const passwordsMismatch = formData.confirmPassword && formData.password !== formData.confirmPassword;
  const strength = passwordStrength > 0 ? strengthStyles[passwordStrength - 1] : null;

  return (
    <AuthShell panel={panel} panelSide="left">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Sign up</p>
      <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.03em] text-ink sm:text-5xl">Create your account.</h1>
      <p className="mt-3 text-ink-muted">It takes less than a minute. Your pantry will be ready right after.</p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <div>
          <label htmlFor="name" className={labelClass}>
            Full name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            required
            className={inputClass}
            placeholder="Jane Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

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
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              autoComplete="new-password"
              required
              className={`${inputClass} pr-20`}
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-4 text-sm font-semibold text-ink-muted hover:text-ink"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {formData.password && (
            <div className="mt-3">
              <div className="flex gap-1.5">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      strength && index < passwordStrength ? strength.bar : 'bg-line'
                    }`}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-ink-muted">
                Strength:{' '}
                <span className={`font-semibold ${strength ? strength.text : 'text-[#B4543A]'}`}>
                  {strength ? strength.label : 'Too short'}
                </span>
              </p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className={labelClass}>
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            aria-invalid={passwordsMismatch ? 'true' : undefined}
            className={`${inputClass} ${passwordsMismatch ? 'border-[#B4543A] focus:border-[#B4543A]' : ''}`}
            placeholder="Type it again"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
          {passwordsMismatch && (
            <p className="mt-2 text-xs font-medium text-[#B4543A] dark:text-[#E08A74]">Passwords do not match</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || formData.password !== formData.confirmPassword}
          className={`${primaryButtonClass} mt-3`}
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-10 border-t border-line pt-8 text-sm text-ink-muted">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-ink underline decoration-olive decoration-2 underline-offset-4 hover:decoration-ink"
        >
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
