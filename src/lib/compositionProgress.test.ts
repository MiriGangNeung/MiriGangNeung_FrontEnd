import { describe, expect, it } from 'vitest';

describe('compositionProgress', () => {
  it('maps the backend composing state to the matching visible progress step', async () => {
    const progress = await import('./compositionProgress').catch(() => null);
    expect(progress).not.toBeNull();
    if (!progress) return;

    expect(progress.toCompositionProgress({ status: 'COMPOSITING', progress: 55 })).toEqual({
      phase: 'running',
      stageIndex: 2,
    });
  });

  it('keeps failed jobs distinct from successful completions', async () => {
    const progress = await import('./compositionProgress').catch(() => null);
    expect(progress).not.toBeNull();
    if (!progress) return;

    expect(progress.toCompositionProgress({ status: 'DONE', progress: 100 })).toEqual({
      phase: 'done',
      stageIndex: 4,
    });
    expect(progress.toCompositionProgress({ status: 'FAILED', progress: 55 })).toEqual({
      phase: 'failed',
      stageIndex: 2,
    });
  });
});
