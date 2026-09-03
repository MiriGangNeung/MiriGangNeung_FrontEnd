import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseResult } from '../components/organisms/CourseResult';
import { addExternalCourseStop, deleteCourseStop, reorderCourseStops } from '../lib/courseApi';
import { ALL_NEARBY_STOP_ID, getNearbyStopOptions } from '../lib/courseNearbyFilter';
import { apiScopeForCoursePlaceMode, shouldFetchCoursePlaces } from '../lib/coursePlacePreferences';
import { queryClient } from '../lib/queryClient';
import { useNearbyPlacesQuery } from '../queries/useCoursePlacesQuery';
import { usePlacesQuery } from '../queries/usePlacesQuery';
import { useCourseQuery } from '../queries/usePlacesQuery';
import { useAppStore } from '../store/useAppStore';
import type {
  Course,
  CoursePlaceMode,
  CourseStop,
  NearbyPlace,
  NearbyPlaceCategory,
  NearbyPlaceSort,
} from '../types/domain';

export function CourseResultPage() {
  const navigate = useNavigate();
  const courseId = useAppStore((s) => s.courseId);
  const onePick = useAppStore((s) => s.onePick);
  const types = useAppStore((s) => s.types);
  const companion = useAppStore((s) => s.companion);
  const duration = useAppStore((s) => s.duration);
  const { data: places = [] } = usePlacesQuery();
  const courseQuery = useCourseQuery(courseId);
  const [course, setCourse] = useState<Course | null>(null);
  const [activeStop, setActiveStop] = useState(0);
  const [previewPlace, setPreviewPlace] = useState<NearbyPlace | null>(null);
  const [nearbyCategory, setNearbyCategory] = useState<NearbyPlaceCategory>('cafe');
  const [nearbyScope, setNearbyScope] = useState<CoursePlaceMode>('nearby');
  const [nearbyStopId, setNearbyStopId] = useState(ALL_NEARBY_STOP_ID);
  const [nearbySort, setNearbySort] = useState<NearbyPlaceSort>('recommended');
  const [nearbyKeyword, setNearbyKeyword] = useState('');
  const [isNearbyOpen, setIsNearbyOpen] = useState(false);
  const apiNearbyScope = apiScopeForCoursePlaceMode(nearbyScope) ?? 'nearby';
  const canFetchNearbyPlaces = shouldFetchCoursePlaces(nearbyScope, isNearbyOpen, nearbyKeyword);

  const nearbyQuery = useNearbyPlacesQuery(
    courseId,
    nearbyCategory,
    apiNearbyScope,
    apiNearbyScope === 'nearby' && nearbyStopId !== ALL_NEARBY_STOP_ID ? nearbyStopId : undefined,
    canFetchNearbyPlaces,
    nearbySort,
    nearbyKeyword,
  );

  useEffect(() => {
    if (!courseId) {
      navigate('/course-options', { replace: true });
      return;
    }
    if (courseQuery.data) {
      setCourse(courseQuery.data);
      setActiveStop((current) => Math.min(current, Math.max(courseQuery.data.stops.length - 1, 0)));
    }
  }, [courseId, courseQuery.data, navigate]);

  useEffect(() => {
    if (nearbyScope !== 'nearby' || !course || nearbyStopId === ALL_NEARBY_STOP_ID) return;
    const tourismStopExists = course.stops.some(
      (stop) => !stop.external && stop.id === nearbyStopId,
    );
    if (!tourismStopExists) setNearbyStopId(ALL_NEARBY_STOP_ID);
  }, [course, nearbyScope, nearbyStopId]);

  function handleNearbyScope(scope: CoursePlaceMode) {
    setPreviewPlace(null);
    setNearbyScope(scope);
    setNearbyStopId(ALL_NEARBY_STOP_ID);
    setNearbySort('recommended');
    setNearbyKeyword('');
  }

  function handleNearbyCategory(category: NearbyPlaceCategory) {
    setPreviewPlace(null);
    setNearbyCategory(category);
    setNearbyKeyword('');
  }

  function handleNearbyStop(stopId: string) {
    setPreviewPlace(null);
    setNearbyStopId(stopId);
    // Picking a specific stop from the "전체" filter focuses the map on it.
    if (stopId !== ALL_NEARBY_STOP_ID && course) {
      const index = course.stops.findIndex((stop) => stop.id === stopId);
      if (index >= 0) setActiveStop(index);
    }
  }

  function handleNearbySort(sort: NearbyPlaceSort) {
    setPreviewPlace(null);
    setNearbySort(sort);
  }

  function applyCourse(nextCourse: Course) {
    setCourse(nextCourse);
    queryClient.setQueryData(['course', nextCourse.courseId], nextCourse);
  }

  async function handleAddPlace(place: NearbyPlace) {
    if (!course) return;
    const nextCourse = await addExternalCourseStop(course.courseId, place);
    applyCourse(nextCourse);
    setActiveStop(nextCourse.stops.length - 1);
    setPreviewPlace(null);
  }

  async function handleDeleteStop(stopId: string) {
    if (!course) return;
    const nextCourse = await deleteCourseStop(course.courseId, stopId);
    applyCourse(nextCourse);
    setActiveStop((current) => Math.min(current, Math.max(nextCourse.stops.length - 1, 0)));
  }

  async function handleReorder(stopIds: string[]) {
    if (!course) return;
    const activeStopId = course.stops[activeStop]?.id;

    // Apply the user's exact order to the course immediately. `time` is a clock
    // position in the day so it stays with the slot; everything else moves with
    // the stop. The backend call still runs, but its result never reverts this.
    const byId = new Map(course.stops.map((stop) => [stop.id, stop]));
    const slotTimes = course.stops.map((stop) => stop.time);
    const reordered = stopIds
      .map((id) => byId.get(id))
      .filter((stop): stop is CourseStop => Boolean(stop))
      .map((stop, index) => ({ ...stop, n: index + 1, time: slotTimes[index] ?? stop.time }));
    applyCourse({ ...course, stops: reordered });
    if (activeStopId) {
      const localIndex = reordered.findIndex((stop) => stop.id === activeStopId);
      if (localIndex >= 0) setActiveStop(localIndex);
    }

    try {
      const nextCourse = await reorderCourseStops(course.courseId, stopIds);
      applyCourse(nextCourse);
      if (activeStopId) {
        const nextIndex = nextCourse.stops.findIndex((stop) => stop.id === activeStopId);
        if (nextIndex >= 0) setActiveStop(nextIndex);
      }
    } catch {
      // Keep the local order; the backend is best-effort here.
    }
  }

  function previewAsCourseStop(place: NearbyPlace, stopCount: number): CourseStop {
    return {
      n: stopCount + 1,
      id: `preview-${place.externalPlaceId}`,
      externalPlaceId: place.externalPlaceId,
      name: place.name,
      time: '다음 장소',
      stay: '60분',
      crowd: 'mid',
      note: place.nearestStopName
        ? `${place.nearestStopName}에서 ${formatDistance(place.distanceMeters ?? 0)}`
        : '선택한 관광지 주변',
      lat: place.latitude,
      lng: place.longitude,
      external: true,
      category: place.category,
      categoryName: place.categoryName,
      address: place.roadAddress || place.address,
      phone: place.phone,
      placeUrl: place.placeUrl,
    };
  }

  if (!courseId) return null;
  if (courseQuery.isError) {
    return (
      <CenteredMessage>코스 결과를 불러오지 못했어요. 백엔드 서버를 확인해 주세요.</CenteredMessage>
    );
  }
  if (courseQuery.isLoading || !course) {
    return <CenteredMessage>실제 코스 결과를 불러오는 중이에요...</CenteredMessage>;
  }

  const previewStop = previewPlace ? previewAsCourseStop(previewPlace, course.stops.length) : null;

  return (
    <CourseResult
      places={places}
      courseStops={course.stops}
      mapStops={course.stops}
      previewStop={previewStop}
      routeSegments={course.routeSegments}
      routeStatus={course.routeStatus}
      onePick={onePick}
      types={course.types?.length ? course.types : types}
      companion={course.companion || companion}
      duration={duration}
      totalDistanceMeters={course.totalDistanceMeters}
      totalTravelMinutes={course.totalTravelMinutes}
      activeStop={activeStop}
      nearbyCategory={nearbyCategory}
      nearbyScope={nearbyScope}
      nearbyStopId={nearbyStopId}
      nearbyStopOptions={getNearbyStopOptions(course.stops)}
      nearbyPlaces={nearbyScope === 'representative' ? [] : (nearbyQuery.data ?? [])}
      nearbySort={nearbySort}
      nearbySearchRadiusMeters={nearbyQuery.searchRadiusMeters}
      nearbyKeyword={nearbyKeyword}
      nearbyHasNextPage={nearbyQuery.hasNextPage ?? false}
      nearbyIsFetchingNextPage={nearbyQuery.isFetchingNextPage}
      isNearbyLoading={nearbyScope !== 'representative' && nearbyQuery.isFetching}
      nearbyError={
        nearbyScope === 'representative' || !canFetchNearbyPlaces
          ? null
          : nearbyQuery.isError
            ? 'nearby-request-failed'
            : null
      }
      onPlaceAdderOpenChange={setIsNearbyOpen}
      onNearbyScope={handleNearbyScope}
      onNearbyCategory={handleNearbyCategory}
      onNearbyStop={handleNearbyStop}
      onNearbySort={handleNearbySort}
      onNearbyKeyword={setNearbyKeyword}
      onNearbyLoadMore={() => void nearbyQuery.fetchNextPage()}
      onActiveStop={(index) => {
        setActiveStop(index);
        setPreviewPlace(null);
      }}
      onPreviewPlace={setPreviewPlace}
      onAddPlace={handleAddPlace}
      onDeleteStop={handleDeleteStop}
      onReorder={handleReorder}
      onBack={() => navigate('/course-options')}
    />
  );
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

function CenteredMessage({ children }: { children: string }) {
  return (
    <div className="flex min-h-[calc(100dvh-var(--app-header))] items-center justify-center bg-canvas px-6 text-sm font-semibold text-ink-muted">
      {children}
    </div>
  );
}
