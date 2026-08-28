import { PLACES } from '../../../data/places';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { REVEAL_BASE, revealClass, revealDelay } from '../../../lib/introMotion';
import { SectionWave } from './SectionWave';
import { StationHeading } from './StationHeading';

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
    <section ref={ref} className="relative bg-sand px-7 pb-36 pt-32 md:px-16 md:pb-56 md:pt-44">
      <div className="mx-auto grid max-w-[1440px] items-center gap-16 lg:grid-cols-[.8fr_1.5fr]">
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
            <article
              key={place.id}
              className={`group relative h-[260px] w-full max-w-[300px] overflow-hidden rounded-2xl shadow-card ring-0 ring-label transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:z-30 hover:-translate-y-10 hover:scale-[1.05] hover:shadow-lift hover:ring-[3px] hover:ring-offset-4 hover:ring-offset-sand motion-reduce:transition-none sm:h-[340px] sm:w-[31%] sm:min-w-[150px] md:h-[380px] ${index === 0 ? 'md:-rotate-6' : index === 2 ? 'md:rotate-6' : ''} ${revealClass(visible)}`}
              style={{ ...revealDelay(index, 120), zIndex: index === 1 ? 3 : index + 1 }}
            >
              <img
                src={assetById[place.id]}
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sea-deep/80 via-sea-deep/10 to-transparent" />
              <div className="absolute inset-0 bg-sea-deep/0 transition-colors duration-300 group-hover:bg-sea-deep/15" />
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
          ))}
        </div>
      </div>
      <SectionWave fillClass="fill-sand-deep" />
    </section>
  );
}
