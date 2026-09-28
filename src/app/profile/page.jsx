'use client';
import { useState, useContext } from 'react';
import toast from 'react-hot-toast';
import Navbar from '@/components/common/Navbar';
import PageBanner from '@/components/common/PageBanner';
import SignInPrompt from '@/components/common/SignInPrompt';
import { AuthContext } from '@/context/AuthContext';
import { apiError } from '@/utils/pricing';

const inputClass =
  'w-full rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted transition-colors focus:border-olive focus:outline-none focus:ring-4 focus:ring-olive/15';
const labelClass = 'mb-1.5 block text-xs font-semibold text-ink';

export default function ProfilePage() {
  const { user, loading: authLoading, updateUser } = useContext(AuthContext);
  // Only fields the user has changed; everything else shows their saved profile
  const [edits, setEdits] = useState({});
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const form = {
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    ...edits,
  };
  const setField = (field) => (e) => setEdits((prev) => ({ ...prev, [field]: e.target.value }));
  const dirty = Object.keys(edits).length > 0 || password.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password && password.length < 8) {
      toast.error('Use at least 8 characters for your password');
      return;
    }

    setSaving(true);
    try {
      await updateUser({ ...form, ...(password ? { password } : {}) });
      setEdits({});
      setPassword('');
      setConfirmPassword('');
      toast.success('Profile saved');
    } catch (error) {
      toast.error(apiError(error, 'Could not save your profile'));
    } finally {
      setSaving(false);
    }
  };

  const joined = user?.joined
    ? new Date(user.joined).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar wide />
      <main className="mx-auto w-full max-w-[1600px] flex-grow px-5 pb-16 pt-4 lg:px-8 lg:pt-6">
        <PageBanner
          eyebrow="Profile"
          title={user ? user.name : 'Your profile.'}
          description={
            user
              ? `${user.role === 'admin' ? 'Administrator' : 'Member'}${joined ? ` since ${joined}` : ''}. Your delivery details fill in checkout for you.`
              : 'Your account details and delivery address.'
          }
          image="/images/kitchen-bg.jpg"
        />

        {!authLoading && !user ? (
          <SignInPrompt title="Log in to see your profile." description="Manage your details and the address we deliver to." />
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-6 max-w-3xl space-y-6">
            <section className="rounded-[1.75rem] border border-line bg-surface p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Account</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="p-name" className={labelClass}>Full name</label>
                  <input id="p-name" required autoComplete="name" value={form.name} onChange={setField('name')} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="p-email" className={labelClass}>Email</label>
                  <input id="p-email" type="email" required autoComplete="email" value={form.email} onChange={setField('email')} className={inputClass} />
                </div>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-line bg-surface p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Delivery details</p>
              <p className="mt-1 text-sm text-ink-muted">Used to fill in checkout and for subscription deliveries.</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="p-phone" className={labelClass}>Phone</label>
                  <input id="p-phone" type="tel" autoComplete="tel" placeholder="017..." value={form.phone} onChange={setField('phone')} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="p-address" className={labelClass}>Address</label>
                  <input
                    id="p-address"
                    autoComplete="street-address"
                    placeholder="House, road, area"
                    value={form.address}
                    onChange={setField('address')}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="p-city" className={labelClass}>City</label>
                  <input id="p-city" autoComplete="address-level2" value={form.city} onChange={setField('city')} className={inputClass} />
                </div>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-line bg-surface p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Change password</p>
              <p className="mt-1 text-sm text-ink-muted">Leave blank to keep your current password.</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="p-password" className={labelClass}>New password</label>
                  <input
                    id="p-password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="p-confirm" className={labelClass}>Confirm new password</label>
                  <input
                    id="p-confirm"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            <div className="flex items-center justify-end gap-4">
              {dirty && <p className="text-sm text-ink-muted">You have unsaved changes.</p>}
              <button
                type="submit"
                disabled={!dirty || saving}
                className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
