import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { useScrollProgress } from '../../../hooks/useScrollProgress';
import { REVEAL_BASE, revealClass, revealDelay } from '../../../lib/introMotion';
import { SectionWave } from './SectionWave';

export function CtaSection() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: copyRef, visible } = useScrollReveal<HTMLDivElement>();
  const progress = useScrollProgress(sectionRef);
  return (
    <section
      ref={sectionRef}
      className="relative min-h-[560px] overflow-hidden bg-sea-deep px-7 pb-28 pt-44 text-white md:min-h-[680px] md:px-16 md:pb-40 md:pt-60"
    >
      <img
        src="/images/intro/cta-cafe.png"
        alt="강릉 바다와 카페"
        className="absolute inset-0 h-full w-full object-cover motion-reduce:!transform-none"
        style={{
          objectPosition: 'right 90%',
          transform: `scale(${1.05 + progress * 0.06}) translateY(${(progress - 0.5) * -6}%)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-sea-deep/85 via-sea-deep/40 to-transparent" />
      <SectionWave fillClass="fill-sand" position="top" />
      <div ref={copyRef} className="relative z-10 mx-auto max-w-[1440px]">
        <p
          className={`text-xs font-bold tracking-[0.3em] text-white/70 ${REVEAL_BASE} ${revealClass(visible)}`}
        >
          마지막 정거장 · 출발
        </p>
        <h2
          className={`mt-5 font-serif text-4xl font-bold leading-[1.35] tracking-[-0.04em] md:text-6xl ${REVEAL_BASE} ${revealClass(visible)}`}
          style={revealDelay(1)}
        >
          이제,
          <br />
          강릉으로 떠나볼까요?
        </h2>
        <p
          className={`mt-6 text-lg text-white/90 ${REVEAL_BASE} ${revealClass(visible)}`}
          style={revealDelay(2)}
        >
          당신만의 완벽한 강릉 여행을 시작해보세요.
        </p>
        <button
          type="button"
          onClick={() => navigate('/background-picker')}
          style={revealDelay(3)}
          className={`group mt-10 inline-flex items-center gap-5 rounded-full bg-dive px-8 py-4 font-bold text-white shadow-sunrise transition hover:bg-dive-dark ${REVEAL_BASE} ${revealClass(visible)}`}
        >
          시작하기 <ArrowRight className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );
}
