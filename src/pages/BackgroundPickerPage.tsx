import { useNavigate } from 'react-router-dom';
import { BackgroundPicker } from '../components/organisms/BackgroundPicker';
import { usePlacesQuery } from '../queries/usePlacesQuery';
import { MAX_PICKS, useAppStore } from '../store/useAppStore';

export function BackgroundPickerPage() {
  const navigate = useNavigate();
  const { data: places, isLoading, isError } = usePlacesQuery();
  const picks = useAppStore((s) => s.picks);
  const placeImageIndexes = useAppStore((s) => s.placeImageIndexes);
  const togglePick = useAppStore((s) => s.togglePick);
  const setPlaceImageIndex = useAppStore((s) => s.setPlaceImageIndex);

  return (
    <BackgroundPicker
      places={places ?? []}
      picks={picks}
      placeImageIndexes={placeImageIndexes}
      maxPicks={MAX_PICKS}
      onTogglePick={togglePick}
      onPlaceImageIndexChange={setPlaceImageIndex}
      onNext={() => navigate('/one-pick')}
      isLoading={isLoading}
      isError={isError}
    />
  );
}
