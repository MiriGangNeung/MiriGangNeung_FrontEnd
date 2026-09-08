import { useCallback, useEffect, useRef, useState } from 'react';
import { toCompositionProgress } from '../lib/compositionProgress';
import type { CompositionStatus } from '../lib/compositionApi';
import type { ComposePhase } from '../types/domain';

export function useComposeRun() {
  const [phase, setPhase] = useState<ComposePhase>('ready');
  const [stageIndex, setStageIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const timers = useRef<ReturnType<typeof window.setInterval>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(window.clearInterval);
    timers.current = [];
  }, []);
  useEffect(() => clearTimers, [clearTimers]);

  const start = useCallback(() => {
    clearTimers();
    const t0 = Date.now();
    setPhase('running');
    setStageIndex(0);
    setElapsed(0);
    timers.current.push(window.setInterval(() => setElapsed((Date.now() - t0) / 1000), 100));
  }, [clearTimers]);

  const applyServerStatus = useCallback(
    (status: CompositionStatus, progress: number) => {
      const next = toCompositionProgress({ status, progress });
      setPhase(next.phase);
      setStageIndex(next.stageIndex);
      if (next.phase === 'done' || next.phase === 'failed') clearTimers();
    },
    [clearTimers],
  );

  const fail = useCallback(() => {
    clearTimers();
    setPhase('failed');
  }, [clearTimers]);

  const reset = useCallback(() => {
    clearTimers();
    setPhase('ready');
    setStageIndex(0);
    setElapsed(0);
  }, [clearTimers]);

  return { phase, stageIndex, elapsed, start, applyServerStatus, fail, reset };
}
