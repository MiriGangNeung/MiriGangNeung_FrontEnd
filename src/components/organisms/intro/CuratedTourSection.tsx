import { Camera, Flag, MapPin, type LucideIcon } from 'lucide-react';
import { getIntroTourStops } from '../../../lib/introTour';

const assetById: Record<string, string> = {
  jeongdongjin: '/images/intro/place-jeongdongjin.png',
  anmok: '/images/intro/place-anmok.png',
  jumunjin: '/images/intro/place-jumunjin.png',
};

const routeIcons: LucideIcon[] = [Camera, MapPin, Flag];

const desktopMarkerClasses = [
  'left-[33.28125%] top-[13%]',
  'left-[66.5625%] top-[13%]',
  'left-[100%] top-[13%]',
];

export function CuratedTourSection() {
  const stops = getIntroTourStops();

  return (
    <section className="relative bg-canvas px-7 pb-12 pt-12 md:px-16 md:pb-16 md:pt-16">
      <div className="relative z-10 mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start lg:gap-10 xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-14">
        <div>
          <p className="text-xs font-bold tracking-widest text-brand">03. YOUR CURATED TOUR</p>
          <h2 className="mt-3 text-xl font-extrabold leading-[1.35] tracking-[-.04em] lg:text-[24px] xl:text-[26px]">
            <span className="block whitespace-nowrap">한 장의 사진에서</span>
            <span className="block whitespace-nowrap">하나의 여행으로.</span>
          </h2>
          <p className="mt-3 text-xs font-medium leading-6 text-ink-soft md:text-sm">
            당신이 선택한 장소를 기반으로
            <br />
            가장 알맞는 코스를
            <br />
            추천해드립니다.
          </p>
        </div>

        <div className="relative w-full md:mx-auto md:max-w-[640px] lg:justify-self-end">
          <div className="absolute bottom-6 left-5 top-16 border-l-2 border-dashed border-brand/35 md:hidden" />

          <svg
            className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible text-brand/45 md:block"
            viewBox="0 0 640 260"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 175 C50 175 80 180 110 180 S180 55 213 55 S280 180 320 180 S390 55 426 55 S500 180 533 180 S600 55 640 55"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray="4 8"
              strokeLinecap="round"
            />
            <circle cx="213" cy="55" r="4" className="fill-brand" />
            <circle cx="426" cy="55" r="4" className="fill-brand" />
            <circle cx="640" cy="55" r="4" className="fill-brand" />
          </svg>

          {routeIcons.map((Icon, index) => (
            <span
              key={index}
              data-route-marker="true"
              className={`absolute z-20 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center text-black md:flex ${desktopMarkerClasses[index]}`}
              aria-hidden="true"
            >
              <Icon size={18} strokeWidth={2.2} />
            </span>
          ))}

          <div className="relative grid gap-6 md:grid-cols-3 md:justify-items-center md:gap-8 xl:gap-10">
            {stops.map((stop, index) => {
              const Icon = routeIcons[index];

              return (
                <article
                  key={stop.place.id}
                  className="relative z-10 w-full max-w-[160px] pl-10 md:max-w-[140px] md:pl-0"
                >
                  <span
                    className="absolute left-0 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-brand/20 bg-canvas text-black shadow-card md:hidden"
                    aria-hidden="true"
                  >
                    <Icon size={16} />
                  </span>
                  <p className="text-xs font-bold tracking-wide text-brand">{stop.time}</p>
                  <h3 className="mt-1 text-sm font-extrabold text-ink">{stop.place.name}</h3>
                  <p className="mt-1 text-xs font-medium leading-5 text-ink-soft">{stop.caption}</p>
                  <img
                    src={assetById[stop.place.id]}
                    alt={`${stop.place.name} 여행 코스`}
                    className="mt-3 aspect-[4/3] w-full rounded-xl object-cover shadow-card md:aspect-[3/4]"
                  />
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <svg
        data-testid="curated-tour-wave"
        className="pointer-events-none absolute left-0 top-full z-20 h-20 w-full text-canvas md:h-28"
        viewBox="0 0 1440 112"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 0 H1440 V34 C1120 78 870 94 620 78 C360 62 180 34 0 22 Z" fill="currentColor" />
      </svg>
    </section>
  );
}
