import { useEffect, useRef, useState } from 'react';

type RevealOptions = {
  /** Fraction of the element that must be visible before revealing. */
  threshold?: number;
  /** Viewport inset — a negative bottom margin reveals slightly before entry. */
  rootMargin?: string;
};

export function useScrollReveal<T extends HTMLElement>({
  threshold = 0.2,
  rootMargin = '0px 0px -22% 0px',
}: RevealOptions = {}) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, visible };
}
