import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseOptions } from '../components/organisms/CourseOptions';
import { createCourse } from '../lib/courseApi';
import { queryClient } from '../lib/queryClient';
import { usePlacesQuery } from '../queries/usePlacesQuery';
import { useAppStore } from '../store/useAppStore';

export function CourseOptionsPage() {
  const navigate = useNavigate();
  const { data: places = [] } = usePlacesQuery();
  const picks = useAppStore((s) => s.picks);
  const onePick = useAppStore((s) => s.onePick);
  const types = useAppStore((s) => s.types);
  const detailTypes = useAppStore((s) => s.detailTypes);
  const companion = useAppStore((s) => s.companion);
  const duration = useAppStore((s) => s.duration);
  const startDate = useAppStore((s) => s.startDate);
  const endDate = useAppStore((s) => s.endDate);
  const setCourseId = useAppStore((s) => s.setCourseId);
  const toggleType = useAppStore((s) => s.toggleType);
  const toggleDetailType = useAppStore((s) => s.toggleDetailType);
  const setCompanion = useAppStore((s) => s.setCompanion);
  const setDuration = useAppStore((s) => s.setDuration);
  const setStartDate = useAppStore((s) => s.setStartDate);
  const setEndDate = useAppStore((s) => s.setEndDate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleNext() {
    if (picks.length === 0 || !onePick) {
      setError('먼저 원픽 장소를 선택해 주세요.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const course = await createCourse({
        placeIds: picks,
        onePickId: onePick,
        types,
        companion,
        duration,
        ...(duration === 'custom' ? { startDate, endDate } : {}),
      });
      setCourseId(course.courseId);
      queryClient.setQueryData(['course', course.courseId], course);
      navigate('/course-result');
    } catch {
      setError('코스를 만들지 못했어요. 백엔드와 카카오 설정을 확인해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <CourseOptions
      places={places}
      picks={picks}
      onePick={onePick}
      types={types}
      detailTypes={detailTypes}
      companion={companion}
      duration={duration}
      startDate={startDate}
      endDate={endDate}
      onToggleType={toggleType}
      onToggleDetailType={toggleDetailType}
      onCompanion={setCompanion}
      onDuration={setDuration}
      onStartDate={setStartDate}
      onEndDate={setEndDate}
      onNext={handleNext}
      isSubmitting={isSubmitting}
      error={error}
    />
  );
}
