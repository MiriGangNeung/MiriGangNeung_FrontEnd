import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhotoUpload } from '../components/organisms/PhotoUpload';
import { useComposeRun } from '../hooks/useComposeRun';
import { findPlace } from '../data/places';
import { PLACE_PHOTOS } from '../data/placePhotos';
import { useAppStore } from '../store/useAppStore';

export function PhotoUploadPage() {
  const navigate = useNavigate();
  const onePick = useAppStore((s) => s.onePick);
  // eslint-disable-next-line no-undef -- File is a TS DOM lib type, not a runtime global
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [agreeA, setAgreeA] = useState(false);
  const [agreeB, setAgreeB] = useState(false);
  const { phase, stageIndex, elapsed, start, reset } = useComposeRun();

  return (
    <PhotoUpload
      onePickName={findPlace(onePick).name}
      onePickPhoto={PLACE_PHOTOS[onePick]}
      photoFile={photoFile}
      onPhotoSelect={setPhotoFile}
      agreeA={agreeA}
      agreeB={agreeB}
      onToggleA={() => setAgreeA((v) => !v)}
      onToggleB={() => setAgreeB((v) => !v)}
      phase={phase}
      stageIndex={stageIndex}
      elapsed={elapsed}
      onStart={start}
      onReset={reset}
      onNext={() => navigate('/composite-result')}
    />
  );
}
