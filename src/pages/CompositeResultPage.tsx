import { useNavigate } from 'react-router-dom';
import { CompositeResult } from '../components/organisms/CompositeResult';
import { useAppStore } from '../store/useAppStore';

export function CompositeResultPage() {
  const navigate = useNavigate();
  const onePick = useAppStore((s) => s.onePick);

  return (
    <CompositeResult
      onePick={onePick}
      onRegenerate={() => navigate('/photo-upload')}
      onNext={() => navigate('/course-options')}
    />
  );
}
