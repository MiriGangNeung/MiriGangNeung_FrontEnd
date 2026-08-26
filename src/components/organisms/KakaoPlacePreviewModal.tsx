import { ExternalLink, LoaderCircle, X } from 'lucide-react';
import { useEffect, useState, type MouseEvent } from 'react';
import type { KakaoPlacePreviewTarget } from './KakaoPlaceReviewButton';

type KakaoPlacePreviewModalProps = {
  place: KakaoPlacePreviewTarget;
  onClose: () => void;
};

export function KakaoPlacePreviewModal({ place, onClose }: KakaoPlacePreviewModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasFrameError, setHasFrameError] = useState(false);
  const title = `${place.name} 카카오맵 상세 정보`;

  useEffect(() => {
    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  useEffect(() => {
    setIsLoading(true);
    setHasFrameError(false);
  }, [place.externalPlaceId]);

  function closeOnBackdrop(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <div
      data-kakao-place-modal
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-ink/55 p-4 backdrop-blur-[2px] sm:p-6"
      onMouseDown={closeOnBackdrop}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative z-10 flex h-[min(88vh,760px)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_70px_rgba(16,24,40,.28)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[11px] font-bold tracking-[.08em] text-brand">KAKAOMAP</p>
            <h2 className="mt-1 truncate text-base font-extrabold text-ink sm:text-lg">
              {place.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="카카오맵 상세 정보 닫기"
            className="shrink-0 rounded-full p-2 text-ink-muted transition hover:bg-fill hover:text-ink"
          >
            <X size={20} />
          </button>
        </header>

        <div className="relative min-h-0 flex-1 bg-fill">
          {isLoading && !hasFrameError && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center gap-2 bg-fill/90 text-sm font-semibold text-ink-muted">
              <LoaderCircle size={18} className="animate-spin text-brand" />
              카카오맵 상세 정보를 불러오는 중...
            </div>
          )}

          {hasFrameError ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <p className="text-sm font-bold text-ink">이 장소 정보를 인뷰로 열 수 없어요.</p>
              <p className="mt-2 text-xs leading-6 text-ink-muted">
                카카오맵에서 장소 정보와 리뷰를 확인해 주세요.
              </p>
              <KakaoPlaceExternalLink href={place.placeUrl} className="mt-5" />
            </div>
          ) : (
            <iframe
              src={place.placeUrl}
              title={title}
              loading="eager"
              referrerPolicy="strict-origin-when-cross-origin"
              className="h-full w-full border-0"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasFrameError(true);
              }}
            />
          )}
        </div>

        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-line px-5 py-3 sm:px-6">
          <p className="min-w-0 truncate text-[11px] text-ink-muted">
            카카오맵 상세 페이지에서 리뷰를 확인할 수 있어요.
          </p>
          <KakaoPlaceExternalLink href={place.placeUrl} />
        </footer>
      </section>
    </div>
  );
}

function KakaoPlaceExternalLink({ href, className = '' }: { href: string; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-tint px-3 py-2 text-xs font-bold text-brand transition hover:bg-brand hover:text-white ${className}`}
    >
      카카오맵에서 새 탭으로 열기 <ExternalLink size={13} />
    </a>
  );
}
