import Link from 'next/link';
import Image from 'next/image';

/** Shown on member-only pages when nobody is logged in. */
export default function SignInPrompt({ title, description }) {
  return (
    <div className="relative isolate mx-auto mt-10 max-w-3xl overflow-hidden rounded-[2rem] px-8 py-16 text-center text-[#F6F7EF] sm:px-14">
      <Image src="/images/market-stall.jpg" alt="" fill sizes="768px" className="-z-20 object-cover" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#1B241E]/85" />
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime">Members only</p>
      <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">{title}</h2>
      <p className="mx-auto mt-4 max-w-md text-[#D5DAC6]">{description}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
        <Link
          href="/login"
          className="rounded-full bg-lime px-7 py-3.5 text-sm font-semibold text-forest transition-opacity hover:opacity-90"
        >
          Log in
        </Link>
        <Link
          href="/register"
          className="text-sm font-semibold underline decoration-lime/60 decoration-2 underline-offset-8 hover:decoration-lime"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}
