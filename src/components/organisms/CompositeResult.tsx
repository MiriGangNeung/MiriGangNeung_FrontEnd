import { ArrowRight, ArrowUp, Clock, Expand, RotateCcw, Sparkles, Star } from 'lucide-react';
import { ImageSlot } from '../atoms/ImageSlot';
import { findPlace } from '../../data/places';

type CompositeResultProps = {
  onePick: string;
  onRegenerate: () => void;
  onNext: () => void;
};

/** Screen 4 — headline across the top, photo left, place info + CTAs right. */
export function CompositeResult({ onePick, onRegenerate, onNext }: CompositeResultProps) {
  const place = findPlace(onePick);

  return (
    <div className="min-h-[calc(100vh-74px)] px-6 pb-20 pt-11">
      <div className="mx-auto max-w-[1180px]">
        <h1 className="m-0 text-pretty text-[28px] font-extrabold leading-[1.34] -tracking-[1px]">
          강릉에 다녀온 내 사진이 도착했어요
        </h1>
        <p className="mt-3.5 text-pretty text-sm leading-[1.75] text-ink-muted">
          왼쪽에서 합성된 사진을 천천히 확인해보세요.
          <br />
          마음에 든다면 이제 진짜 여행 코스를 만들 차례예요!
        </p>

        <div className="mt-[30px] grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(340px,1fr)]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-slot shadow-[0_8px_28px_rgba(16,24,40,.1)]">
            <ImageSlot placeholder="AI 합성 결과 이미지" />
            <span className="pointer-events-none absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-ink/70 px-3.5 py-2 text-xs font-bold text-white backdrop-blur-[6px]">
              <Sparkles size={14} className="fill-current" /> AI 생성 이미지
            </span>
            <button
              aria-label="전체화면"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-ink/70 text-white hover:bg-ink/90"
            >
              <Expand size={17} strokeWidth={1.8} />
            </button>
          </div>

          <div className="flex flex-col gap-3.5">
            <section className="rounded-[14px] border border-line bg-white p-[22px]">
              <div className="flex items-center gap-1.5 text-[13px] font-bold text-coral">
                <Star size={14} className="fill-current" /> 원픽 장소
              </div>
              <h2 className="mt-2.5 text-[26px] font-extrabold -tracking-[.8px]">{place.name}</h2>
              <div className="mt-2 text-[13px] text-ink-soft">
                {place.region} · {place.tags.join(' · ')}
              </div>
              <p className="mt-4 text-pretty text-sm leading-[1.8] text-ink-muted">
                동해의 푸른 바다와 활기찬 항구가 어우러진 주문진 해변입니다. 싱싱한 해산물과
                아름다운 일출을 함께 즐겨보세요.
              </p>
              <div className="mt-4 flex items-center gap-3.5 border-t border-line pt-4 text-[11px] text-ink-soft">
                <span className="flex items-center gap-1.5">
                  <Clock size={13} strokeWidth={1.8} /> 생성 시각 7/30 22:19
                </span>
                <span className="flex-1" />
                <span>※ 실제 여행지와 다를 수 있습니다</span>
              </div>
            </section>

            <div className="flex items-center gap-3.5 rounded-[14px] bg-brand-tint px-5 py-[18px]">
              <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px] bg-white text-brand">
                <Sparkles size={19} strokeWidth={1.8} />
              </span>
              <div>
                <div className="text-sm font-bold">이번엔 실제로 이 장소로 떠나볼까요?</div>
                <div className="mt-1 text-[13px] leading-[1.6] text-ink-muted">
                  이 장소와 나머지 후보를 포함해{' '}
                  <strong className="font-bold text-brand">나만의 강릉 코스</strong>를 만들어
                  드려요.
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={onNext}
                className="flex h-[54px] w-full items-center justify-center gap-2 rounded-full bg-brand text-base font-bold text-white shadow-cta hover:bg-brand-dark"
              >
                <Sparkles size={18} strokeWidth={1.8} /> 코스 생성하러 가기{' '}
                <ArrowRight size={18} strokeWidth={1.8} />
              </button>
              <button
                onClick={onRegenerate}
                className="flex h-[50px] w-full items-center justify-center gap-2 rounded-full border border-line bg-white text-[15px] font-semibold text-ink-muted hover:border-brand hover:text-brand"
              >
                <RotateCcw size={17} strokeWidth={1.8} /> 다시 생성하기
              </button>
              <button className="flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold text-ink-soft hover:text-brand">
                <ArrowUp size={16} strokeWidth={1.8} /> 이미지 저장 · 공유
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
