import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhotoUpload } from '../components/organisms/PhotoUpload';
import { useComposeRun } from '../hooks/useComposeRun';
import {
  CompositionApiError,
  createComposition,
  fetchComposition,
  type CompositionJob,
} from '../lib/compositionApi';
import { getCompositionResult } from '../lib/compositionResult';
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
  const [jobId, setJobId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const setCompositionDownloadUrl = useAppStore((s) => s.setCompositionDownloadUrl);
  const setCompositionCompletedAt = useAppStore((s) => s.setCompositionCompletedAt);
  const setCompositionWarnings = useAppStore((s) => s.setCompositionWarnings);
  const { phase, stageIndex, elapsed, start, applyServerStatus, fail, reset } = useComposeRun();

  const applyCompositionJob = useCallback(
    (job: CompositionJob) => {
      applyServerStatus(job.status, job.progress);
      const result = getCompositionResult(job);
      if (result.kind === 'completed') {
        setCompositionDownloadUrl(toAbsoluteDownloadUrl(result.downloadUrl));
        setCompositionCompletedAt(new Date().toISOString());
        // 결과를 막지 않는 품질 경고. 이 이미지에 대한 것이므로 결과와 함께 넘긴다.
        setCompositionWarnings(job.safety?.warnings ?? []);
      } else if (result.kind === 'failed') {
        setErrorMessage(
          result.message ?? '생성 결과를 준비하지 못했습니다. 잠시 후 다시 시도해 주세요.',
        );
        fail();
      }
    },
    [
      applyServerStatus,
      fail,
      setCompositionCompletedAt,
      setCompositionDownloadUrl,
      setCompositionWarnings,
    ],
  );

  useEffect(() => {
    if (!jobId || phase !== 'running') return;

    let cancelled = false;
    const poll = async () => {
      try {
        const job = await fetchComposition(jobId);
        if (cancelled) return;
        applyCompositionJob(job);
      } catch (error) {
        if (cancelled) return;
        setErrorMessage(errorMessageOf(error));
        fail();
      }
    };

    void poll();
    const intervalId = window.setInterval(() => void poll(), 1500);
    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [applyCompositionJob, fail, jobId, phase]);

  const handleStart = async () => {
    if (!photoFile || !selectedPlace) return;
    setErrorMessage(null);
    setCompositionDownloadUrl('');
    setCompositionCompletedAt('');
    setCompositionWarnings([]);
    start();
    try {
      const job = await createComposition({
        photo: photoFile,
        onePickId: selectedPlace.id,
        aspectRatio: '4:5',
        backgroundImageUrl: selectedImage?.imageUrl,
      });
      setJobId(job.jobId);
      applyCompositionJob(job);
    } catch (error) {
      setErrorMessage(errorMessageOf(error));
      fail();
    }
  };

  const handleReset = () => {
    setJobId(null);
    setErrorMessage(null);
    setCompositionDownloadUrl('');
    setCompositionCompletedAt('');
    setCompositionWarnings([]);
    reset();
  };

  return (
    <PhotoUpload
      onePickName={selectedPlace?.name ?? '선택한 장소'}
      onePickPhoto={selectedImage?.imageUrl}
      photoFile={photoFile}
      onPhotoSelect={(file) => {
        setPhotoFile(file);
        if (phase === 'failed') handleReset();
      }}
      agreeA={agreeA}
      agreeB={agreeB}
      onToggleA={() => setAgreeA((v) => !v)}
      onToggleB={() => setAgreeB((v) => !v)}
      phase={phase}
      stageIndex={stageIndex}
      elapsed={elapsed}
      onStart={() => void handleStart()}
      onReset={handleReset}
      onNext={() => navigate('/composite-result')}
      errorMessage={errorMessage}
    />
  );
}

function errorMessageOf(error: unknown) {
  if (error instanceof CompositionApiError) return error.message;
  return 'AI 생성 서비스에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.';
}

function toAbsoluteDownloadUrl(downloadUrl: string) {
  if (/^https?:\/\//i.test(downloadUrl)) return downloadUrl;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:8080/api/v1';
  const origin = new URL(apiBaseUrl).origin;
  return new URL(downloadUrl, origin).toString();
}
