import { useNavigate } from 'react-router-dom';
import { CompositeResult } from '../components/organisms/CompositeResult';
import { findPlaceById } from '../lib/placeLookup';
import { usePlacesQuery } from '../queries/usePlacesQuery';
import { useAppStore } from '../store/useAppStore';

export function CompositeResultPage() {
  const navigate = useNavigate();
  const { data: places = [] } = usePlacesQuery();
  const onePick = useAppStore((s) => s.onePick);
  const compositionDownloadUrl = useAppStore((s) => s.compositionDownloadUrl);
  const compositionCompletedAt = useAppStore((s) => s.compositionCompletedAt);
  const compositionWarnings = useAppStore((s) => s.compositionWarnings);
  const place = findPlaceById(places, onePick);

  return (
    <CompositeResult
      place={place}
      imageUrl={compositionDownloadUrl || undefined}
      compositionCompletedAt={compositionCompletedAt || undefined}
      warnings={compositionWarnings}
      onRegenerate={() => navigate('/photo-upload')}
      onNext={() => navigate('/course-options')}
    />
  );
}
