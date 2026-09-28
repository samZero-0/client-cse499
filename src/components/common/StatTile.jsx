import Link from 'next/link';

const tones = {
  default: 'border border-line bg-surface text-ink',
  lime: 'bg-lime text-forest',
  sky: 'bg-sky text-forest',
  forest: 'bg-forest text-[#F6F7EF] dark:bg-surface-muted dark:text-ink',
};

/** Text-only stat card. Pass `href` + `cta` to make it a link. */
export default function StatTile({ label, value, note, tone = 'default', href, cta, highlight }) {
  const body = (
    <div
      className={`flex h-full flex-col justify-between gap-6 rounded-[1.5rem] p-6 transition-transform duration-300 ${tones[tone]} ${
        href ? 'hover:-translate-y-0.5' : ''
      } ${highlight ? 'ring-2 ring-warning/60' : ''}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-70">{label}</p>
      <div>
        <p className="text-3xl font-extrabold tracking-tight tabular-nums">{value}</p>
        {note && <p className="mt-1 text-sm opacity-70">{note}</p>}
        {href && cta && (
          <p className="mt-3 text-sm font-semibold underline decoration-current/30 decoration-2 underline-offset-4">
            {cta}
          </p>
        )}
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="block h-full">
      {body}
    </Link>
  ) : (
    body
  );
}
