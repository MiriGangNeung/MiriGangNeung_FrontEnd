import { ArrowRight } from 'lucide-react';
import { Button } from '../atoms/Button';
import { ImageSlot } from '../atoms/ImageSlot';
import { PlaceCard } from '../molecules/PlaceCard';
import { TABS } from '../../data/places';
import type { Place } from '../../types/domain';

type BackgroundPickerProps = {
  places: Place[];
  tab: string;
  onTab: (id: string) => void;
  picks: string[];
  placeImageIndexes: Record<string, number>;
  maxPicks: number;
  onTogglePick: (id: string) => void;
  onPlaceImageIndexChange: (placeId: string, imageIndex: number) => void;
  onNext: () => void;
  isLoading?: boolean;
  isError?: boolean;
};

/** Screen 1 — pick up to 3 places. Left hero (full-bleed photo), right filter + card grid. */
export function BackgroundPicker({
  places,
  tab,
  onTab,
  picks,
  placeImageIndexes,
  maxPicks,
  onTogglePick,
  onPlaceImageIndexChange,
  onNext,
  isLoading = false,
  isError = false,
}: BackgroundPickerProps) {
  const visible = tab === 'all' || tab === 'filter' ? places : places.filter((p) => p.cat === tab);
  const heroPhoto = places.find((place) => place.thumbnailUrl)?.thumbnailUrl;

  return (
    <div className="grid min-h-[calc(100dvh-var(--app-header))] grid-cols-1 lg:grid-cols-[minmax(360px,1fr)_2.05fr]">
      <div className="relative h-[190px] overflow-hidden bg-slot sm:h-[240px] lg:sticky lg:top-[var(--app-header)] lg:h-[calc(100dvh-var(--app-header))] lg:self-start">
        <ImageSlot src={heroPhoto} alt="강릉 해안 풍경" placeholder="강릉 해안 풍경 사진" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(11,18,32,.72),rgba(11,18,32,.28)_55%,rgba(11,18,32,.55))]" />
        <div className="pointer-events-none absolute inset-x-5 top-6 text-white lg:inset-x-11 lg:top-14">
          <h1 className="text-pretty text-[26px] font-extrabold leading-[1.28] -tracking-[.8px] sm:text-[32px] lg:text-[40px] lg:-tracking-[1.2px]">
            가보고 싶은 곳을
            <br />
            최대{' '}
            <span className="border-b-[3px] border-brand-soft pb-0.5 text-brand-soft">
              {maxPicks}곳
            </span>{' '}
            찍어주세요
          </h1>
          <p className="mt-3 hidden text-[15px] leading-[1.75] text-white/80 sm:block lg:mt-[22px]">
            마음에 드는 여행지를 선택하고
            <br />
            나만의 강릉 여행을 시작해보세요.
          </p>
        </div>
      </div>

      <div className="flex min-h-[calc(100dvh-var(--app-header))] flex-col px-4 pt-5 md:px-8 md:pt-6">
        <div className="no-scrollbar mb-5 flex items-center gap-2 overflow-x-auto pb-0.5">
          {TABS.map((t) => (
            <Button key={t.id} variant="chip" onClick={() => onTab(t.id)}>
              {t.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {isLoading && (
            <div className="col-span-full py-16 text-center text-ink-soft">
              관광지를 불러오는 중이에요.
            </div>
          )}
          {isError && (
            <div className="col-span-full py-16 text-center text-coral">
              관광지 정보를 불러오지 못했어요. 백엔드 연결을 확인해주세요.
            </div>
          )}
          {!isLoading && !isError && visible.length === 0 && (
            <div className="col-span-full py-16 text-center text-ink-soft">
              표시할 관광지가 없어요.
            </div>
          )}
          {!isLoading &&
            !isError &&
            visible.map((p) => (
              <PlaceCard
                key={p.id}
                place={p}
                picked={picks.includes(p.id)}
                order={picks.indexOf(p.id) + 1}
                imageIndex={placeImageIndexes[p.id] ?? 0}
                onImageIndexChange={(imageIndex) => onPlaceImageIndexChange(p.id, imageIndex)}
                onToggle={() => onTogglePick(p.id)}
              />
            ))}
        </div>

        <div className="min-h-[28px] flex-1 pb-4" />
        <div className="sticky bottom-3 mt-[22px] flex flex-wrap items-center gap-x-6 gap-y-3 rounded-[20px] border border-line bg-white px-4 py-3.5 shadow-bar sm:bottom-[22px] sm:px-6 sm:py-[18px]">
          <div className="shrink-0 whitespace-nowrap text-base font-bold">
            선택한 장소{' '}
            <span className="text-brand">
              {picks.length}/{maxPicks}
            </span>
          </div>
          <div className="hidden text-[13px] text-ink-soft lg:block">
            최대 {maxPicks}곳까지 선택할 수 있어요. 다음 단계에서 원픽 한 곳을 고릅니다.
          </div>
          <div className="flex-1" />
          <button
            onClick={onNext}
            disabled={picks.length === 0}
            className="flex h-[50px] w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand px-7 text-[15px] font-bold text-white shadow-cta transition-colors hover:bg-brand-dark disabled:bg-fill disabled:text-ink-soft disabled:shadow-none sm:w-auto"
          >
            선택 완료 <ArrowRight size={18} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );
}
