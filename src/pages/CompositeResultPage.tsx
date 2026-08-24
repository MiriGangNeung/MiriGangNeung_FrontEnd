import { useNavigate } from 'react-router-dom';
import { CompositeResult } from '../components/organisms/CompositeResult';
import { findPlaceById } from '../lib/placeLookup';
import { usePlacesQuery } from '../queries/usePlacesQuery';
import { useAppStore } from '../store/useAppStore';

export function CompositeResultPage() {
  const navigate = useNavigate();
  const { data: places = [] } = usePlacesQuery();
  const onePick = useAppStore((s) => s.onePick);
  const place = findPlaceById(places, onePick);

  return (
    <CompositeResult
      place={place}
      onRegenerate={() => navigate('/photo-upload')}
      onNext={() => navigate('/course-options')}
    />
  );
}
