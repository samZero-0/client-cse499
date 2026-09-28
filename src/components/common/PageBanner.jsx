import Image from 'next/image';

/** Compact photo banner used at the top of app pages (shop, dashboard, pantry, subscriptions). */
export default function PageBanner({ eyebrow, title, description, image, imagePosition = 'center', children }) {
  return (
    <section className="relative isolate overflow-hidden rounded-[1.5rem] px-6 py-6 text-[#F6F7EF] sm:px-8 lg:py-7">
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="(min-width: 1600px) 1540px, 100vw"
        className="-z-20 object-cover"
        style={{ objectPosition: imagePosition }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[#1B241E]/95 via-[#1B241E]/80 to-[#1B241E]/50"
      />
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-10">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime">{eyebrow}</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">{title}</h1>
          {description && <p className="mt-1.5 max-w-xl text-sm text-[#D5DAC6]">{description}</p>}
        </div>
        {children && <div className="shrink-0">{children}</div>}
      </div>
    </section>
  );
}
