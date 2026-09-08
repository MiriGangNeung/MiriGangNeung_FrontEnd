import { describe, expect, it } from 'vitest';
import { getCompositionResult } from './compositionResult';

describe('getCompositionResult', () => {
  it('returns the download URL when a creation response is already complete', () => {
    expect(
      getCompositionResult({
        status: 'DONE',
        resultAvailable: true,
        downloadUrl: '/api/v1/compositions/job-1/download',
        error: null,
      }),
    ).toEqual({ kind: 'completed', downloadUrl: '/api/v1/compositions/job-1/download' });
  });

  it('returns a failure when a completed job has no downloadable result', () => {
    expect(
      getCompositionResult({
        status: 'DONE',
        resultAvailable: false,
        downloadUrl: null,
        error: null,
      }),
    ).toEqual({ kind: 'failed' });
  });

  it('returns the server error for a failed job', () => {
    expect(
      getCompositionResult({
        status: 'FAILED',
        resultAvailable: false,
        downloadUrl: null,
        error: {
          code: 'AI_PROVIDER_UNAVAILABLE',
          message: 'Provider is unavailable',
          retryable: true,
        },
      }),
    ).toEqual({ kind: 'failed', message: 'Provider is unavailable' });
  });
});
