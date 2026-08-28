export type RevealDirection = 'up' | 'left' | 'right';

const HIDDEN: Record<RevealDirection, string> = {
  up: 'translate-y-12 opacity-0',
  left: '-translate-x-10 opacity-0',
  right: 'translate-x-10 opacity-0',
};

/**
 * Shared transition contract for scroll-reveal elements on the intro page.
 * Only transform + opacity animate (compositor-friendly); honours reduced motion.
 */
export const REVEAL_BASE =
  'transition-[transform,opacity] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-reduce:transition-none';

export function revealClass(visible: boolean, direction: RevealDirection = 'up') {
  return visible ? 'translate-x-0 translate-y-0 opacity-100' : HIDDEN[direction];
}

/** Staggered delay for list children; capped so trailing items don't lag. */
export function revealDelay(index: number, step = 140, cap = 6): { transitionDelay: string } {
  return { transitionDelay: `${Math.min(index, cap) * step}ms` };
}
