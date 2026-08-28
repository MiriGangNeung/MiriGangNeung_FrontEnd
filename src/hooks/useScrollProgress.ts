import { useEffect, useState, type RefObject } from 'react';

/**
 * Scroll-scrub progress (0 → 1) for an element as it passes through the viewport.
 * rAF-throttled so parallax/scrub bindings stay smooth on touch devices.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const element = ref.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const scrollable = Math.max(element.offsetHeight, 1);
      setProgress(Math.min(1, Math.max(0, -rect.top / scrollable)));
    };
    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [ref]);

  return progress;
}
