type SectionWaveProps = {
  /** Tailwind fill-color class for the front crest — the colour of the section it pours into. */
  fillClass: string;
  /** 'bottom' (default) pours downward; 'top' hangs from the top edge. */
  position?: 'bottom' | 'top';
};

// One tile spans 0–1200; two identical tiles sit side by side, so translateX(-50%) loops seamlessly.
// Endpoints share the same y and a flat (horizontal) tangent, so the repeat is a smooth streamline.
const CREST =
  'M0,72 C200,72 250,28 450,28 C650,28 700,116 900,116 C1100,116 1150,72 1200,72 V140 H0 Z';
const CREST_BACK =
  'M0,90 C200,90 250,120 450,120 C650,120 700,44 900,44 C1100,44 1150,90 1200,90 V140 H0 Z';

/**
 * Layered wave divider: a soft sea-tinted back swell for depth plus a solid
 * streamlined crest in the next section's colour, each drifting at its own speed
 * so the seam reads as gently moving water. Visible at rest; still under
 * reduced-motion.
 */
export function SectionWave({ fillClass, position = 'bottom' }: SectionWaveProps) {
  const flip = position === 'top' ? 'top-0 -scale-y-100' : 'bottom-0';
  return (
    <div
      data-testid="section-wave"
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 z-10 h-20 overflow-hidden md:h-32 ${flip}`}
    >
      <div className="absolute inset-x-0 bottom-0 flex w-[200%] animate-wave-trail motion-reduce:animate-none">
        {[0, 1].map((i) => (
          <svg
            key={i}
            className="h-16 w-1/2 fill-sea/15 md:h-24"
            viewBox="0 0 1200 140"
            preserveAspectRatio="none"
          >
            <path d={CREST_BACK} />
          </svg>
        ))}
      </div>
      <div className="absolute inset-x-0 -bottom-px flex w-[200%] animate-wave-lead motion-reduce:animate-none">
        {[0, 1].map((i) => (
          <svg
            key={i}
            className={`h-14 w-1/2 md:h-20 ${fillClass}`}
            viewBox="0 0 1200 140"
            preserveAspectRatio="none"
          >
            <path d={CREST} />
          </svg>
        ))}
      </div>
    </div>
  );
}
