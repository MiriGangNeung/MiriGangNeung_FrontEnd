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
  maxPicks: number;
  onTogglePick: (id: string) => void;
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
  maxPicks,
  onTogglePick,
  onNext,
  isLoading = false,
  isError = false,
}: BackgroundPickerProps) {
  const visible = tab === 'all' || tab === 'filter' ? places : places.filter((p) => p.cat === tab);
  const heroPhoto = places.find((place) => place.thumbnailUrl)?.thumbnailUrl;

  return (
    <div className="grid min-h-[calc(100vh-74px)] grid-cols-1 lg:grid-cols-[minmax(360px,1fr)_2.05fr]">
      <div className="relative overflow-hidden bg-slot">
        <ImageSlot src={heroPhoto} alt="강릉 해안 풍경" placeholder="강릉 해안 풍경 사진" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(11,18,32,.72),rgba(11,18,32,.28)_55%,rgba(11,18,32,.55))]" />
        <div className="pointer-events-none absolute inset-x-11 top-14 text-white">
          <h1 className="text-pretty text-[40px] font-extrabold leading-[1.28] -tracking-[1.2px]">
            가보고 싶은 곳을
            <br />
            최대{' '}
            <span className="border-b-[3px] border-brand-soft pb-0.5 text-brand-soft">
              {maxPicks}곳
            </span>{' '}
            찍어주세요
          </h1>
          <p className="mt-[22px] text-[15px] leading-[1.75] text-white/80">
            마음에 드는 여행지를 선택하고
            <br />
            나만의 강릉 여행을 시작해보세요.
          </p>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-74px)] flex-col px-8 pt-6">
        <div className="mb-5 flex items-center gap-2 overflow-x-auto pb-0.5">
          {TABS.map((t) => (
            <Button key={t.id} variant="chip" active={tab === t.id} onClick={() => onTab(t.id)}>
              {t.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-5">
          {isLoading && (
            <div className="col-span-3 py-16 text-center text-ink-soft">
              관광지를 불러오는 중이에요.
            </div>
          )}
          {isError && (
            <div className="col-span-3 py-16 text-center text-coral">
              관광지 정보를 불러오지 못했어요. 백엔드 연결을 확인해주세요.
            </div>
          )}
          {!isLoading && !isError && visible.length === 0 && (
            <div className="col-span-3 py-16 text-center text-ink-soft">
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
                onToggle={() => onTogglePick(p.id)}
              />
            ))}
        </div>

        <div className="min-h-[28px] flex-1" />
        <div className="sticky bottom-[22px] mt-[22px] flex items-center gap-6 rounded-[20px] border border-line bg-white px-6 py-[18px] shadow-bar">
          <div className="text-base font-bold">
            선택한 장소{' '}
            <span className="text-brand">
              {picks.length}/{maxPicks}
            </span>
          </div>
          <div className="text-[13px] text-ink-soft">
            최대 {maxPicks}곳까지 선택할 수 있어요. 다음 단계에서 원픽 한 곳을 고릅니다.
          </div>
          <div className="flex-1" />
          <button
            onClick={onNext}
            disabled={picks.length === 0}
            className="flex h-[50px] items-center gap-2 rounded-full bg-brand px-7 text-[15px] font-bold text-white shadow-cta transition-colors hover:bg-brand-dark disabled:bg-fill disabled:text-ink-soft disabled:shadow-none"
          >
            선택 완료 <ArrowRight size={18} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );
}
