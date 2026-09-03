import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageSlot } from '../atoms/ImageSlot';

export type PickOption = {
  id: string;
  title: string;
  description?: string;
  image?: string;
  icon?: ReactNode;
  badge?: string;
};

type OnePickCarouselProps = {
  options: PickOption[];
  /** Currently selected (committed) option id. */
  value?: string;
  onChange?: (id: string) => void;
  /** Fires when the active (foreground) card changes — distinct from `onChange`. */
  onActiveChange?: (id: string) => void;
};

const DESKTOP_QUERY = '(min-width: 640px)';

/**
 * "One pick" card carousel.
 *
 * - Mobile: horizontal CSS scroll-snap row with the neighbours peeking at the edges.
 * - Desktop (`sm+`): a centred cover-flow stack — the active card sits forward and
 *   sharp, the others fall back, shrink and blur. No scrollbar, no cropping.
 * - `active` (what you're looking at) and `value` (what you picked) stay distinct.
 */
export function OnePickCarousel({
  options,
  value,
  onChange,
  onActiveChange,
}: OnePickCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Kept in a ref so the scroll listener (attached once) always sees fresh data.
  const latest = useRef({ options, onActiveChange });
  latest.current = { options, onActiveChange };

  const recomputeActive = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const centre = scroller.scrollLeft + scroller.clientWidth / 2;
    let nearest = 0;
    let nearestDist = Infinity;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const cardCentre = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(cardCentre - centre);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    });
    setActiveIndex((prev) => {
      if (prev !== nearest) latest.current.onActiveChange?.(latest.current.options[nearest]?.id);
      return nearest;
    });
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || isDesktop) return;
    let frame = 0;
    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(recomputeActive);
    };
    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      scroller.removeEventListener('scroll', onScroll);
    };
  }, [recomputeActive, isDesktop]);

  // When the options first arrive: pick the starting card (the one matching
  // `value`, else the middle card on odd counts), centre it, and tell the parent.
  useEffect(() => {
    if (options.length === 0) return;
    const index = value
      ? Math.max(
          options.findIndex((o) => o.id === value),
          0,
        )
      : options.length % 2 === 1
        ? (options.length - 1) / 2
        : 0;
    setActiveIndex(index);
    onActiveChange?.(options[index]?.id);
    const centre = () => {
      const scroller = scrollerRef.current;
      // Query the DOM rather than trust `cardRefs`: inline ref callbacks briefly
      // null out during re-renders and could race this timer.
      const card = scroller?.querySelectorAll<HTMLElement>('[role="radio"]')[index];
      // No-op on desktop: the row is `overflow-visible` there, so scrollLeft stays 0.
      if (scroller && card) {
        scroller.scrollLeft = card.offsetLeft + card.offsetWidth / 2 - scroller.clientWidth / 2;
      }
    };
    // Layout may not be settled yet — retry across a few frames (and once more on
    // a timeout, in case rAF is throttled). Re-centring is idempotent.
    window.requestAnimationFrame(centre);
    window.requestAnimationFrame(() => window.requestAnimationFrame(centre));
    const timer = window.setTimeout(centre, 120);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run when the card count changes
  }, [options.length]);

  const goTo = (index: number) => {
    const clamped = Math.min(Math.max(index, 0), options.length - 1);
    const scroller = scrollerRef.current;
    const card = cardRefs.current[clamped];
    if (!isDesktop && scroller && card) {
      scroller.scrollLeft = card.offsetLeft + card.offsetWidth / 2 - scroller.clientWidth / 2;
    }
    setActiveIndex((prev) => {
      if (prev !== clamped) onActiveChange?.(options[clamped]?.id);
      return clamped;
    });
  };

  // One click / Enter both brings the card forward and commits it.
  const handleCardActivate = (index: number, id: string) => {
    goTo(index);
    onChange?.(id);
  };

  const coverFlowStyle = (offset: number): CSSProperties | undefined => {
    if (!isDesktop) return undefined;
    const abs = Math.abs(offset);
    const scale = abs === 0 ? 1 : abs === 1 ? 0.86 : 0.72;
    const shift = offset === 0 ? 0 : Math.sign(offset) * (78 + (abs - 1) * 62);
    return {
      transform: `translateX(calc(-50% + ${shift}%)) scale(${scale})`,
      zIndex: 30 - abs * 10,
      opacity: abs === 0 ? 1 : abs === 1 ? 0.62 : 0.32,
      filter: abs === 0 ? 'none' : `blur(${abs === 1 ? 1.5 : 3}px)`,
      pointerEvents: abs >= 3 ? 'none' : 'auto',
    };
  };

  return (
    <div className="relative">
      {options.length > 1 && (
        <>
          <button
            type="button"
            aria-label="이전 카드"
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="absolute left-0 top-[42%] z-40 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-ink-muted shadow-bar transition hover:border-brand hover:text-brand disabled:opacity-0 sm:flex"
          >
            <ChevronLeft size={20} strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label="다음 카드"
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex === options.length - 1}
            className="absolute right-0 top-[42%] z-40 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-ink-muted shadow-bar transition hover:border-brand hover:text-brand disabled:opacity-0 sm:flex"
          >
            <ChevronRight size={20} strokeWidth={2} />
          </button>
        </>
      )}
      <div
        ref={scrollerRef}
        role="radiogroup"
        aria-label="원픽 장소 선택"
        className="no-scrollbar flex snap-x snap-proximity gap-3 overflow-x-auto px-[calc((100%-min(82vw,340px))/2)] py-2 sm:block sm:h-[470px] sm:overflow-visible sm:px-0"
      >
        {options.map((opt, i) => {
          const active = i === activeIndex;
          const selected = opt.id === value;
          return (
            <div
              key={opt.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              role="radio"
              aria-checked={selected}
              aria-label={opt.title}
              tabIndex={0}
              onClick={() => handleCardActivate(i, opt.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardActivate(i, opt.id);
                } else if (e.key === 'ArrowRight') {
                  e.preventDefault();
                  goTo(i + 1);
                  cardRefs.current[Math.min(i + 1, options.length - 1)]?.focus();
                } else if (e.key === 'ArrowLeft') {
                  e.preventDefault();
                  goTo(i - 1);
                  cardRefs.current[Math.max(i - 1, 0)]?.focus();
                }
              }}
              style={coverFlowStyle(i - activeIndex)}
              className={`relative w-[82vw] max-w-[340px] shrink-0 cursor-pointer snap-center overflow-hidden rounded-[20px] border bg-white text-left transition duration-300 ease-[cubic-bezier(.22,1,.36,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:absolute sm:left-1/2 sm:top-0 sm:w-[272px] sm:[transition-duration:450ms] sm:[transition-property:transform,opacity,filter,box-shadow] ${
                selected ? 'border-brand' : 'border-line'
              } ${!isDesktop ? (active ? 'scale-100 opacity-100' : 'scale-[0.96] opacity-70') : ''} ${
                isDesktop && active ? 'shadow-[0_24px_60px_rgba(16,24,40,.20)]' : ''
              }`}
            >
              <div className="relative aspect-[4/3] bg-fill sm:aspect-[4/5]">
                <ImageSlot src={opt.image} alt={opt.title} placeholder="사진" />
                {opt.badge && (
                  <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-2.5 py-1 text-xs font-bold text-white">
                    {opt.badge}
                  </span>
                )}
                {selected && (
                  <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white shadow-[0_2px_8px_rgba(16,24,40,.25)]">
                    <Check size={16} strokeWidth={2.6} />
                  </span>
                )}
              </div>
              <div className={`px-5 pb-5 pt-4 ${selected ? 'bg-brand-tint/40' : ''}`}>
                <div className="flex items-center gap-2">
                  {opt.icon}
                  <div className="text-lg font-extrabold -tracking-[.4px]">{opt.title}</div>
                </div>
                {opt.description && (
                  <p className="mt-1.5 text-[13px] leading-[1.6] text-ink-soft">
                    {opt.description}
                  </p>
                )}
                <div
                  className={`mt-3.5 text-xs font-bold ${selected ? 'text-brand' : 'text-ink-soft'}`}
                >
                  {selected ? '선택됨' : '탭하면 이 장소로 선택'}
                </div>
              </div>
              {selected && (
                <span className="pointer-events-none absolute inset-0 rounded-[20px] border-2 border-brand" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-1.5 sm:mt-8" aria-hidden>
        {options.map((opt, i) => (
          <span
            key={opt.id}
            className={`h-1.5 rounded-full transition-all duration-200 ${
              i === activeIndex ? 'w-4 bg-brand' : 'w-1.5 bg-line'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
