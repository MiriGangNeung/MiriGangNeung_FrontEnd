import { ExternalLink } from 'lucide-react';
import type { NearbyPlace } from '../../types/domain';

export type KakaoPlacePreviewTarget = Pick<NearbyPlace, 'externalPlaceId' | 'name' | 'placeUrl'>;

type KakaoPlaceReviewButtonProps = {
  target: KakaoPlacePreviewTarget;
  onOpen: (target: KakaoPlacePreviewTarget) => void;
  compact?: boolean;
  label?: string;
  className?: string;
};

export function KakaoPlaceReviewButton({
  target,
  onOpen,
  compact = false,
  label = '리뷰 보기',
  className = '',
}: KakaoPlaceReviewButtonProps) {
  return (
    <button
      type="button"
      data-kakao-place-review-button
      onClick={() => onOpen(target)}
      aria-label={`${target.name} 카카오맵 리뷰 보기`}
      className={`inline-flex shrink-0 items-center gap-1 rounded-full font-bold text-brand transition hover:bg-brand-tint ${compact ? 'px-1.5 py-1 text-[10px]' : 'px-2 py-1 text-[11px]'} ${className}`}
    >
      <ExternalLink size={compact ? 11 : 12} /> {label}
    </button>
  );
}
