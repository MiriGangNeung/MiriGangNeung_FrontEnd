import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseResult } from '../components/organisms/CourseResult';
import { useCourseStopsQuery } from '../queries/usePlacesQuery';
import { useAppStore } from '../store/useAppStore';

export function CourseResultPage() {
  const navigate = useNavigate();
  const { data: courseStops } = useCourseStopsQuery();
  const onePick = useAppStore((s) => s.onePick);
  const types = useAppStore((s) => s.types);
  const companion = useAppStore((s) => s.companion);
  const duration = useAppStore((s) => s.duration);
  const [activeStop, setActiveStop] = useState(0);

  return (
    <CourseResult
      courseStops={courseStops ?? []}
      onePick={onePick}
      types={types}
      companion={companion}
      duration={duration}
      activeStop={activeStop}
      onActiveStop={setActiveStop}
      onBack={() => navigate('/course-options')}
    />
  );
}
