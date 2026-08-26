import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseResult } from '../components/organisms/CourseResult';
import { addExternalCourseStop, deleteCourseStop, reorderCourseStops } from '../lib/courseApi';
import { queryClient } from '../lib/queryClient';
import { useNearbyPlacesQuery } from '../queries/useCoursePlacesQuery';
import { usePlacesQuery } from '../queries/usePlacesQuery';
import { useCourseQuery } from '../queries/usePlacesQuery';
import { useAppStore } from '../store/useAppStore';
import type { Course, CourseStop, NearbyPlace, NearbyPlaceCategory } from '../types/domain';

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
  const [isNearbyOpen, setIsNearbyOpen] = useState(false);

  const nearbyQuery = useNearbyPlacesQuery(courseId, nearbyCategory, isNearbyOpen);

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
    const nextCourse = await reorderCourseStops(course.courseId, stopIds);
    applyCourse(nextCourse);
    if (activeStopId) {
      const nextIndex = nextCourse.stops.findIndex((stop) => stop.id === activeStopId);
      if (nextIndex >= 0) setActiveStop(nextIndex);
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
        ? `${place.nearestStopName}에서 ${formatDistance(place.distanceMeters)}`
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

  const mapStops = previewPlace
    ? [...course.stops, previewAsCourseStop(previewPlace, course.stops.length)]
    : course.stops;
  const mapActiveStop = previewPlace ? mapStops.length - 1 : activeStop;

  return (
    <CourseResult
      places={places}
      courseStops={course.stops}
      mapStops={mapStops}
      routeSegments={course.routeSegments}
      routeStatus={course.routeStatus}
      onePick={onePick}
      types={types}
      companion={companion}
      duration={duration}
      totalDistanceMeters={course.totalDistanceMeters}
      totalTravelMinutes={course.totalTravelMinutes}
      activeStop={mapActiveStop}
      nearbyCategory={nearbyCategory}
      nearbyPlaces={nearbyQuery.data ?? []}
      isNearbyLoading={nearbyQuery.isLoading}
      nearbyError={nearbyQuery.isError ? 'nearby-request-failed' : null}
      onPlaceAdderOpenChange={setIsNearbyOpen}
      onNearbyCategory={setNearbyCategory}
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
    <div className="flex min-h-[calc(100vh-74px)] items-center justify-center bg-canvas px-6 text-sm font-semibold text-ink-muted">
      {children}
    </div>
  );
}
