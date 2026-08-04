import { useNavigate } from 'react-router-dom';
import { OnePickConfirm } from '../components/organisms/OnePickConfirm';
import { useAppStore } from '../store/useAppStore';

export function OnePickConfirmPage() {
  const navigate = useNavigate();
  const picks = useAppStore((s) => s.picks);
  const onePick = useAppStore((s) => s.onePick);
  const setOnePick = useAppStore((s) => s.setOnePick);

  return (
    <OnePickConfirm
      picks={picks}
      onePick={onePick}
      onSelect={setOnePick}
      onBack={() => navigate('/')}
      onNext={() => navigate('/photo-upload')}
    />
  );
}
