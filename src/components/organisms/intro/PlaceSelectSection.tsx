import { PLACES } from '../../../data/places';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { REVEAL_BASE, revealClass, revealDelay } from '../../../lib/introMotion';

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
    <section ref={ref} className="bg-canvas px-7 py-24 md:px-16 md:py-32">
      <div className="mx-auto grid max-w-[1440px] items-center gap-16 lg:grid-cols-[.8fr_1.5fr]">
        <div className={`${REVEAL_BASE} ${revealClass(visible, 'left')}`}>
          <p className="text-xs font-bold tracking-widest text-brand">01. CHOOSE YOUR PLACE</p>
          <h2 className="mt-6 text-3xl font-extrabold leading-[1.45] tracking-[-.04em] text-ink md:text-4xl">
            여러 강릉 관광지에서
            <br />
            가고 싶은 곳을
            <br />
            선택할 수 있어요.
          </h2>
          <p className="mt-7 leading-7 text-ink-soft">
            아름다운 바다부터 감성 가득한 골목까지,
            <br />
            당신의 취향에 맞는 강릉을 골라보세요.
          </p>
        </div>
        <div className="flex justify-center gap-1 md:-space-x-6">
          {places.map((place, index) => (
            <article
              key={place.id}
              className={`group relative h-[340px] w-[31%] min-w-[155px] max-w-[285px] overflow-hidden rounded-2xl shadow-card hover:-translate-y-2 hover:shadow-lift md:h-[380px] ${index === 0 ? '-rotate-6' : index === 2 ? 'rotate-6' : ''} ${REVEAL_BASE} ${revealClass(visible)}`}
              style={{ ...revealDelay(index, 120), zIndex: index === 1 ? 3 : index + 1 }}
            >
              <img
                src={assetById[place.id]}
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />
              <div className="absolute inset-x-4 bottom-5 text-white">
                <h3 className="text-xl font-extrabold">{place.name}</h3>
                <p className="mt-1 text-xs">{place.region}</p>
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
    </section>
  );
}
