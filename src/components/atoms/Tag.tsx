import type { ReactNode } from 'react';

type Tone = 'brand' | 'coral' | 'neutral';

const tones: Record<Tone, string> = {
  brand: 'bg-brand-tint text-brand',
  coral: 'bg-coral-tint text-coral',
  neutral: 'bg-fill text-ink-soft',
};

export function Tag({ children, tone = 'brand' }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
