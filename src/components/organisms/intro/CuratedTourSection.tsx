import { Camera, Flag, MapPin, type LucideIcon } from 'lucide-react';
import { getIntroTourStops } from '../../../lib/introTour';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { REVEAL_BASE, revealClass, revealDelay } from '../../../lib/introMotion';
import { StationHeading } from './StationHeading';

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
  const { ref, visible } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-sand px-7 pb-36 pt-32 md:px-16 md:pb-56 md:pt-44"
    >
      <div className="relative z-10 mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start lg:gap-10 xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-14">
        <div className={`${REVEAL_BASE} ${revealClass(visible, 'left')}`}>
          <StationHeading index={3} label="세 번째 · 코스 받기" />
          <h2 className="mt-6 font-serif text-[26px] font-bold leading-[1.45] tracking-[-0.03em] text-heading md:text-[32px]">
            <span className="block whitespace-nowrap">한 장의 사진에서</span>
            <span className="block whitespace-nowrap">하나의 여행으로.</span>
          </h2>
          <p className="mt-6 text-[15px] leading-[1.6] text-copy">
            당신이 선택한 장소를 기반으로
            <br />
            가장 알맞는 코스를
            <br />
            추천해드립니다.
          </p>
        </div>

        <div className="relative w-full md:mx-auto md:max-w-[640px] lg:justify-self-end">
          <div
            className="absolute bottom-6 left-5 top-16 origin-top border-l-2 border-dashed border-label/30 transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:!transition-none md:hidden"
            style={{ transform: visible ? 'scaleY(1)' : 'scaleY(0)' }}
          />

          <svg
            className={`pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible text-label/60 transition-[opacity,clip-path] delay-200 duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:!transition-none md:block ${visible ? 'opacity-100' : 'opacity-0'}`}
            style={{ clipPath: visible ? 'inset(-6px 0 0 0)' : 'inset(-6px 100% 0 0)' }}
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
            <circle cx="213" cy="55" r="4" className="fill-label" />
            <circle cx="426" cy="55" r="4" className="fill-label" />
            <circle cx="640" cy="55" r="4" className="fill-label" />
          </svg>

          {routeIcons.map((Icon, index) => (
            <span
              key={index}
              data-route-marker="true"
              className={`absolute z-20 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center text-label transition-opacity duration-500 ease-out motion-reduce:!transition-none md:flex ${desktopMarkerClasses[index]}`}
              style={{ opacity: visible ? 1 : 0, transitionDelay: `${450 + index * 280}ms` }}
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
                  style={revealDelay(index, 140)}
                  className={`relative z-10 w-full max-w-[180px] pl-10 md:max-w-[168px] md:pl-0 ${REVEAL_BASE} ${revealClass(visible)}`}
                >
                  <span
                    className="absolute left-0 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-label/25 bg-sand text-label shadow-card md:hidden"
                    aria-hidden="true"
                  >
                    <Icon size={16} />
                  </span>
                  <p className="text-sm font-extrabold tracking-tight text-label">{stop.time}</p>
                  <h3 className="mt-1 text-base font-extrabold text-heading">{stop.place.name}</h3>
                  <p className="mt-1.5 text-[13px] font-medium leading-6 text-copy">
                    {stop.caption}
                  </p>
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
    </section>
  );
}
