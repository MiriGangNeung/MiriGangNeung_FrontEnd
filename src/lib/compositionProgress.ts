import type { CompositionStatus } from './compositionApi';

export type CompositionPhase = 'ready' | 'running' | 'done' | 'failed';

type CompositionProgressInput = {
  status: CompositionStatus;
  progress: number;
};

export function toCompositionProgress({ status, progress }: CompositionProgressInput): {
  phase: CompositionPhase;
  stageIndex: number;
} {
  if (status === 'DONE') return { phase: 'done', stageIndex: 4 };
  if (status === 'FAILED') return { phase: 'failed', stageIndex: stageIndexForProgress(progress) };
  return { phase: 'running', stageIndex: stageIndexForStatus(status, progress) };
}

function stageIndexForStatus(
  status: Exclude<CompositionStatus, 'DONE' | 'FAILED'>,
  progress: number,
) {
  switch (status) {
    case 'QUEUED':
      return 0;
    case 'ANALYZING':
      return 1;
    case 'COMPOSITING':
      return 2;
    case 'QUALITY_CHECK':
      return 3;
    default:
      return stageIndexForProgress(progress);
  }
}

function stageIndexForProgress(progress: number) {
  if (progress >= 80) return 3;
  if (progress >= 55) return 2;
  if (progress >= 25) return 1;
  return 0;
}
