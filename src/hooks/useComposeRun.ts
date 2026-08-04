import { useEffect, useRef, useState } from 'react';
import { COMPOSE_STAGES } from '../data/places';
import type { ComposePhase } from '../types/domain';

export function useComposeRun() {
  const [phase, setPhase] = useState<ComposePhase>('ready');
  const [stageIndex, setStageIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const timers = useRef<ReturnType<typeof window.setInterval>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(window.clearInterval);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const start = () => {
    clearTimers();
    const t0 = Date.now();
    setPhase('running');
    setStageIndex(0);
    setElapsed(0);
    timers.current.push(window.setInterval(() => setElapsed((Date.now() - t0) / 1000), 100));
    timers.current.push(
      window.setInterval(() => {
        setStageIndex((i) => {
          const next = i + 1;
          if (next >= COMPOSE_STAGES.length) {
            clearTimers();
            setPhase('done');
          }
          return next;
        });
      }, 1500),
    );
  };

  const reset = () => {
    clearTimers();
    setPhase('ready');
    setStageIndex(0);
    setElapsed(0);
  };

  return { phase, stageIndex, elapsed, start, reset };
}
