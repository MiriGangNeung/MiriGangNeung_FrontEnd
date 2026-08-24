import { ArrowRight, Check, RotateCcw, Star } from 'lucide-react';
import { ImageSlot } from '../atoms/ImageSlot';
import { Tag } from '../atoms/Tag';
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
  const selectedPlace = findPlaceById(places, onePick);

  return (
    <div className="min-h-[calc(100vh-74px)] px-6 pt-11">
      <div className="mx-auto max-w-[1040px]">
        <div className="flex items-end gap-6">
          <div>
            <h1 className="m-0 text-3xl font-extrabold leading-[1.35] -tracking-[.9px]">
              합성에 사용할 단 하나의
              <br />
              원픽 장소를 선택해주세요.
            </h1>
            <p className="mt-3.5 text-sm text-ink-muted">
              원픽 장소의 배경 위에 내 사진이 합성돼요. 나머지 두 곳은 코스 후보로 남습니다.
            </p>
          </div>
          <div className="flex-1" />
          <button
            onClick={onBack}
            className="flex h-11 items-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-semibold text-ink-muted hover:border-brand hover:text-brand"
          >
            <RotateCcw size={17} strokeWidth={1.8} /> 장소 다시 고르기
          </button>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-6">
          {picks.map((id) => {
            const p = findPlaceById(places, id);
            if (!p) return null;
            const selected = onePick === id;
            const imageSelection = getPlaceImageSelection(p, placeImageIndexes[id] ?? 0);
            return (
              <div
                key={id}
                role="radio"
                aria-checked={selected}
                tabIndex={0}
                onClick={() => onSelect(id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(id)}
                className="relative cursor-pointer overflow-hidden rounded-[20px] border border-line bg-white transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div className="relative aspect-[4/3] bg-fill">
                  <ImageSlot src={imageSelection.imageUrl} alt={p.name} placeholder="사진" />
                  {selected && (
                    <>
                      <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-coral px-3 py-1.5 text-xs font-bold text-white shadow-[0_2px_8px_rgba(16,24,40,.25)]">
                        <Star size={13} className="fill-current" /> 원픽
                      </span>
                      <span className="absolute right-3 top-3 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-ok text-white shadow-[0_2px_8px_rgba(16,24,40,.25)]">
                        <Check size={16} strokeWidth={2.6} />
                      </span>
                    </>
                  )}
                </div>
                <div className="px-5 pb-5 pt-[18px]">
                  <div className="text-xl font-extrabold -tracking-[.5px]">{p.name}</div>
                  <div className="mt-1.5 text-[13px] text-ink-soft">{p.region}</div>
                  <div className="mt-3.5 flex gap-1.5">
                    {p.tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                  <div
                    className={`mt-[18px] flex h-[46px] items-center justify-center gap-2 rounded-full text-sm ${
                      selected
                        ? 'bg-brand font-bold text-white'
                        : 'border border-line bg-white font-semibold text-ink-muted'
                    }`}
                  >
                    {selected && <Check size={16} strokeWidth={2.4} />}
                    {selected ? '원픽 선택됨' : '원픽으로 선택'}
                  </div>
                </div>
                {selected && (
                  <span className="pointer-events-none absolute inset-0 rounded-[20px] border-[2.5px] border-brand shadow-[0_10px_30px_rgba(47,111,237,.22)]" />
                )}
              </div>
            );
          })}
        </div>

        <div className="sticky bottom-6 my-[34px] flex items-center gap-5 rounded-[20px] border border-line bg-white px-6 py-[18px] shadow-bar">
          <div className="text-[15px] font-medium text-ink-muted">
            선택한 장소 ·{' '}
            <span className="font-extrabold text-ink">
              {selectedPlace?.name ?? '아직 선택하지 않았어요'}
            </span>
          </div>
          <div className="flex-1" />
          <button
            onClick={onNext}
            disabled={!selectedPlace}
            className="flex h-[50px] items-center gap-2 rounded-full bg-brand px-7 text-[15px] font-bold text-white shadow-cta hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-fill disabled:text-ink-soft disabled:shadow-none"
          >
            이 장소로 결정하기 <ArrowRight size={18} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );
}
