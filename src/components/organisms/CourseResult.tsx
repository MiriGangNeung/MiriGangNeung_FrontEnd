import {
  Clock,
  Coffee,
  GripVertical,
  MapPin,
  Plus,
  Sparkles,
  Star,
  Trash2,
  Utensils,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { CourseMap } from './CourseMap';
import { ImageSlot } from '../atoms/ImageSlot';
import { CROWD_LABEL, COMPANIONS, DURATIONS, TRIP_TYPES } from '../../data/places';
import { findPlaceById } from '../../lib/placeLookup';
import type {
  CourseRouteSegment,
  CourseStop,
  NearbyPlace,
  NearbyPlaceCategory,
  Place,
} from '../../types/domain';

type CourseResultProps = {
  places: Place[];
  courseStops: CourseStop[];
  mapStops: CourseStop[];
  routeSegments: CourseRouteSegment[];
  routeStatus: 'READY' | 'UNAVAILABLE';
  onePick: string;
  types: string[];
  companion: string;
  duration: string;
  totalDistanceMeters: number;
  totalTravelMinutes: number;
  activeStop: number;
  nearbyCategory: NearbyPlaceCategory;
  nearbyPlaces: NearbyPlace[];
  isNearbyLoading: boolean;
  nearbyError: string | null;
  onPlaceAdderOpenChange: (open: boolean) => void;
  onNearbyCategory: (category: NearbyPlaceCategory) => void;
  onActiveStop: (index: number) => void;
  onPreviewPlace: (place: NearbyPlace | null) => void;
  onAddPlace: (place: NearbyPlace) => Promise<void>;
  onDeleteStop: (stopId: string) => Promise<void>;
  onReorder: (stopIds: string[]) => Promise<void>;
  onBack: () => void;
};

/** Screen 6 — backend-backed itinerary with nearby-place tabs and stop management. */
export function CourseResult({
  places,
  courseStops,
  mapStops,
  routeSegments,
  routeStatus,
  onePick,
  types,
  companion,
  duration,
  totalDistanceMeters,
  totalTravelMinutes,
  activeStop,
  nearbyCategory,
  nearbyPlaces,
  isNearbyLoading,
  nearbyError,
  onPlaceAdderOpenChange,
  onNearbyCategory,
  onActiveStop,
  onPreviewPlace,
  onAddPlace,
  onDeleteStop,
  onReorder,
  onBack,
}: CourseResultProps) {
  const [isPlaceAdderOpen, setIsPlaceAdderOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<NearbyPlace | null>(null);
  const [draggingStopId, setDraggingStopId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const onePickPlace = findPlaceById(places, onePick);
  const onePickStop = courseStops.find((stop) => stop.onePick);
  const tags = [
    `원픽 ${onePickPlace?.name ?? onePickStop?.name ?? '선택한 장소'}`,
    TRIP_TYPES.filter((t) => types.includes(t.id))
      .map((t) => t.label)
      .join(' · '),
    COMPANIONS.find((c) => c.id === companion)?.label,
    DURATIONS.find((d) => d.id === duration)?.label,
    totalDistanceMeters > 0
      ? `도보 ${formatDistance(totalDistanceMeters)} · ${totalTravelMinutes}분`
      : '도보 거리 확인 중',
  ].filter(Boolean);

  function closePlaceAdder() {
    setIsPlaceAdderOpen(false);
    setSelectedPlace(null);
    setActionError(null);
    onPlaceAdderOpenChange(false);
    onPreviewPlace(null);
  }

  function selectPlace(place: NearbyPlace) {
    if (courseStops.some((stop) => stop.externalPlaceId === place.externalPlaceId)) return;
    setSelectedPlace(place);
    setActionError(null);
    onPreviewPlace(place);
  }

  async function confirmPlace() {
    if (!selectedPlace) return;
    try {
      await onAddPlace(selectedPlace);
      closePlaceAdder();
    } catch {
      setActionError('장소를 코스에 추가하지 못했어요. 잠시 후 다시 시도해 주세요.');
    }
  }

  async function deleteStop(stop: CourseStop) {
    if (stop.onePick) return;
    try {
      await onDeleteStop(stop.id);
    } catch {
      setActionError('장소를 삭제하지 못했어요. 잠시 후 다시 시도해 주세요.');
    }
  }

  async function dropStop(targetStopId: string) {
    if (!draggingStopId || draggingStopId === targetStopId) return;
    const currentIndex = courseStops.findIndex((stop) => stop.id === draggingStopId);
    const targetIndex = courseStops.findIndex((stop) => stop.id === targetStopId);
    if (currentIndex < 0 || targetIndex < 0) return;

    const next = [...courseStops];
    const [moved] = next.splice(currentIndex, 1);
    next.splice(targetIndex, 0, moved);
    setDraggingStopId(null);
    try {
      await onReorder(next.map((stop) => stop.id));
    } catch {
      setActionError('코스 순서를 저장하지 못했어요. 잠시 후 다시 시도해 주세요.');
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-74px)] grid-cols-1 lg:h-[calc(100vh-74px)] lg:grid-cols-[minmax(420px,40fr)_60fr]">
      <div className="overflow-y-auto border-r border-line bg-canvas px-[26px] pb-32 pt-[26px]">
        <h1 className="m-0 text-[22px] font-extrabold -tracking-[.6px]">나만의 강릉 코스</h1>
        <p className="mt-2 text-[13px] text-ink-soft">
          {durationLabel(duration)} · 총 {courseStops.length}곳 ·{' '}
          {formatDistance(totalDistanceMeters)} 이동
        </p>
        <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="shrink-0 whitespace-nowrap rounded-full bg-brand-tint px-3 py-1.5 text-xs font-semibold text-brand"
            >
              {tag}
            </span>
          ))}
        </div>

        {isPlaceAdderOpen && (
          <section
            className="mt-5 rounded-2xl border border-brand/20 bg-white p-4 shadow-[0_10px_28px_rgba(47,111,237,.12)]"
            aria-label="주변 장소 추가"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-bold">주변 장소 추가</h2>
                <p className="mt-1 text-xs text-ink-soft">
                  선택한 관광지 3곳 주변의 장소를 가까운 순서로 보여드려요.
                </p>
              </div>
              <button
                type="button"
                onClick={closePlaceAdder}
                className="rounded-full p-1.5 text-ink-muted hover:bg-fill hover:text-ink"
                aria-label="장소 추가 닫기"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-fill p-1" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={nearbyCategory === 'cafe'}
                onClick={() => onNearbyCategory('cafe')}
                className={`flex h-10 items-center justify-center gap-1.5 rounded-lg text-sm font-bold ${nearbyCategory === 'cafe' ? 'bg-white text-brand shadow-sm' : 'text-ink-muted'}`}
              >
                <Coffee size={15} /> 카페
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={nearbyCategory === 'restaurant'}
                onClick={() => onNearbyCategory('restaurant')}
                className={`flex h-10 items-center justify-center gap-1.5 rounded-lg text-sm font-bold ${nearbyCategory === 'restaurant' ? 'bg-white text-brand shadow-sm' : 'text-ink-muted'}`}
              >
                <Utensils size={15} /> 음식점
              </button>
            </div>

            <div className="mt-3 max-h-[420px] space-y-2 overflow-y-auto pr-1">
              {isNearbyLoading ? (
                <p className="rounded-xl bg-fill px-3 py-8 text-center text-sm text-ink-muted">
                  주변 장소를 찾는 중...
                </p>
              ) : nearbyError ? (
                <p className="rounded-xl bg-coral-tint px-3 py-8 text-center text-sm text-coral">
                  주변 장소를 불러오지 못했어요. 백엔드의 KAKAO_API_KEY를 확인해 주세요.
                </p>
              ) : nearbyPlaces.length === 0 ? (
                <p className="rounded-xl bg-fill px-3 py-8 text-center text-sm text-ink-muted">
                  선택한 관광지 2km 안에 장소가 없어요.
                </p>
              ) : (
                nearbyPlaces.map((place) => {
                  const alreadyAdded = courseStops.some(
                    (stop) => stop.externalPlaceId === place.externalPlaceId,
                  );
                  const selected = selectedPlace?.externalPlaceId === place.externalPlaceId;
                  return (
                    <button
                      key={place.externalPlaceId}
                      type="button"
                      disabled={alreadyAdded}
                      onClick={() => selectPlace(place)}
                      className={`w-full rounded-xl border p-3 text-left transition ${
                        selected
                          ? 'border-brand bg-brand-tint ring-2 ring-brand/10'
                          : 'border-line bg-white hover:border-brand/50 hover:bg-brand-tint/40'
                      } ${alreadyAdded ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      <span className="flex items-start justify-between gap-2">
                        <span className="min-w-0">
                          <span className="block truncate font-semibold text-ink">
                            {place.name}
                          </span>
                          <span className="mt-1 block truncate text-xs text-ink-soft">
                            {place.roadAddress || place.address || '주소 정보 없음'}
                          </span>
                        </span>
                        <span className="shrink-0 rounded-full bg-fill px-2 py-1 text-[11px] font-bold text-brand">
                          {formatDistance(place.distanceMeters)}
                        </span>
                      </span>
                      <span className="mt-2 flex items-center justify-between gap-2 text-[11px] text-ink-muted">
                        <span>
                          {place.nearestStopName
                            ? `${place.nearestStopName} 주변`
                            : '선택 장소 주변'}
                        </span>
                        {alreadyAdded ? '이미 코스에 있어요' : selected ? '지도에서 확인 중' : ''}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {actionError && <p className="mt-3 text-xs font-semibold text-coral">{actionError}</p>}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={closePlaceAdder}
                className="h-10 flex-1 rounded-xl border border-line text-sm font-semibold text-ink-muted hover:bg-fill"
              >
                취소
              </button>
              <button
                type="button"
                disabled={!selectedPlace}
                onClick={() => void confirmPlace()}
                className="h-10 flex-1 rounded-xl bg-brand text-sm font-bold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-muted"
              >
                코스에 추가
              </button>
            </div>
          </section>
        )}

        <ol className="mt-[22px]">
          {courseStops.map((stop, index) => {
            const active = activeStop === index;
            const crowd = CROWD_LABEL[stop.crowd];
            return (
              <li
                key={stop.id}
                draggable
                onDragStart={() => setDraggingStopId(stop.id)}
                onDragEnd={() => setDraggingStopId(null)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => void dropStop(stop.id)}
                className="flex gap-3.5"
              >
                <span className="flex w-[30px] shrink-0 flex-col items-center">
                  <span
                    className={`flex h-[30px] w-[30px] items-center justify-center rounded-full text-sm font-bold ${
                      active
                        ? 'bg-brand-dark text-white ring-[5px] ring-brand/15'
                        : 'border-[1.5px] border-line bg-white text-ink-muted'
                    }`}
                  >
                    {stop.n}
                  </span>
                  {index < courseStops.length - 1 && (
                    <span className="my-1.5 min-h-[34px] flex-1 border-l-2 border-dashed border-line-dashed" />
                  )}
                </span>

                <div
                  className={`relative mb-3.5 flex flex-1 gap-3.5 rounded-2xl border bg-white p-4 text-left transition hover:shadow-[0_8px_22px_rgba(16,24,40,.1)] ${draggingStopId === stop.id ? 'border-brand opacity-60' : 'border-line'} ${active ? 'ring-2 ring-brand/15' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => onActiveStop(index)}
                    className="flex min-w-0 flex-1 gap-3.5 text-left"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-brand">{stop.time}</span>
                        {stop.onePick && (
                          <span className="flex items-center gap-1 rounded-full bg-coral-tint px-2 py-0.5 text-[11px] font-bold text-coral">
                            <Star size={10} className="fill-current" /> 원픽
                          </span>
                        )}
                        {stop.external && (
                          <span className="rounded-full bg-fill px-2 py-0.5 text-[11px] font-bold text-ink-muted">
                            {stop.category === 'cafe' ? '카페' : '음식점'}
                          </span>
                        )}
                      </span>
                      <span className="mt-1.5 block text-base font-bold -tracking-[.3px]">
                        {stop.name}
                      </span>
                      <span className="mt-1.5 block text-xs leading-[1.6] text-ink-soft">
                        {stop.external && stop.address ? stop.address : stop.note}
                      </span>
                      <span className="mt-2.5 flex items-center gap-1.5">
                        <span className="flex items-center gap-1 rounded-full bg-fill px-2 py-1 text-[11px] font-semibold text-ink-muted">
                          <Clock size={12} strokeWidth={2} /> {stop.stay}
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 text-[11px] font-bold ${crowd.className}`}
                        >
                          {crowd.text}
                        </span>
                      </span>
                    </span>
                    <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-fill">
                      <ImageSlot src={stop.thumbnailUrl} alt={stop.name} placeholder="사진" />
                    </span>
                  </button>
                  <button
                    type="button"
                    disabled={stop.onePick}
                    onClick={() => void deleteStop(stop)}
                    title={stop.onePick ? '원픽 장소는 삭제할 수 없어요' : '장소 삭제'}
                    aria-label={`${stop.name} 삭제`}
                    className="absolute right-2 top-2 rounded-full p-1.5 text-ink-muted hover:bg-coral-tint hover:text-coral disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Trash2 size={15} />
                  </button>
                  <span className="pointer-events-none absolute bottom-2 right-2 text-ink-muted/50">
                    <GripVertical size={15} />
                  </span>
                </div>
              </li>
            );
          })}
        </ol>

        <button
          type="button"
          onClick={() => {
            setIsPlaceAdderOpen(true);
            setActionError(null);
            onPlaceAdderOpenChange(true);
          }}
          className="ml-11 flex h-[52px] w-[calc(100%-44px)] items-center justify-center gap-2 rounded-[14px] border-[1.5px] border-dashed border-line-dashed bg-white text-sm font-semibold text-ink-muted hover:border-brand hover:text-brand"
        >
          <Plus size={17} strokeWidth={1.8} /> 새로운 장소 추가
        </button>
      </div>

      <div className="relative h-[420px] bg-slot lg:h-full">
        <CourseMap
          courseStops={mapStops}
          routeSegments={routeSegments}
          routeStatus={routeStatus}
          activeIndex={activeStop}
          onSelect={onActiveStop}
        />
        <div className="pointer-events-none absolute left-[18px] top-[18px] z-[500] flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-2.5 text-xs font-semibold text-ink-muted shadow-[0_4px_14px_rgba(16,24,40,.12)]">
          <MapPin size={15} strokeWidth={1.8} className="text-brand" /> 왼쪽 카드를 누르면 지도가
          이동해요
        </div>
      </div>

      <div className="fixed bottom-6 left-1/2 z-[700] flex -translate-x-1/2 items-center gap-2 rounded-full border border-line bg-white p-3.5 shadow-[0_10px_30px_rgba(16,24,40,.16)]">
        <button
          onClick={onBack}
          className="h-11 rounded-full px-[18px] text-sm font-semibold text-ink-muted hover:text-brand"
        >
          다른 코스 보기
        </button>
        <button className="flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-[15px] font-bold text-white shadow-cta hover:bg-brand-dark">
          <Sparkles size={18} strokeWidth={1.8} /> 스토리 카드 만들기
        </button>
        <button className="h-11 rounded-full px-[18px] text-sm font-semibold text-ink-muted hover:text-brand">
          코스 저장 · 공유
        </button>
      </div>
    </div>
  );
}

function formatDistance(meters: number): string {
  if (meters <= 0) return '거리 미정';
  if (meters < 1000) return `${meters}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

function durationLabel(duration: string): string {
  switch (duration) {
    case 'night1':
      return '1박 2일';
    case 'custom':
      return '맞춤 일정';
    default:
      return '당일';
  }
}
