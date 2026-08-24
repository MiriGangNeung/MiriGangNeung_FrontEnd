import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhotoUpload } from '../components/organisms/PhotoUpload';
import { useComposeRun } from '../hooks/useComposeRun';
import { findPlaceById } from '../lib/placeLookup';
import { getPlaceImageSelection } from '../lib/placeImages';
import { usePlacesQuery } from '../queries/usePlacesQuery';
import { useAppStore } from '../store/useAppStore';

export function PhotoUploadPage() {
  const navigate = useNavigate();
  const { data: places = [] } = usePlacesQuery();
  const onePick = useAppStore((s) => s.onePick);
  const placeImageIndexes = useAppStore((s) => s.placeImageIndexes);
  const selectedPlace = findPlaceById(places, onePick);
  const selectedImage = selectedPlace
    ? getPlaceImageSelection(selectedPlace, placeImageIndexes[onePick] ?? 0)
    : undefined;
  // eslint-disable-next-line no-undef -- File is a TS DOM lib type, not a runtime global
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [agreeA, setAgreeA] = useState(false);
  const [agreeB, setAgreeB] = useState(false);
  const { phase, stageIndex, elapsed, start, reset } = useComposeRun();

  return (
    <PhotoUpload
      onePickName={selectedPlace?.name ?? '선택한 장소'}
      onePickPhoto={selectedImage?.imageUrl}
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
