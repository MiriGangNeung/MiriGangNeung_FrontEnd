import { KakaoPlaceReviewButton, type KakaoPlacePreviewTarget } from './KakaoPlaceReviewButton';
import type { NearbyPlace } from '../../types/domain';

type NearbyPlaceCardProps = {
  place: NearbyPlace;
  alreadyAdded: boolean;
  selected: boolean;
  showDistance?: boolean;
  onSelect: (place: NearbyPlace) => void;
  onOpenDetails: (target: KakaoPlacePreviewTarget) => void;
};

export function NearbyPlaceCard({
  place,
  alreadyAdded,
  selected,
  showDistance = true,
  onSelect,
  onOpenDetails,
}: NearbyPlaceCardProps) {
  return (
    <div
      className={`w-full rounded-lg border transition ${
        selected
          ? 'border-brand bg-brand-tint ring-2 ring-brand/10'
          : 'border-line bg-white hover:border-brand/50 hover:bg-brand-tint/40'
      } ${alreadyAdded ? 'opacity-60' : ''}`}
    >
      <button
        type="button"
        disabled={alreadyAdded}
        aria-pressed={selected}
        onClick={() => onSelect(place)}
        className={`w-full px-2.5 py-2 text-left ${alreadyAdded ? 'cursor-not-allowed' : ''}`}
      >
        <span className="flex items-start justify-between gap-2">
          <span className="min-w-0">
            <span className="block truncate font-semibold text-ink">{place.name}</span>
            <span className="mt-1 block truncate text-xs text-ink-soft">
              {place.roadAddress || place.address || '주소 정보 없음'}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-1">
            {place.recommendationScore != null && (
              <span
                data-recommendation-score
                className="rounded-full bg-brand-tint px-1.5 py-0.5 text-[10px] font-bold text-brand"
              >
                추천 {place.recommendationScore}점
              </span>
            )}
            {showDistance && place.distanceMeters != null && (
              <span className="rounded-full bg-fill px-1.5 py-0.5 text-[10px] font-bold text-brand">
                {formatDistance(place.distanceMeters)}
              </span>
            )}
          </span>
        </span>
      </button>

      <div className="flex items-center justify-between gap-2 border-t border-line/70 px-2.5 pb-1.5 pt-1.5">
        <span className="min-w-0 truncate text-[10px] text-ink-muted">
          {showDistance
            ? (place.recommendationReasons?.[0] ??
              (place.nearestStopName ? `${place.nearestStopName} 주변` : '선택 장소 주변'))
            : '강릉 전체 검색 결과'}
          {alreadyAdded && ' · 이미 코스에 있어요'}
          {!alreadyAdded && selected && ' · 지도에서 확인 중'}
        </span>
        {place.placeUrl && <KakaoPlaceReviewButton compact target={place} onOpen={onOpenDetails} />}
      </div>
    </div>
  );
}

function formatDistance(meters: number): string {
  if (meters <= 0) return '거리 미정';
  if (meters < 1000) return `${meters}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}
