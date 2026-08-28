import { Mouse } from 'lucide-react';
import type { CSSProperties, Ref, RefObject } from 'react';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { useScrollProgress } from '../../../hooks/useScrollProgress';
import { SectionWave } from './SectionWave';

const HERO_WORDS = ['미리', '강릉'];

// Slow, deceleration-heavy easing — the entrance should feel unhurried.
const EASE = 'cubic-bezier(0.16,1,0.3,1)';
const REVEAL =
  'transition-[filter,transform,opacity] will-change-[filter,transform,opacity] motion-reduce:!transition-none';

export function HeroSection({ heroRef }: { heroRef: RefObject<HTMLElement | null> }) {
  const { ref: copyRef, visible } = useScrollReveal<HTMLDivElement>();
  const progress = useScrollProgress(heroRef);
  const drift = {
    transform: `translateY(${progress * -36}px)`,
    opacity: Math.max(0, 1 - progress * 1.7),
  };

  // Staggered, unhurried entrance: eyebrow → title words → body, each easing in
  // from a soft blur and a small rise rather than one shared 48px jump.
  const line = (delay: number, rise = '0.6em', duration = 1200): CSSProperties =>
    visible
      ? {
          opacity: 1,
          filter: 'blur(0px)',
          transform: 'translateY(0)',
          transitionDelay: `${delay}ms`,
          transitionDuration: `${duration}ms`,
          transitionTimingFunction: EASE,
        }
      : {
          opacity: 0,
          filter: 'blur(4px)',
          transform: `translateY(${rise})`,
          transitionDuration: `${duration}ms`,
          transitionTimingFunction: EASE,
        };

  const word = (i: number): CSSProperties =>
    visible
      ? {
          opacity: 1,
          filter: 'blur(0px)',
          transform: 'translateY(0)',
          transitionDelay: `${320 + i * 320}ms`,
          transitionDuration: '1600ms',
          transitionTimingFunction: EASE,
        }
      : {
          opacity: 0,
          filter: 'blur(12px)',
          transform: 'translateY(0.24em)',
          transitionDuration: '1600ms',
          transitionTimingFunction: EASE,
        };

  return (
    <section
      ref={heroRef as Ref<HTMLElement>}
      className="relative flex min-h-[600px] items-center overflow-hidden bg-sea-deep md:min-h-[680px]"
    >
      <img
        src="/images/intro/hero-jeongdongjin-v2.png"
        alt="정동진 해안을 달리는 열차"
        className="absolute inset-0 h-full w-full object-cover motion-reduce:!transform-none"
        style={{
          objectPosition: 'center 74%',
          transform: `translateY(${progress * 14}%) scale(${1 + progress * 0.08})`,
        }}
      />

      {/* Sun bloom over the horizon — light, not a hue accent. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[4%] top-[24%] h-[52vw] max-h-[540px] w-[52vw] max-w-[540px] -translate-y-1/2 animate-sun-breathe rounded-full bg-[radial-gradient(circle,rgba(255,250,238,0.92),rgba(255,243,214,0.22)_38%,transparent_70%)] mix-blend-screen motion-reduce:animate-none"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-sea-deep/70 via-sea-deep/25 to-transparent" />
      <div
        ref={copyRef}
        style={visible ? drift : undefined}
        className="relative z-10 mx-auto w-full max-w-[1440px] px-8 pb-48 pt-28 text-white md:px-16 md:pb-96 md:pt-32"
      >
        <p
          className={`text-xs font-bold tracking-[0.3em] text-white/70 ${REVEAL}`}
          style={line(0, '0.7em', 1000)}
        >
          GANGNEUNG, IN ADVANCE
        </p>
        <h1
          aria-label="미리 강릉"
          className="mt-5 flex gap-[0.28em] font-serif text-6xl font-bold tracking-[-0.04em] md:text-8xl"
        >
          {HERO_WORDS.map((w, i) => (
            <span key={w} aria-hidden="true" className={`inline-block ${REVEAL}`} style={word(i)}>
              {w}
            </span>
          ))}
        </h1>
        <p
          className={`mt-7 text-lg font-medium leading-relaxed text-white/90 md:text-xl ${REVEAL}`}
          style={line(1050, '0.7em', 1200)}
        >
          미리 강릉에서의 특별한 여행을
          <br />
          가장 완벽하게 계획해보세요.
        </p>
      </div>
      <div className="absolute bottom-28 left-8 z-20 flex flex-col items-center gap-2 text-[10px] font-bold tracking-widest text-white/80 md:left-16">
        <Mouse size={25} className="animate-bounce" /> SCROLL
      </div>
      <SectionWave fillClass="fill-sand" />
    </section>
  );
}
