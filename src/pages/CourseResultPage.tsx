import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseResult } from '../components/organisms/CourseResult';
import { createAddedStop, getMapStops } from '../lib/coursePlaceAddition';
import { useCourseStopsQuery, usePlacesQuery } from '../queries/usePlacesQuery';
import { useAppStore } from '../store/useAppStore';
import type { CourseStop, Place } from '../types/domain';

export function CourseResultPage() {
  const navigate = useNavigate();
  const { data: places = [] } = usePlacesQuery();
  const picks = useAppStore((s) => s.picks);
  const onePick = useAppStore((s) => s.onePick);
  const { data } = useCourseStopsQuery(places, picks, onePick);
  const types = useAppStore((s) => s.types);
  const companion = useAppStore((s) => s.companion);
  const duration = useAppStore((s) => s.duration);
  const [courseStops, setCourseStops] = useState<CourseStop[]>([]);
  const [activeStop, setActiveStop] = useState(0);
  const [previewPlace, setPreviewPlace] = useState<Place | null>(null);

  useEffect(() => {
    setCourseStops(data ?? []);
    setActiveStop(0);
  }, [data]);

  const mapStops = getMapStops(courseStops, previewPlace);
  const mapActiveStop = previewPlace ? mapStops.length - 1 : activeStop;

  function addPlace(place: Place) {
    const addedStop = createAddedStop(place, courseStops);
    if (!addedStop) return;

    setCourseStops((stops) => [...stops, addedStop]);
    setPreviewPlace(null);
    setActiveStop(courseStops.length);
  }

  function selectStop(index: number) {
    setActiveStop(index);
    if (index < courseStops.length) setPreviewPlace(null);
  }

  return (
    <CourseResult
      places={places}
      courseStops={courseStops ?? []}
      mapStops={mapStops}
      onePick={onePick}
      types={types}
      companion={companion}
      duration={duration}
      activeStop={mapActiveStop}
      onActiveStop={selectStop}
      onPreviewPlace={setPreviewPlace}
      onAddPlace={addPlace}
      onBack={() => navigate('/course-options')}
    />
  );
}
