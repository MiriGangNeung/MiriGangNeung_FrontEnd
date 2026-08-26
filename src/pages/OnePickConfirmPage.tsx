import { useNavigate } from 'react-router-dom';
import { OnePickConfirm } from '../components/organisms/OnePickConfirm';
import { usePlacesQuery } from '../queries/usePlacesQuery';
import { useAppStore } from '../store/useAppStore';

export function OnePickConfirmPage() {
  const navigate = useNavigate();
  const { data: places = [] } = usePlacesQuery();
  const picks = useAppStore((s) => s.picks);
  const onePick = useAppStore((s) => s.onePick);
  const placeImageIndexes = useAppStore((s) => s.placeImageIndexes);
  const setOnePick = useAppStore((s) => s.setOnePick);

  return (
    <OnePickConfirm
      places={places}
      picks={picks}
      onePick={onePick}
      placeImageIndexes={placeImageIndexes}
      onSelect={setOnePick}
      onBack={() => navigate('/background-picker')}
      onNext={() => navigate('/photo-upload')}
    />
  );
}
