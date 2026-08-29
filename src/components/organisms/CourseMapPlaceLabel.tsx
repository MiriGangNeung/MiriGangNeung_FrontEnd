import { MapPin, Plus } from 'lucide-react';
import { KakaoPlaceReviewButton } from './KakaoPlaceReviewButton';
import type { CourseStop, NearbyPlace } from '../../types/domain';

type CourseMapStopLabelProps = {
  number: number;
  stop: Pick<CourseStop, 'name' | 'thumbnailUrl'>;
  onSelect: () => void;
};

type CourseMapNearbyPlaceLabelProps = {
  place: NearbyPlace;
  selected: boolean;
  onSelect: () => void;
  onReview: (place: NearbyPlace) => void;
  onAdd: (place: NearbyPlace) => void;
};

const CATEGORY_LABELS: Record<NearbyPlace['category'], string> = {
  cafe: '카페',
  restaurant: '음식점',
  culture: '문화시설',
  attraction: '관광명소',
};

export function CourseMapStopLabel({ number, stop, onSelect }: CourseMapStopLabelProps) {
  return (
    <button
      type="button"
      data-map-course-stop-label
      onClick={onSelect}
      className="flex max-w-[180px] items-center gap-1.5 rounded-xl border border-white/90 bg-white/95 p-1 pr-2 text-left shadow-[0_5px_16px_rgba(16,24,40,.18)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(16,24,40,.22)]"
      aria-label={`${stop.name} 지도에서 보기`}
    >
      <span
        data-map-course-stop-number
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-extrabold text-white"
      >
        {number}
      </span>
      <span className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-slot">
        {stop.thumbnailUrl ? (
          <img
            src={stop.thumbnailUrl}
            alt={stop.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[9px] font-bold text-ink-muted">
            사진 없음
          </span>
        )}
      </span>
      <span className="min-w-0 truncate text-[11px] font-extrabold text-ink">{stop.name}</span>
    </button>
  );
}

export function CourseMapNearbyPlaceLabel({
  place,
  selected,
  onSelect,
  onReview,
  onAdd,
}: CourseMapNearbyPlaceLabelProps) {
  if (!selected) {
    return (
      <button
        type="button"
        data-map-nearby-place-label
        onClick={onSelect}
        className="flex max-w-[170px] items-center gap-1.5 rounded-full border border-white/90 bg-white/95 px-2 py-1 text-left shadow-[0_4px_12px_rgba(16,24,40,.15)] transition hover:-translate-y-0.5 hover:border-brand/40"
        aria-label={`${place.name} 선택`}
      >
        <span className="h-2 w-2 shrink-0 rounded-full bg-brand" aria-hidden="true" />
        <span className="min-w-0 truncate text-[10px] font-bold text-ink">{place.name}</span>
      </button>
    );
  }

  return (
    <div
      data-map-nearby-place-card
      role="dialog"
      aria-label={`${place.name} 장소 정보`}
      className="w-[220px] rounded-xl border border-brand/20 bg-white/95 p-2 shadow-[0_10px_24px_rgba(16,24,40,.2)] backdrop-blur"
    >
      <div className="flex min-w-0 items-start gap-2">
        <span
          data-map-place-fallback
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-tint text-brand"
          aria-label={`${CATEGORY_LABELS[place.category]} 아이콘`}
        >
          <MapPin size={16} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-xs font-extrabold text-ink">{place.name}</span>
          <span className="mt-0.5 block truncate text-[10px] text-ink-muted">
            {place.roadAddress || place.address || '주소 정보 없음'}
          </span>
        </span>
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-1 border-t border-line/70 pt-1.5">
        <span className="min-w-0 truncate text-[10px] font-semibold text-ink-muted">
          {CATEGORY_LABELS[place.category]}
          {place.recommendationScore != null && ` · 추천 ${place.recommendationScore}점`}
          {place.distanceMeters != null && ` · ${formatDistance(place.distanceMeters)}`}
        </span>
        <span className="flex shrink-0 items-center gap-0.5">
          {place.placeUrl && (
            <KakaoPlaceReviewButton
              target={place}
              onOpen={() => onReview(place)}
              compact
              label="리뷰"
            />
          )}
          <button
            type="button"
            data-map-nearby-place-add
            onClick={() => onAdd(place)}
            className="inline-flex items-center gap-0.5 rounded-full bg-brand px-1.5 py-1 text-[10px] font-bold text-white transition hover:bg-brand-dark"
          >
            <Plus size={11} /> 코스에 추가
          </button>
        </span>
      </div>
    </div>
  );
}

function formatDistance(meters: number): string {
  if (meters <= 0) return '거리 미정';
  if (meters < 1000) return `${meters}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}
