import { ArrowRight, Clock, Download, Expand, RotateCcw, Sparkles, Star, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ImageSlot } from '../atoms/ImageSlot';
import { downloadImage } from '../../lib/downloadImage';
import type { Place } from '../../types/domain';

type CompositeResultProps = {
  place?: Place;
  imageUrl?: string;
  onRegenerate: () => void;
  onNext: () => void;
};

/** Screen 4 — headline across the top, photo left, place info + CTAs right. */
export function CompositeResult({ place, imageUrl, onRegenerate, onNext }: CompositeResultProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  // Match the frame to the generated image's real proportions (default: the 4:5 request ratio).
  const [imageAspectRatio, setImageAspectRatio] = useState('4 / 5');

  useEffect(() => {
    if (!isZoomed) return;
    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') setIsZoomed(false);
    }
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isZoomed]);

  async function handleSave() {
    if (!imageUrl || isSaving) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await downloadImage(imageUrl, `미리강릉-${place?.name ?? '합성사진'}.png`);
    } catch {
      setSaveError('이미지를 저장하지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-[calc(100dvh-var(--app-header))] px-4 pb-16 pt-7 sm:px-6 sm:pb-20 sm:pt-11">
      <div className="mx-auto max-w-[1180px]">
        <h1 className="m-0 text-[22px] font-extrabold -tracking-[.5px] sm:text-[26px] sm:-tracking-[.7px]">
          강릉에 다녀온 내 사진이 도착했어요
        </h1>
        <p className="mt-2.5 text-sm text-ink-muted">
          합성된 사진을 천천히 확인해보세요. 마음에 든다면 이제 진짜 여행 코스를 만들 차례예요!
        </p>

        <div className="mt-6 grid grid-cols-1 items-start gap-5 sm:mt-[30px] sm:gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(340px,1fr)]">
          <div
            className="relative mx-auto w-full max-w-[340px] self-start overflow-hidden rounded-[14px] bg-slot shadow-[0_8px_28px_rgba(16,24,40,.1)] sm:max-w-[420px] lg:mx-0"
            style={{ aspectRatio: imageAspectRatio }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="AI 합성 결과 이미지"
                onLoad={(event) => {
                  const { naturalWidth, naturalHeight } = event.currentTarget;
                  if (naturalWidth > 0 && naturalHeight > 0) {
                    setImageAspectRatio(`${naturalWidth} / ${naturalHeight}`);
                  }
                }}
                className="h-full w-full object-cover"
              />
            ) : (
              <ImageSlot placeholder="AI 합성 결과 이미지" />
            )}
            <span className="pointer-events-none absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-ink/70 px-3.5 py-2 text-xs font-bold text-white backdrop-blur-[6px]">
              <Sparkles size={14} className="fill-current" /> AI 생성 이미지
            </span>
            <button
              type="button"
              onClick={() => setIsZoomed(true)}
              disabled={!imageUrl}
              aria-label="전체화면"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-ink/70 text-white hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Expand size={17} strokeWidth={1.8} />
            </button>
          </div>

          <div className="flex flex-col gap-3.5">
            <section className="rounded-[14px] border border-line bg-white p-5 sm:p-[22px]">
              <div className="flex items-center gap-1.5 text-[13px] font-bold text-coral">
                <Star size={14} className="fill-current" /> 원픽 장소
              </div>
              <h2 className="mt-2.5 text-[22px] font-extrabold -tracking-[.6px] sm:text-[26px] sm:-tracking-[.8px]">
                {place?.name ?? '선택한 장소'}
              </h2>
              <div className="mt-2 text-[13px] text-ink-soft">
                {place
                  ? `${place.region} · ${place.tags.join(' · ')}`
                  : '장소 정보를 불러오는 중이에요.'}
              </div>
              <p className="mt-4 text-pretty text-sm leading-[1.8] text-ink-muted">
                동해의 푸른 바다와 활기찬 항구가 어우러진 주문진 해변입니다. 싱싱한 해산물과
                아름다운 일출을 함께 즐겨보세요.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 border-t border-line pt-4 text-[11px] text-ink-soft">
                <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap">
                  <Clock size={13} strokeWidth={1.8} /> 생성 시각 7/30 22:19
                </span>
                <span className="hidden flex-1 sm:block" />
                <span>※ 실제 여행지와 다를 수 있습니다</span>
              </div>
            </section>

            <div className="flex items-center gap-3.5 rounded-[14px] bg-brand-tint px-4 py-4 sm:px-5 sm:py-[18px]">
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
                className="flex h-[54px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand text-base font-bold text-white shadow-cta hover:bg-brand-dark"
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
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={!imageUrl || isSaving}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold text-ink-soft hover:text-brand disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-ink-soft"
              >
                <Download size={16} strokeWidth={1.8} /> {isSaving ? '저장 중...' : '이미지 저장'}
              </button>
              {saveError && (
                <p className="text-center text-xs text-coral" role="alert">
                  {saveError}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {isZoomed && imageUrl && (
        <div
          className="fixed inset-0 z-[1200] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-[2px] sm:p-8"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsZoomed(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label="합성 결과 이미지 확대"
        >
          <img
            src={imageUrl}
            alt="AI 합성 결과 이미지 확대"
            className="max-h-full max-w-full rounded-lg object-contain shadow-[0_24px_70px_rgba(0,0,0,.5)]"
          />
          <button
            type="button"
            onClick={() => setIsZoomed(false)}
            aria-label="확대 이미지 닫기"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink hover:bg-white"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
