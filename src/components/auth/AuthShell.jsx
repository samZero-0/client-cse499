import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from '@/components/common/ThemeToggle';

export const inputClass =
  'w-full rounded-2xl border border-line bg-surface px-4 py-3.5 text-base text-ink placeholder:text-ink-muted transition-colors focus:border-olive focus:outline-none focus:ring-4 focus:ring-olive/15';

export const labelClass = 'mb-2 block text-sm font-semibold text-ink';

export const primaryButtonClass =
  'w-full rounded-full bg-primary py-4 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50';

/**
 * Split-screen layout for the auth pages: form on one side, photo panel on the other.
 * `panel` = { image, alt, eyebrow, title, points: string[], quote?: { text, name, role } }
 */
export default function AuthShell({ panel, panelSide = 'right', children }) {
  const photo = (
    <div className="relative hidden p-3 lg:block">
      {/* Sticky wrapper + relative frame: next/image `fill` needs a relative/absolute parent */}
      <div className="sticky top-3 h-[calc(100vh-1.5rem)]">
        <div className="relative h-full overflow-hidden rounded-[2rem]">
          <Image src={panel.image} alt={panel.alt} fill priority sizes="50vw" className="object-cover" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#1B241E]/95 via-[#1B241E]/55 to-[#1B241E]/10"
          />
          <div className="absolute inset-x-0 bottom-0 p-12 text-[#F6F7EF] xl:p-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime">{panel.eyebrow}</p>
            <h2 className="mt-4 max-w-md text-4xl font-extrabold leading-[1.08] tracking-[-0.03em] xl:text-5xl">
              {panel.title}
            </h2>
            <ul className="mt-8 max-w-md divide-y divide-white/15 border-y border-white/15">
              {panel.points.map((point) => (
                <li key={point} className="py-3.5 text-sm text-[#D5DAC6]">
                  {point}
                </li>
              ))}
            </ul>
            {panel.quote && (
              <figure className="mt-8 max-w-md">
                <blockquote className="text-base leading-relaxed">&ldquo;{panel.quote.text}&rdquo;</blockquote>
                <figcaption className="mt-3 text-sm text-[#D5DAC6]">
                  <span className="font-semibold text-[#F6F7EF]">{panel.quote.name}</span> &middot; {panel.quote.role}
                </figcaption>
              </figure>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid min-h-screen bg-canvas lg:grid-cols-2">
      {panelSide === 'left' && photo}

      <div className="flex flex-col px-5 py-6 sm:px-10 lg:px-16">
        <header className="flex items-center justify-between">
          <Link href="/" className="text-xl font-extrabold tracking-tight text-ink transition-opacity hover:opacity-80">
            Pantry<span className="text-accent">Pal</span>
          </Link>
          <div className="flex items-center gap-5">
            <Link href="/products" className="hidden text-sm font-medium text-ink-muted hover:text-ink sm:inline">
              Browse the shop
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center py-14">
          <div className="w-full max-w-md animate-fade-in-up">{children}</div>
        </main>
      </div>

      {panelSide === 'right' && photo}
    </div>
  );
}
