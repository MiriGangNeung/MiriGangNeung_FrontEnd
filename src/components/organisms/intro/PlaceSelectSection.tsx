import type { PointerEvent } from 'react';
import { PLACES } from '../../../data/places';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { REVEAL_BASE, revealClass, revealDelay } from '../../../lib/introMotion';
import { SectionWave } from './SectionWave';
import { StationHeading } from './StationHeading';

const MAX_TILT = 9;

function handleTilt(event: PointerEvent<HTMLDivElement>) {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  const px = (event.clientX - rect.left) / rect.width - 0.5;
  const py = (event.clientY - rect.top) / rect.height - 0.5;
  el.style.setProperty('--ry', `${px * MAX_TILT * 2}deg`);
  el.style.setProperty('--rx', `${-py * MAX_TILT * 2}deg`);
}

function resetTilt(event: PointerEvent<HTMLDivElement>) {
  event.currentTarget.style.setProperty('--rx', '0deg');
  event.currentTarget.style.setProperty('--ry', '0deg');
}

const assetById: Record<string, string> = {
  jeongdongjin: '/images/intro/place-jeongdongjin.png',
  anmok: '/images/intro/place-anmok.png',
  jumunjin: '/images/intro/place-jumunjin.png',
};
const selectedIds = ['jeongdongjin', 'anmok', 'jumunjin'];

export function PlaceSelectSection() {
  const { ref, visible } = useScrollReveal<HTMLElement>();
  const places = PLACES.filter((place) => selectedIds.includes(place.id));
  return (
    <section ref={ref} className="relative bg-sand px-7 pb-28 pt-28 md:px-16 md:pb-44 md:pt-40">
      <div className="mx-auto grid max-w-[1200px] items-center gap-16 lg:grid-cols-[.8fr_1.5fr]">
        <div className={`${REVEAL_BASE} ${revealClass(visible, 'left')}`}>
          <StationHeading index={1} label="첫 번째 · 장소 고르기" />
          <h2 className="mt-6 font-serif text-[26px] font-bold leading-[1.45] tracking-[-0.03em] text-heading md:text-[32px]">
            여러 강릉 관광지에서
            <br />
            가고 싶은 곳을
            <br />
            선택할 수 있어요.
          </h2>
          <p className="mt-6 text-[15px] leading-[1.6] text-copy">
            아름다운 바다부터 감성 가득한 골목까지,
            <br />
            당신의 취향에 맞는 강릉을 골라보세요.
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-1 md:-space-x-6">
          {places.map((place, index) => (
            <div
              key={place.id}
              className={`group relative w-full max-w-[300px] hover:z-30 sm:w-[31%] sm:min-w-[150px] ${REVEAL_BASE} ${revealClass(visible)}`}
              style={{ ...revealDelay(index, 120), zIndex: index === 1 ? 3 : index + 1 }}
            >
              <div
                className={`transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:-translate-y-9 group-hover:scale-[1.04] motion-reduce:transition-none ${index === 0 ? 'md:-rotate-6' : index === 2 ? 'md:rotate-6' : ''}`}
              >
                <article
                  onPointerMove={handleTilt}
                  onPointerLeave={resetTilt}
                  className="tilt3d relative block h-[260px] overflow-hidden rounded-2xl shadow-card ring-0 ring-label group-hover:shadow-lift group-hover:ring-[3px] group-hover:ring-offset-4 group-hover:ring-offset-sand sm:h-[340px] md:h-[380px]"
                >
                  <img
                    src={assetById[place.id]}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sea-deep/80 via-sea-deep/10 to-transparent" />
                  <div className="absolute inset-0 bg-sea-deep/0 transition-colors duration-300 group-hover:bg-sea-deep/15" />
                  {/* Sheen sweep on hover */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 group-hover:animate-sheen group-hover:opacity-100 motion-reduce:hidden"
                  />
                  <div className="absolute inset-x-4 bottom-5 text-white">
                    <h3 className="text-xl font-extrabold">{place.name}</h3>
                    <p className="mt-1 text-xs text-white/80">{place.region}</p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {place.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-white/25 px-2 py-1 text-[10px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SectionWave fillClass="fill-sand-deep" />
    </section>
  );
}
