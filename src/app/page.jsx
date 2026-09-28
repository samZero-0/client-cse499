import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/common/Navbar';
import OpenAssistantButton from '@/components/ai/OpenAssistantButton';

const assurances = [
  { title: 'Free delivery', text: 'On orders over ৳500' },
  { title: 'Cash on delivery', text: 'Pay when it arrives' },
  { title: 'Expiry tracking', text: 'Know what to use first' },
];

const features = [
  {
    number: '01',
    title: 'A pantry that remembers',
    text: 'Everything you buy lands in your digital pantry with its expiry date, so you use it before you lose it.',
    image: '/images/feature-pantry.jpg',
    alt: 'Glass jar of chickpeas on a dark kitchen counter',
    tone: 'bg-lime text-forest',
  },
  {
    number: '02',
    title: 'Essentials on repeat',
    text: 'Build a bundle once and it arrives every week, two weeks or month at 15% off. Skip a delivery or pause any time.',
    image: '/images/feature-subscription.jpg',
    alt: 'Reusable mesh grocery bag filled with vegetables',
    tone: 'bg-sky text-forest',
  },
  {
    number: '03',
    title: 'Shop by conversation',
    text: 'Tell the assistant what you need in plain words. It finds the items, fills your cart and takes you to checkout.',
    image: '/images/feature-assistant.jpg',
    alt: 'Supermarket shelves stocked with fresh vegetables',
    tone: 'bg-[#F6F7EF] text-forest',
  },
];

const steps = [
  { title: 'Tell it what you need', text: '"Add milk, eggs and bread to my cart."' },
  { title: 'Review your cart', text: 'Matching products are added at shop prices, ready to adjust.' },
  { title: 'Make it recurring', text: '"Add them to my subscription" saves 15% on every delivery.' },
];

const categories = [
  { name: 'Vegetables', note: 'Picked this week', image: '/images/cat-vegetables.jpg', alt: 'Pile of colourful fresh vegetables' },
  { name: 'Fruits', note: 'Seasonal and crisp', image: '/images/cat-fruits.jpg', alt: 'Papaya, pineapple, grapes, citrus and avocado' },
  { name: 'Dairy', note: 'Milk, cheese, yogurt', image: '/images/cat-dairy.jpg', alt: 'Milk being poured from a jug into a glass' },
  { name: 'Bakery', note: 'Baked every morning', image: '/images/cat-bakery.jpg', alt: 'Assorted loaves, baguettes and rolls' },
  { name: 'Meat', note: 'Responsibly sourced', image: '/images/cat-meat.jpg', alt: 'Two raw steaks on a wooden board' },
  { name: 'Beverages', note: 'From juice to coffee', image: '/images/cat-beverages.jpg', alt: 'Glass of fresh orange juice with a lemon slice' },
];

const testimonials = [
  {
    quote: 'No more expired food at the back of the fridge. We save around a hundred dollars a month.',
    name: 'Sarah Johnson',
    role: 'Parent of three',
  },
  {
    quote: 'The subscriptions are a lifesaver. I never run out of the basics and delivery is always on time.',
    name: 'Michael Chen',
    role: 'Working professional',
  },
  {
    quote: 'The produce is genuinely fresh and the prices are fair. It has replaced my weekly supermarket trip.',
    name: 'Emily Rodriguez',
    role: 'Home cook',
  },
  {
    quote: 'I just tell the assistant what I need for the week and my cart is ready before the kettle boils.',
    name: 'Daniel Okafor',
    role: 'Night-shift nurse',
  },
  {
    quote: 'Seeing what expires first changed how we cook. We plan meals around what is already in the pantry now.',
    name: 'Priya Nair',
    role: 'Student',
  },
  {
    quote: 'Our monthly bundle covers every staple. Pausing it while we travelled took two taps.',
    name: 'Lucas Moreau',
    role: 'Frequent traveller',
  },
];

function Eyebrow({ children, className = '' }) {
  return (
    <p className={`text-xs font-semibold uppercase tracking-[0.2em] text-accent ${className}`}>
      {children}
    </p>
  );
}

export default function Home() {
  return (
    <main className="flex flex-grow flex-col">
      <Navbar />

      {/* Hero */}
      <section className="mx-auto w-full max-w-7xl px-5 pt-10 lg:px-8 lg:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <div>
            <Eyebrow className="animate-fade-in-up">Less waste. More good food.</Eyebrow>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.02] tracking-[-0.035em] text-ink sm:text-6xl lg:text-[3.5rem] xl:text-[4.25rem] animate-fade-in-up animation-delay-100">
              A fresher way <br className="hidden sm:block" />
              to fill your pantry.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-muted animate-fade-in-up animation-delay-200">
              Shop everyday essentials, keep track of what you have, and make the most of every grocery run.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 animate-fade-in-up animation-delay-300">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
              >
                Shop groceries
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                  &rarr;
                </span>
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold text-ink underline decoration-olive decoration-2 underline-offset-8 transition-colors hover:decoration-ink"
              >
                Create an account
              </Link>
            </div>
            <p className="mt-10 text-sm text-ink-muted animate-fade-in-up animation-delay-400">
              Expiry tracking. Thoughtful shopping.
            </p>
          </div>

          <div className="animate-fade-in-up animation-delay-200">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-surface-muted lg:aspect-[8/7]">
              <Image
                src="/images/hero-groceries.jpg"
                alt="Canvas tote and paper bag full of kale, carrots and bread on a kitchen counter, with milk, lemons, tomatoes and apples"
                fill
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Assurances */}
        <div className="mt-14 grid border-t border-line sm:grid-cols-3 lg:mt-20">
          {assurances.map((item, index) => (
            <div
              key={item.title}
              className={`py-6 sm:px-6 sm:py-8 sm:text-center ${
                index > 0 ? 'border-t border-line sm:border-t-0 sm:border-l' : ''
              }`}
            >
              <p className="text-sm font-semibold text-ink">{item.title}</p>
              <p className="mt-1 text-sm text-ink-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative isolate mt-24 overflow-hidden lg:mt-32">
        <Image
          src="/images/kitchen-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#1B241E]/80 dark:bg-[#0B100D]/85" />

        <div className="mx-auto w-full max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow className="text-lime">Why PantryPal</Eyebrow>
              <h2 className="mt-4 text-4xl font-extrabold leading-[1.08] tracking-[-0.03em] text-[#F6F7EF] sm:text-5xl">
                Everything your kitchen needs, and nothing it doesn&rsquo;t.
              </h2>
            </div>
            <p className="max-w-md text-lg leading-relaxed text-[#D5DAC6] lg:col-span-5 lg:justify-self-end">
              Three simple tools that work together, so shopping takes less time and less food ends up in the bin.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.number}
                className={`group flex flex-col overflow-hidden rounded-[1.75rem] shadow-2xl shadow-black/20 transition-transform duration-300 hover:-translate-y-1 ${feature.tone}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={feature.image}
                    alt={feature.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-5 top-5 rounded-full bg-black/35 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    {feature.number}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="text-2xl font-bold tracking-tight">{feature.title}</h3>
                  <p className="mt-3 leading-relaxed opacity-80">{feature.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AI assistant */}
      <section className="bg-surface-muted">
        <div className="mx-auto grid w-full max-w-7xl gap-16 px-5 py-24 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-32">
          <div>
            <Eyebrow>Smart shopping</Eyebrow>
            <h2 className="mt-4 text-4xl font-extrabold leading-[1.08] tracking-[-0.03em] text-ink sm:text-5xl">
              Your grocery list, handled in one message.
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-muted">
              The PantryPal assistant understands plain language. Ask for what you need and it takes care of the
              searching and the cart, then takes you straight to checkout.
            </p>

            <ol className="mt-10 space-y-0">
              {steps.map((step, index) => (
                <li key={step.title} className="flex gap-6 border-t border-line py-6 last:border-b">
                  <span className="w-8 shrink-0 text-sm font-semibold text-accent">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{step.title}</p>
                    <p className="mt-1 text-ink-muted">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <OpenAssistantButton className="group mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover">
              Try smart shopping
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </OpenAssistantButton>
          </div>

          {/* Chat preview */}
          <div className="relative isolate overflow-hidden rounded-[2rem] p-4 sm:p-10">
            <Image
              src="/images/produce-baskets.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="-z-20 object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#1B241E]/25 dark:bg-black/45" />
            <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl shadow-black/30">
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <div>
                  <p className="text-sm font-bold text-ink">PantryPal Assistant</p>
                  <p className="text-xs text-ink-muted">Online</p>
                </div>
                <span className="h-2 w-2 rounded-full bg-[#6FA37F]" aria-hidden="true" />
              </div>

              <div className="space-y-4 bg-canvas p-5">
                <div className="flex justify-end">
                  <p className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm text-on-primary">
                    Add milk, eggs and bread to my cart.
                  </p>
                </div>

                <div className="max-w-[88%] rounded-2xl rounded-tl-md border border-line bg-surface p-4">
                  <p className="text-sm text-ink">Done. Added to your cart:</p>
                  <ul className="mt-3 divide-y divide-line text-sm">
                    {[
                      ['Fresh Milk (1L)', '৳90'],
                      ['Farm Eggs (12 pcs)', '৳120'],
                      ['Whole Wheat Bread', '৳60'],
                    ].map(([item, price]) => (
                      <li key={item} className="flex justify-between gap-4 py-2.5">
                        <span className="text-ink">{item}</span>
                        <span className="tabular-nums text-ink-muted">{price}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-1 flex justify-between border-t border-line pt-3 text-sm font-semibold text-ink">
                    <span>Total</span>
                    <span className="tabular-nums">৳270</span>
                  </div>
                </div>

                <p className="max-w-[88%] rounded-2xl rounded-tl-md bg-lime px-4 py-3 text-sm text-forest">
                  Tip: say &ldquo;add them to my subscription&rdquo; and they arrive on repeat at 15% off, with free delivery.
                </p>
              </div>

              <div className="flex gap-2 border-t border-line p-3">
                <div className="flex-1 rounded-full border border-line bg-canvas px-4 py-2 text-sm text-ink-muted">
                  Add them to my subscription
                </div>
                <div className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary">Send</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto w-full max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>Shop by category</Eyebrow>
            <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.03em] text-ink sm:text-5xl">
              Fresh across every aisle.
            </h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold text-ink underline decoration-olive decoration-2 underline-offset-8 transition-colors hover:decoration-ink"
          >
            View all products
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-5">
          {categories.map((category) => (
            <Link
              key={category.name}
              href="/products"
              className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[1.5rem] bg-surface-muted p-5 text-white sm:aspect-[5/4] sm:p-7"
            >
              <Image
                src={category.image}
                alt={category.alt}
                fill
                sizes="(min-width: 768px) 33vw, 50vw"
                className="-z-20 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/85"
              />
              <p className="text-xs font-medium text-white/80 sm:text-sm">{category.note}</p>
              <div className="mt-1 flex items-end justify-between gap-3">
                <h3 className="text-xl font-bold tracking-tight sm:text-3xl">{category.name}</h3>
                <span
                  aria-hidden="true"
                  className="hidden text-xl opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 sm:inline"
                >
                  &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-line bg-surface-muted py-24 lg:py-32">
        <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
          <Eyebrow>From our customers</Eyebrow>
          <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.03em] text-ink sm:text-5xl">
            Kitchens that run a little smoother.
          </h2>
        </div>

        <div className="marquee group mt-14 flex overflow-hidden">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1 ? 'true' : undefined}
              className="marquee-track flex shrink-0 gap-5 pr-5 group-hover:[animation-play-state:paused]"
            >
              {testimonials.map((t) => (
                <li
                  key={t.name}
                  className="flex w-[19rem] shrink-0 flex-col justify-between gap-8 rounded-[1.5rem] border border-line bg-surface p-7 sm:w-[24rem]"
                >
                  <blockquote className="text-base leading-relaxed text-ink sm:text-lg">&ldquo;{t.quote}&rdquo;</blockquote>
                  <div className="flex items-center gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-lime text-sm font-bold text-forest">
                      {t.name
                        .split(' ')
                        .map((part) => part[0])
                        .join('')}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-ink">{t.name}</span>
                      <span className="block text-sm text-ink-muted">{t.role}</span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto w-full max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <div className="relative isolate overflow-hidden rounded-[2rem] px-8 py-16 text-[#F6F7EF] sm:px-14 lg:py-24">
          <Image
            src="/images/market-stall.jpg"
            alt=""
            fill
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="-z-20 object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-r from-[#1B241E]/95 via-[#1B241E]/75 to-[#1B241E]/20"
          />
          <div className="relative max-w-2xl">
            <h2 className="text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
              Start your first smarter grocery run.
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-[#D5DAC6]">
              Create a free account in under a minute. No card needed: you pay cash on delivery. Pause subscriptions any time.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/register"
                className="rounded-full bg-lime px-7 py-4 text-sm font-semibold text-forest transition-opacity hover:opacity-90"
              >
                Get started free
              </Link>
              <Link
                href="/products"
                className="text-sm font-semibold underline decoration-lime/60 decoration-2 underline-offset-8 transition-colors hover:decoration-lime"
              >
                Browse products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
