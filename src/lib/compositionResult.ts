import type { CompositionError, CompositionStatus } from './compositionApi';

type CompositionResultInput = {
  status: CompositionStatus;
  resultAvailable: boolean;
  downloadUrl: string | null;
  error: CompositionError | null;
};

export type CompositionResult =
  | { kind: 'pending' }
  | { kind: 'completed'; downloadUrl: string }
  | { kind: 'failed'; message?: string | null };

export function getCompositionResult(job: CompositionResultInput): CompositionResult {
  if (job.status === 'DONE') {
    return job.resultAvailable && job.downloadUrl
      ? { kind: 'completed', downloadUrl: job.downloadUrl }
      : { kind: 'failed' };
  }

  if (job.status === 'FAILED') {
    return { kind: 'failed', message: job.error?.message };
  }

  return { kind: 'pending' };
}
