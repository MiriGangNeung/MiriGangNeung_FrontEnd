import {
  Building2,
  Coffee,
  GripVertical,
  MapPin,
  Search,
  Sparkles,
  Utensils,
  X,
} from 'lucide-react';
import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ElementRef,
  type PointerEvent,
} from 'react';
import { CourseMap } from './CourseMap';
import { KakaoPlacePreviewModal } from './KakaoPlacePreviewModal';
import { KakaoPlaceReviewButton, type KakaoPlacePreviewTarget } from './KakaoPlaceReviewButton';
import { NearbyPlaceCard } from './NearbyPlaceCard';
import { CourseStopThumbnail } from './CourseStopThumbnail';
import { CourseResultHeader } from './CourseResultHeader';
import { CourseStopActions } from './CourseStopActions';
import { COMPANIONS, DURATIONS, TRIP_TYPES } from '../../data/places';
import {
  getCourseDragPreviewPosition,
  getCourseDropIndicatorIndex,
  getCourseDropSlotIndexAtPoint,
  getCourseMoveTargetIndex,
  hasCourseDragThreshold,
} from '../../lib/courseDragDrop';
import type { NearbyStopOption } from '../../lib/courseNearbyFilter';
import { findPlaceById } from '../../lib/placeLookup';
import { moveCourseStop } from '../../lib/courseStopOrder';
import type {
  CourseRouteSegment,
  CourseStop,
  NearbyPlace,
  NearbyPlaceCategory,
  NearbyPlaceScope,
  NearbyPlaceSort,
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
  nearbyScope: NearbyPlaceScope;
  nearbyStopId: string;
  nearbyStopOptions: NearbyStopOption[];
  nearbyPlaces: NearbyPlace[];
  nearbySort: NearbyPlaceSort;
  nearbyKeyword: string;
  nearbyHasNextPage: boolean;
  nearbyIsFetchingNextPage: boolean;
  isNearbyLoading: boolean;
  nearbyError: string | null;
  onPlaceAdderOpenChange: (open: boolean) => void;
  onNearbyScope: (scope: NearbyPlaceScope) => void;
  onNearbyCategory: (category: NearbyPlaceCategory) => void;
  onNearbyStop: (stopId: string) => void;
  onNearbySort: (sort: NearbyPlaceSort) => void;
  onNearbyKeyword: (keyword: string) => void;
  onNearbyLoadMore: () => void;
  onActiveStop: (index: number) => void;
  onPreviewPlace: (place: NearbyPlace | null) => void;
  onAddPlace: (place: NearbyPlace) => Promise<void>;
  onDeleteStop: (stopId: string) => Promise<void>;
  onReorder: (stopIds: string[]) => Promise<void>;
  onBack: () => void;
};

type CourseDragEvent = Pick<PointerEvent<HTMLElement>, 'clientX' | 'clientY' | 'preventDefault'>;
type CourseDragPoint = { x: number; y: number };
type PendingCourseDrag = { stopId: string; startPoint: CourseDragPoint };
type ActiveCoursePointer = { pointerId: number; target: HTMLElement; stopId: string };
type CourseDragPreviewSize = { width: number; height: number };
type CourseDragPreview = {
  size: CourseDragPreviewSize;
  pointerOffset: CourseDragPoint;
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
  nearbyScope,
  nearbyStopId,
  nearbyStopOptions,
  nearbyPlaces,
  nearbySort,
  nearbyKeyword,
  nearbyHasNextPage,
  nearbyIsFetchingNextPage,
  isNearbyLoading,
  nearbyError,
  onPlaceAdderOpenChange,
  onNearbyScope,
  onNearbyCategory,
  onNearbyStop,
  onNearbySort,
  onNearbyKeyword,
  onNearbyLoadMore,
  onActiveStop,
  onPreviewPlace,
  onAddPlace,
  onDeleteStop,
  onReorder,
  onBack,
}: CourseResultProps) {
  const [isPlaceAdderOpen, setIsPlaceAdderOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<NearbyPlace | null>(null);
  const [placeForDetails, setPlaceForDetails] = useState<KakaoPlacePreviewTarget | null>(null);
  const [draggingStopId, setDraggingStopId] = useState<string | null>(null);
  const [pendingDrag, setPendingDrag] = useState<PendingCourseDrag | null>(null);
  const [dropInsertIndex, setDropInsertIndex] = useState<number | null>(null);
  const [dragPoint, setDragPoint] = useState<CourseDragPoint | null>(null);
  const [dragPreview, setDragPreview] = useState<CourseDragPreview | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [keywordDraft, setKeywordDraft] = useState(nearbyKeyword);
  const courseListRef = useRef<ElementRef<'ol'>>(null);
  const activePointerRef = useRef<ActiveCoursePointer | null>(null);
  const clearPointerDragging = useCallback(() => {
    const activePointer = activePointerRef.current;
    if (activePointer?.target.hasPointerCapture(activePointer.pointerId)) {
      activePointer.target.releasePointerCapture(activePointer.pointerId);
    }
    activePointerRef.current = null;
    setPendingDrag(null);
    setDraggingStopId(null);
    setDropInsertIndex(null);
    setDragPoint(null);
    setDragPreview(null);
  }, []);
  const onePickPlace = findPlaceById(places, onePick);
  const onePickStop = courseStops.find((stop) => stop.onePick);
  const tags: string[] = [
    `원픽 ${onePickPlace?.name ?? onePickStop?.name ?? '선택한 장소'}`,
    TRIP_TYPES.filter((t) => types.includes(t.id))
      .map((t) => t.label)
      .join(' · '),
    COMPANIONS.find((c) => c.id === companion)?.label,
    DURATIONS.find((d) => d.id === duration)?.label,
    totalDistanceMeters > 0
      ? `도보 ${formatDistance(totalDistanceMeters)} · ${totalTravelMinutes}분`
      : '도보 거리 확인 중',
  ].filter((tag): tag is string => Boolean(tag));
  const draggingStop = courseStops.find((stop) => stop.id === draggingStopId);
  const dropIndicatorIndex = getCourseDropIndicatorIndex(
    courseStops.map((stop) => stop.id),
    draggingStopId,
    dropInsertIndex,
  );
  const viewport =
    typeof window === 'undefined'
      ? { width: 1024, height: 768 }
      : { width: window.innerWidth, height: window.innerHeight };
  const dragPreviewPosition =
    dragPoint && dragPreview
      ? getCourseDragPreviewPosition(
          dragPoint,
          viewport,
          dragPreview.size,
          dragPreview.pointerOffset,
        )
      : null;

  useEffect(() => {
    setKeywordDraft(nearbyKeyword);
  }, [nearbyKeyword]);

  useEffect(() => {
    if (!pendingDrag && !draggingStopId) return;

    const cancelOnWindowExit = () => clearPointerDragging();
    const cancelOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') cancelOnWindowExit();
    };

    window.addEventListener('blur', cancelOnWindowExit);
    window.addEventListener('pointercancel', cancelOnWindowExit);
    window.addEventListener('keydown', cancelOnEscape);
    document.addEventListener('visibilitychange', cancelOnWindowExit);

    return () => {
      window.removeEventListener('blur', cancelOnWindowExit);
      window.removeEventListener('pointercancel', cancelOnWindowExit);
      window.removeEventListener('keydown', cancelOnEscape);
      document.removeEventListener('visibilitychange', cancelOnWindowExit);
    };
  }, [clearPointerDragging, draggingStopId, pendingDrag]);

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

  function openPlaceDetails(target: KakaoPlacePreviewTarget) {
    if (!target.placeUrl) return;
    setPlaceForDetails(target);
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

  function isPointInsideCourseList(x: number, y: number): boolean {
    const rect = courseListRef.current?.getBoundingClientRect();
    if (!rect) return false;
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  }

  function startPointerDragging(event: PointerEvent<HTMLElement>, stopId: string) {
    if (event.button !== 0) return;
    event.preventDefault();
    const startPoint = { x: event.clientX, y: event.clientY };
    const card = event.currentTarget.closest('[data-course-stop-card]');
    const cardRect = card?.getBoundingClientRect();
    if (!cardRect) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    activePointerRef.current = {
      pointerId: event.pointerId,
      target: event.currentTarget,
      stopId,
    };
    setPendingDrag({ stopId, startPoint });
    setDropInsertIndex(null);
    setDragPoint(startPoint);
    setDragPreview({
      size: { width: cardRect.width, height: cardRect.height },
      pointerOffset: {
        x: event.clientX - cardRect.left,
        y: event.clientY - cardRect.top,
      },
    });
    setActionError(null);
  }

  function getDropSlotIndexAtPoint(pointerY: number, draggedStopId: string): number | null {
    const cardElements =
      courseListRef.current?.querySelectorAll<HTMLElement>('[data-course-stop-card]');
    if (!cardElements) return null;

    const cards = Array.from(cardElements)
      .map((card) => {
        const rect = card.getBoundingClientRect();
        return {
          id: card.closest('[data-course-stop-id]')?.getAttribute('data-course-stop-id') ?? '',
          top: rect.top,
          bottom: rect.bottom,
        };
      })
      .filter((card) => card.id);

    return getCourseDropSlotIndexAtPoint(cards, draggedStopId, pointerY);
  }

  function updatePointerDropTarget(event: CourseDragEvent, stopId: string) {
    const point = { x: event.clientX, y: event.clientY };
    setDragPoint(point);

    if (pendingDrag?.stopId === stopId) {
      if (!hasCourseDragThreshold(pendingDrag.startPoint, point)) return;
      event.preventDefault();
      setPendingDrag(null);
      setDraggingStopId(stopId);
      setDropInsertIndex(
        isPointInsideCourseList(point.x, point.y) ? getDropSlotIndexAtPoint(point.y, stopId) : null,
      );
      return;
    }

    if (draggingStopId !== stopId) return;
    if (!isPointInsideCourseList(point.x, point.y)) return;
    event.preventDefault();
    setDropInsertIndex(getDropSlotIndexAtPoint(point.y, stopId));
  }

  function finishPointerDragging(event: CourseDragEvent, stopId: string) {
    if (pendingDrag?.stopId === stopId && !draggingStopId) {
      clearPointerDragging();
      return;
    }
    if (draggingStopId !== stopId) return;
    event.preventDefault();
    const insertIndex = isPointInsideCourseList(event.clientX, event.clientY)
      ? getDropSlotIndexAtPoint(event.clientY, stopId)
      : null;
    clearPointerDragging();
    if (insertIndex !== null) void dropStop(insertIndex, stopId);
  }

  function cancelPointerDragging(stopId: string) {
    if (pendingDrag?.stopId !== stopId && draggingStopId !== stopId) return;
    clearPointerDragging();
  }

  async function dropStop(insertIndex: number, draggedStopId: string | null) {
    if (!draggedStopId) return;
    const currentIndex = courseStops.findIndex((stop) => stop.id === draggedStopId);
    const targetIndex = getCourseMoveTargetIndex(
      courseStops.map((stop) => stop.id),
      draggedStopId,
      insertIndex,
    );
    if (
      currentIndex < 0 ||
      targetIndex === null ||
      targetIndex < 0 ||
      targetIndex >= courseStops.length ||
      currentIndex === targetIndex
    ) {
      return;
    }

    const next = moveCourseStop(
      courseStops.map((stop) => stop.id),
      currentIndex,
      targetIndex,
    );
    setDraggingStopId(null);
    try {
      await onReorder(next);
    } catch {
      setActionError('코스 순서를 저장하지 못했어요. 잠시 후 다시 시도해 주세요.');
    }
  }

  const placeAdderPanel = isPlaceAdderOpen ? (
    <section
      data-course-place-adder
      role="region"
      aria-label="주변 장소 추가"
      className="mb-4 rounded-2xl border border-brand/20 bg-white p-4 shadow-[0_8px_24px_rgba(16,24,40,.08)]"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-bold">주변 장소 추가</h2>
          <p className="mt-1 text-xs text-ink-soft">
            선택한 여행 타입과 동행 유형을 반영해 보여드려요.
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

      <div
        className="mt-4 grid grid-cols-3 gap-1 rounded-xl bg-fill p-1"
        role="tablist"
        aria-label="장소 검색 범위"
      >
        <button
          type="button"
          role="tab"
          aria-selected={nearbyScope === 'nearby'}
          data-nearby-scope="nearby"
          onClick={() => onNearbyScope('nearby')}
          className={`rounded-lg px-2 py-2 text-xs font-bold ${nearbyScope === 'nearby' ? 'bg-white text-brand shadow-sm' : 'text-ink-muted'}`}
        >
          주변 추천
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={nearbyScope === 'all'}
          data-nearby-scope="all"
          onClick={() => onNearbyScope('all')}
          className={`rounded-lg px-2 py-2 text-xs font-bold ${nearbyScope === 'all' ? 'bg-white text-brand shadow-sm' : 'text-ink-muted'}`}
        >
          강릉 전체
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={false}
          disabled
          data-nearby-scope="representative"
          className="cursor-not-allowed rounded-lg px-2 py-2 text-xs font-bold text-ink-muted/50"
        >
          강릉 대표
        </button>
      </div>

      <div
        className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-fill p-1"
        role="tablist"
        aria-label="장소 카테고리"
      >
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
        <button
          type="button"
          role="tab"
          aria-selected={nearbyCategory === 'culture'}
          onClick={() => onNearbyCategory('culture')}
          className={`flex h-10 items-center justify-center gap-1.5 rounded-lg text-sm font-bold ${nearbyCategory === 'culture' ? 'bg-white text-brand shadow-sm' : 'text-ink-muted'}`}
        >
          <Building2 size={15} /> 문화시설
        </button>
      </div>

      {nearbyScope === 'nearby' ? (
        <>
          <label
            htmlFor="nearby-stop-filter"
            className="mt-3 block text-xs font-bold text-ink-muted"
          >
            기준 관광지
          </label>
          <select
            id="nearby-stop-filter"
            value={nearbyStopId}
            onChange={(event) => onNearbyStop(event.target.value)}
            className="mt-1 h-10 w-full rounded-xl border border-line bg-white px-3 text-sm font-semibold text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
          >
            {nearbyStopOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-ink-muted">정렬 기준</span>
            <div className="flex rounded-lg bg-fill p-0.5" role="group" aria-label="주변 장소 정렬">
              <button
                type="button"
                aria-pressed={nearbySort === 'recommended'}
                data-nearby-sort="recommended"
                onClick={() => onNearbySort('recommended')}
                className={`rounded-md px-2.5 py-1.5 text-xs font-bold ${nearbySort === 'recommended' ? 'bg-white text-brand shadow-sm' : 'text-ink-muted'}`}
              >
                추천순
              </button>
              <button
                type="button"
                aria-pressed={nearbySort === 'distance'}
                data-nearby-sort="distance"
                onClick={() => onNearbySort('distance')}
                className={`rounded-md px-2.5 py-1.5 text-xs font-bold ${nearbySort === 'distance' ? 'bg-white text-brand shadow-sm' : 'text-ink-muted'}`}
              >
                거리순
              </button>
            </div>
          </div>
        </>
      ) : (
        <form
          className="mt-3 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            onNearbyKeyword(keywordDraft.trim());
          }}
        >
          <label htmlFor="all-place-keyword" className="sr-only">
            강릉 전체 장소 검색
          </label>
          <div className="relative min-w-0 flex-1">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
            />
            <input
              id="all-place-keyword"
              value={keywordDraft}
              onChange={(event) => setKeywordDraft(event.target.value)}
              placeholder="장소명을 검색하세요"
              className="h-10 w-full rounded-xl border border-line bg-white pl-9 pr-3 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </div>
          <button
            type="submit"
            className="h-10 shrink-0 rounded-xl bg-brand px-3 text-sm font-bold text-white hover:bg-brand-dark"
          >
            검색
          </button>
        </form>
      )}

      <div className="mt-3 max-h-[min(38vh,320px)] space-y-2 overflow-y-auto pr-1">
        {isNearbyLoading ? (
          <p className="rounded-xl bg-fill px-3 py-8 text-center text-sm text-ink-muted">
            {nearbyScope === 'all' ? '강릉 전체 장소를 찾는 중...' : '주변 장소를 찾는 중...'}
          </p>
        ) : nearbyError ? (
          <p className="rounded-xl bg-coral-tint px-3 py-8 text-center text-sm text-coral">
            {nearbyScope === 'all' ? '강릉 전체 장소' : '주변 장소'}를 불러오지 못했어요. 백엔드의
            KAKAO_API_KEY를 확인해 주세요.
          </p>
        ) : nearbyPlaces.length === 0 ? (
          <p className="rounded-xl bg-fill px-3 py-8 text-center text-sm text-ink-muted">
            {nearbyScope === 'all'
              ? nearbyKeyword
                ? '검색 결과가 없어요.'
                : '강릉 전체에서 장소를 찾지 못했어요.'
              : '선택한 관광지 2km 안에 장소가 없어요.'}
          </p>
        ) : (
          nearbyPlaces.map((place) => {
            const alreadyAdded = courseStops.some(
              (stop) => stop.externalPlaceId === place.externalPlaceId,
            );
            const selected = selectedPlace?.externalPlaceId === place.externalPlaceId;
            return (
              <NearbyPlaceCard
                key={place.externalPlaceId}
                place={place}
                alreadyAdded={alreadyAdded}
                selected={selected}
                showDistance={nearbyScope === 'nearby'}
                onSelect={selectPlace}
                onOpenDetails={openPlaceDetails}
              />
            );
          })
        )}
      </div>

      {nearbyScope === 'all' && nearbyHasNextPage && (
        <button
          type="button"
          onClick={onNearbyLoadMore}
          disabled={nearbyIsFetchingNextPage}
          className="mt-2 h-9 w-full rounded-xl border border-line text-xs font-bold text-brand hover:bg-brand-tint disabled:cursor-wait disabled:opacity-60"
        >
          {nearbyIsFetchingNextPage ? '더 불러오는 중...' : '더 불러오기'}
        </button>
      )}

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
  ) : null;

  return (
    <div className="grid min-h-[calc(100vh-74px)] grid-cols-1 lg:h-[calc(100vh-74px)] lg:grid-cols-[minmax(400px,36fr)_64fr]">
      <div className="overflow-y-auto border-r border-line bg-canvas px-[26px] pb-32 pt-[26px]">
        <CourseResultHeader
          isPlaceAdderOpen={isPlaceAdderOpen}
          durationText={durationLabel(duration)}
          courseStopCount={courseStops.length}
          totalDistanceText={formatDistance(totalDistanceMeters)}
          tags={tags}
          onTogglePlaceAdder={() => {
            setIsPlaceAdderOpen(true);
            setActionError(null);
            onPlaceAdderOpenChange(true);
          }}
        />

        {placeAdderPanel}

        {actionError && !isPlaceAdderOpen && (
          <p
            className="mt-3 rounded-xl bg-coral-tint px-3 py-2 text-xs font-semibold text-coral"
            role="alert"
          >
            {actionError}
          </p>
        )}

        <p className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold text-ink-muted">
          <GripVertical size={14} className="text-brand" />
          {draggingStop ? '원하는 카드 위에 놓으세요' : '카드 오른쪽의 점을 잡고 순서를 바꿔보세요'}
        </p>

        <ol
          ref={courseListRef}
          className="mt-3"
          onPointerMove={(event) => {
            const activeDragStopId = draggingStopId ?? pendingDrag?.stopId;
            if (!activeDragStopId) return;
            updatePointerDropTarget(event, activeDragStopId);
          }}
          onPointerUp={(event) => {
            const activeDragStopId = draggingStopId ?? pendingDrag?.stopId;
            if (!activeDragStopId) return;
            finishPointerDragging(event, activeDragStopId);
          }}
          onPointerCancel={() => {
            const activeDragStopId = draggingStopId ?? pendingDrag?.stopId;
            if (!activeDragStopId) return;
            cancelPointerDragging(activeDragStopId);
          }}
        >
          {courseStops.map((stop, index) => {
            const active = activeStop === index;
            const stopLocation = getStopLocation(stop, places);
            const isOnePick = isOnePickCourseStop(stop, onePick);
            const categoryLabel = getCourseStopCategoryLabel(stop);
            const reviewTarget = stop.placeUrl
              ? {
                  externalPlaceId: stop.externalPlaceId ?? stop.id,
                  name: stop.name,
                  placeUrl: stop.placeUrl,
                }
              : null;
            return (
              <Fragment key={stop.id}>
                {dropIndicatorIndex === index && <CourseDropIndicator />}
                <li data-course-stop-id={stop.id} className="relative flex gap-3.5">
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
                    data-course-stop-card
                    className={`group relative flex flex-1 rounded-2xl border bg-white text-left transition duration-200 hover:shadow-[0_8px_22px_rgba(16,24,40,.1)] ${isPlaceAdderOpen ? 'mb-2 gap-2.5 rounded-xl p-2.5' : 'mb-2.5 min-h-[104px] gap-3 rounded-2xl p-3'} ${draggingStopId === stop.id ? 'border-brand/50 bg-brand-tint/20 opacity-55' : 'border-line'} ${draggingStopId ? 'cursor-grabbing' : ''} ${active ? 'ring-2 ring-brand/15' : ''}`}
                  >
                    <div
                      className={`flex min-w-0 flex-1 items-center ${isPlaceAdderOpen ? 'gap-2.5 pr-6' : 'gap-3 pr-7'}`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            data-course-stop-category
                            className="shrink-0 rounded-full bg-fill px-2 py-1 text-[11px] font-bold text-ink-muted"
                          >
                            {categoryLabel}
                          </span>
                          {isOnePick && (
                            <span
                              data-course-stop-one-pick
                              className="shrink-0 rounded-full bg-coral-tint px-2 py-1 text-[11px] font-bold text-coral"
                            >
                              원픽
                            </span>
                          )}
                          {!isPlaceAdderOpen && reviewTarget && (
                            <KakaoPlaceReviewButton
                              target={reviewTarget}
                              onOpen={openPlaceDetails}
                              compact
                              label="리뷰"
                            />
                          )}
                        </div>
                        <button
                          type="button"
                          data-course-stop-select
                          onClick={() => onActiveStop(index)}
                          className="mt-1.5 block w-full min-w-0 text-left"
                        >
                          <span
                            className={`${isPlaceAdderOpen ? 'text-sm' : 'text-base'} block min-w-0 truncate font-bold -tracking-[.3px]`}
                          >
                            {stop.name}
                          </span>
                        </button>
                        {!isPlaceAdderOpen && (
                          <span className="mt-1.5 block truncate text-xs leading-[1.6] text-ink-soft">
                            {stopLocation}
                          </span>
                        )}
                      </div>
                      <CourseStopThumbnail stop={stop} isCompact={isPlaceAdderOpen} />
                    </div>
                    <CourseStopActions
                      isPlaceAdderOpen={isPlaceAdderOpen}
                      stop={stop}
                      onDelete={() => void deleteStop(stop)}
                      onPointerDown={(event) => startPointerDragging(event, stop.id)}
                      onLostPointerCapture={() => cancelPointerDragging(stop.id)}
                      isDragging={draggingStopId === stop.id}
                    />
                  </div>
                </li>
              </Fragment>
            );
          })}
          {dropIndicatorIndex === courseStops.length && <CourseDropIndicator />}
        </ol>
      </div>

      <div className="relative h-[420px] bg-slot lg:h-full">
        <CourseMap
          courseStops={mapStops}
          routeSegments={routeSegments}
          routeStatus={routeStatus}
          activeIndex={activeStop}
          onSelect={onActiveStop}
          nearbyPlaces={nearbyPlaces}
          showNearbyPlaces={nearbyScope === 'all'}
          onSelectNearbyPlace={selectPlace}
        />
        <div className="pointer-events-none absolute left-[18px] top-[18px] z-[500] flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-2.5 text-xs font-semibold text-ink-muted shadow-[0_4px_14px_rgba(16,24,40,.12)]">
          <MapPin size={15} strokeWidth={1.8} className="text-brand" /> 왼쪽 카드를 누르면 지도가
          이동해요
        </div>
      </div>

      {draggingStop && dragPoint && dragPreview && dragPreviewPosition && (
        <div
          className={`pointer-events-none fixed z-[1000] rotate-[1deg] overflow-hidden border-2 border-brand/70 bg-white/95 text-left shadow-[0_20px_45px_rgba(16,24,40,.25)] ring-4 ring-brand/15 ${isPlaceAdderOpen ? 'rounded-xl p-2.5' : 'rounded-2xl p-4'}`}
          style={{
            left: dragPreviewPosition.left,
            top: dragPreviewPosition.top,
            width: dragPreview.size.width,
            height: dragPreview.size.height,
          }}
          aria-hidden="true"
        >
          <div
            className={`relative flex h-full items-center pr-7 ${isPlaceAdderOpen ? 'gap-2.5 p-0' : 'gap-3.5'}`}
          >
            <span className="min-w-0 flex-1">
              <span className="flex min-w-0 items-center gap-2">
                <span className="shrink-0 rounded-full bg-fill px-2 py-1 text-[11px] font-bold text-ink-muted">
                  {getCourseStopCategoryLabel(draggingStop)}
                </span>
                {isOnePickCourseStop(draggingStop, onePick) && (
                  <span className="shrink-0 rounded-full bg-coral-tint px-2 py-1 text-[11px] font-bold text-coral">
                    원픽
                  </span>
                )}
              </span>
              <span
                className={`${isPlaceAdderOpen ? 'text-sm' : 'text-base'} mt-1.5 block min-w-0 truncate font-bold -tracking-[.3px]`}
              >
                {draggingStop.name}
              </span>
              {!isPlaceAdderOpen && (
                <>
                  <span className="mt-1.5 block truncate text-xs leading-[1.6] text-ink-soft">
                    {getStopLocation(draggingStop, places)}
                  </span>
                </>
              )}
            </span>
            <CourseStopThumbnail stop={draggingStop} isCompact={isPlaceAdderOpen} />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-brand">
              <GripVertical size={18} strokeWidth={2.2} />
            </span>
          </div>
        </div>
      )}

      {placeForDetails && (
        <KakaoPlacePreviewModal place={placeForDetails} onClose={() => setPlaceForDetails(null)} />
      )}

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

function getStopLocation(stop: CourseStop, places: Place[]): string {
  if (stop.external) return stop.address ?? stop.note;
  return findPlaceById(places, stop.placeId ?? stop.id)?.region ?? stop.note;
}

function getCourseStopCategoryLabel(stop: CourseStop): string {
  if (!stop.external) return '관광지';

  switch (stop.category) {
    case 'cafe':
      return '카페';
    case 'restaurant':
      return '음식점';
    case 'attraction':
      return '관광명소';
    case 'culture':
      return '문화시설';
    default:
      return '주변 장소';
  }
}

function isOnePickCourseStop(stop: CourseStop, onePick: string): boolean {
  return (
    Boolean(stop.onePick) ||
    (!stop.external && Boolean(onePick) && (stop.placeId === onePick || stop.id === onePick))
  );
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

function CourseDropIndicator() {
  return (
    <li
      data-course-drop-slot
      aria-hidden="true"
      className="pointer-events-none relative z-20 flex h-0 gap-3.5"
    >
      <span className="w-[30px] shrink-0" />
      <span className="relative top-[-7px] h-[3px] flex-1 rounded-full bg-brand shadow-[0_0_8px_rgba(47,111,237,.45)]">
        <span className="absolute -left-1.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-brand ring-4 ring-brand/15" />
      </span>
    </li>
  );
}
