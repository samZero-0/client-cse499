'use client';
import { twMerge } from 'tailwind-merge';

function setTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  try {
    localStorage.setItem('theme', theme);
  } catch (e) {}
}

// Active segment is driven by the `dark:` variant, so no client state is
// needed and server/client markup always matches.
export default function ThemeToggle({ className }) {
  const segment =
    'px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-200';

  return (
    <div
      role="group"
      aria-label="Color theme"
      className={twMerge(
        'inline-flex items-center rounded-full border border-line bg-surface-muted p-0.5',
        className
      )}
    >
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={`${segment} bg-surface text-ink shadow-sm dark:bg-transparent dark:text-ink-muted dark:shadow-none dark:hover:text-ink`}
      >
        Light
      </button>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={`${segment} text-ink-muted hover:text-ink dark:bg-surface dark:text-ink dark:shadow-sm`}
      >
        Dark
      </button>
    </div>
  );
}
