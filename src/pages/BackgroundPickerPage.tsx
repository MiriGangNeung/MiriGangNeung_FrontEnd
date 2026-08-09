import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackgroundPicker } from '../components/organisms/BackgroundPicker';
import { usePlacesQuery } from '../queries/usePlacesQuery';
import { MAX_PICKS, useAppStore } from '../store/useAppStore';
import type { BackgroundPhotoSource } from '../types/domain';

export function BackgroundPickerPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');
  const [source, setSource] = useState<BackgroundPhotoSource>('award');
  const { data: places, isLoading, isError } = usePlacesQuery();
  const picks = useAppStore((s) => s.picks);
  const togglePick = useAppStore((s) => s.togglePick);

  return (
    <BackgroundPicker
      places={places ?? []}
      tab={tab}
      onTab={setTab}
      source={source}
      onSource={setSource}
      picks={picks}
      maxPicks={MAX_PICKS}
      onTogglePick={togglePick}
      onNext={() => navigate('/one-pick')}
      isLoading={isLoading}
      isError={isError}
    />
  );
}
