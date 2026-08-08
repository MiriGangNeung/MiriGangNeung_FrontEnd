import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackgroundPicker } from '../components/organisms/BackgroundPicker';
import { usePlacesQuery } from '../queries/usePlacesQuery';
import { MAX_PICKS, useAppStore } from '../store/useAppStore';

export function BackgroundPickerPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');
  const { data: places } = usePlacesQuery();
  const picks = useAppStore((s) => s.picks);
  const togglePick = useAppStore((s) => s.togglePick);

  return (
    <BackgroundPicker
      places={places ?? []}
      tab={tab}
      onTab={setTab}
      picks={picks}
      maxPicks={MAX_PICKS}
      onTogglePick={togglePick}
      onNext={() => navigate('/one-pick')}
    />
  );
}
