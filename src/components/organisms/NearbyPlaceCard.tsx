import { KakaoPlaceReviewButton, type KakaoPlacePreviewTarget } from './KakaoPlaceReviewButton';
import type { NearbyPlace } from '../../types/domain';

type NearbyPlaceCardProps = {
  place: NearbyPlace;
  alreadyAdded: boolean;
  selected: boolean;
  onSelect: (place: NearbyPlace) => void;
  onOpenDetails: (target: KakaoPlacePreviewTarget) => void;
};

export function NearbyPlaceCard({
  place,
  alreadyAdded,
  selected,
  onSelect,
  onOpenDetails,
}: NearbyPlaceCardProps) {
  return (
    <div
      className={`w-full rounded-xl border transition ${
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
        className={`w-full p-3 text-left ${alreadyAdded ? 'cursor-not-allowed' : ''}`}
      >
        <span className="flex items-start justify-between gap-2">
          <span className="min-w-0">
            <span className="block truncate font-semibold text-ink">{place.name}</span>
            <span className="mt-1 block truncate text-xs text-ink-soft">
              {place.roadAddress || place.address || '주소 정보 없음'}
            </span>
          </span>
          <span className="shrink-0 rounded-full bg-fill px-2 py-1 text-[11px] font-bold text-brand">
            {formatDistance(place.distanceMeters)}
          </span>
        </span>
      </button>

      <div className="flex items-center justify-between gap-2 border-t border-line/70 px-3 pb-2.5 pt-2">
        <span className="min-w-0 truncate text-[11px] text-ink-muted">
          {place.nearestStopName ? `${place.nearestStopName} 주변` : '선택 장소 주변'}
          {alreadyAdded && ' · 이미 코스에 있어요'}
          {!alreadyAdded && selected && ' · 지도에서 확인 중'}
        </span>
        {place.placeUrl && <KakaoPlaceReviewButton target={place} onOpen={onOpenDetails} />}
      </div>
    </div>
  );
}

function formatDistance(meters: number): string {
  if (meters <= 0) return '거리 미정';
  if (meters < 1000) return `${meters}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}
