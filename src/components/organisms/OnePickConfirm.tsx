import { useState } from 'react';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { OnePickCarousel } from './OnePickCarousel';
import type { PickOption } from './OnePickCarousel';
import { findPlaceById } from '../../lib/placeLookup';
import { getPlaceImageSelection } from '../../lib/placeImages';
import type { Place } from '../../types/domain';

type OnePickConfirmProps = {
  places: Place[];
  picks: string[];
  onePick: string;
  placeImageIndexes: Record<string, number>;
  onSelect: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
};

/** Korean instrumental particle: 로 after a vowel or ㄹ final, 으로 otherwise. */
function roParticle(name: string): string {
  const last = name.trim().at(-1);
  if (!last) return '로';
  const code = last.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return '로';
  const jongseong = (code - 0xac00) % 28;
  return jongseong === 0 || jongseong === 8 ? '로' : '으로';
}

/** Screen 2 — choose the single "원픽" place used as the composite background. */
export function OnePickConfirm({
  places,
  picks,
  onePick,
  placeImageIndexes,
  onSelect,
  onBack,
  onNext,
}: OnePickConfirmProps) {
  const options: PickOption[] = picks.flatMap((id) => {
    const p = findPlaceById(places, id);
    if (!p) return [];
    const { imageUrl } = getPlaceImageSelection(p, placeImageIndexes[id] ?? 0);
    return [
      {
        id,
        title: p.name,
        description: p.region,
        image: imageUrl,
        badge: p.tags[0],
      },
    ];
  });

  const [activeId, setActiveId] = useState(onePick || picks[0] || '');
  const activePlace = findPlaceById(places, activeId);
  const activePlaceLabel = activePlace
    ? `${activePlace.name}${roParticle(activePlace.name)} 선택하기`
    : '이 장소로 선택하기';
  const selectedPlace = findPlaceById(places, onePick);
  const activeIsSelected = !!onePick && onePick === activeId;

  return (
    <div className="min-h-[calc(100dvh-var(--app-header))] px-4 pb-40 pt-7 sm:px-6 sm:pb-16 sm:pt-11">
      <div className="mx-auto max-w-[1180px]">
        <div>
          <button
            onClick={onBack}
            className="-ml-1 mb-3 inline-flex items-center gap-1 rounded-full px-1 py-1 text-[13px] font-semibold text-ink-soft hover:text-brand"
          >
            <ChevronLeft size={16} strokeWidth={2} /> 장소 다시 고르기
          </button>
          <h1 className="m-0 text-pretty text-[22px] font-extrabold leading-[1.34] -tracking-[.7px] sm:text-[28px] sm:-tracking-[1px]">
            합성에 사용할 단 하나의 <br className="sm:hidden" />
            원픽 장소를 선택해주세요.
          </h1>
          <p className="mt-3.5 text-pretty text-sm leading-[1.75] text-ink-muted">
            옆으로 넘겨 후보를 살펴보고, 딱 한 곳만 골라주세요.
            <br />
            나머지 두 곳은 코스 후보로 남습니다.
          </p>
        </div>

        <div className="mt-6 sm:mt-8">
          <OnePickCarousel
            options={options}
            value={onePick}
            onChange={onSelect}
            onActiveChange={setActiveId}
          />
        </div>

        <div className="sticky bottom-3 z-30 mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-[20px] border border-line bg-white px-4 py-3.5 shadow-bar sm:static sm:mt-10 sm:px-6 sm:py-[18px]">
          <div className="text-[15px] font-medium text-ink-muted">
            선택한 장소 ·{' '}
            <span className="font-extrabold text-ink">
              {selectedPlace?.name ?? '아직 선택하지 않았어요'}
            </span>
          </div>
          <div className="flex-1" />
          {activeIsSelected ? (
            <button
              onClick={onNext}
              className="flex h-[50px] w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand px-7 text-[15px] font-bold text-white shadow-cta hover:bg-brand-dark sm:w-auto"
            >
              이 장소로 결정하기 <ArrowRight size={18} strokeWidth={1.8} />
            </button>
          ) : (
            <button
              onClick={() => activeId && onSelect(activeId)}
              disabled={!activePlace}
              className="flex h-[50px] w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand px-7 text-[15px] font-bold text-white shadow-cta hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-fill disabled:text-ink-soft disabled:shadow-none sm:w-auto"
            >
              {activePlaceLabel}
              <ArrowRight size={18} strokeWidth={1.8} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
