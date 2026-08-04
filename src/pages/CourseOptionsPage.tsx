import { useNavigate } from 'react-router-dom';
import { CourseOptions } from '../components/organisms/CourseOptions';
import { useAppStore } from '../store/useAppStore';

export function CourseOptionsPage() {
  const navigate = useNavigate();
  const picks = useAppStore((s) => s.picks);
  const onePick = useAppStore((s) => s.onePick);
  const types = useAppStore((s) => s.types);
  const companion = useAppStore((s) => s.companion);
  const duration = useAppStore((s) => s.duration);
  const startDate = useAppStore((s) => s.startDate);
  const endDate = useAppStore((s) => s.endDate);
  const toggleType = useAppStore((s) => s.toggleType);
  const setCompanion = useAppStore((s) => s.setCompanion);
  const setDuration = useAppStore((s) => s.setDuration);
  const setStartDate = useAppStore((s) => s.setStartDate);
  const setEndDate = useAppStore((s) => s.setEndDate);

  return (
    <CourseOptions
      picks={picks}
      onePick={onePick}
      types={types}
      companion={companion}
      duration={duration}
      startDate={startDate}
      endDate={endDate}
      onToggleType={toggleType}
      onCompanion={setCompanion}
      onDuration={setDuration}
      onStartDate={setStartDate}
      onEndDate={setEndDate}
      onNext={() => navigate('/course-result')}
    />
  );
}
