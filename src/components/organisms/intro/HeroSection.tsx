import { Mouse } from 'lucide-react';
import type { Ref, RefObject } from 'react';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { useScrollProgress } from '../../../hooks/useScrollProgress';
import { REVEAL_BASE, revealClass } from '../../../lib/introMotion';
import { SectionWave } from './SectionWave';

export function HeroSection({ heroRef }: { heroRef: RefObject<HTMLElement | null> }) {
  const { ref: copyRef, visible } = useScrollReveal<HTMLDivElement>();
  const progress = useScrollProgress(heroRef);
  const drift = {
    transform: `translateY(${progress * -36}px)`,
    opacity: Math.max(0, 1 - progress * 1.7),
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
      <div className="absolute inset-0 bg-gradient-to-r from-sea-deep/70 via-sea-deep/25 to-transparent" />
      <div
        ref={copyRef}
        style={visible ? drift : undefined}
        className={`relative z-10 mx-auto w-full max-w-[1560px] px-8 pb-48 pt-28 text-white md:px-16 md:pb-96 md:pt-32 ${REVEAL_BASE} ${revealClass(visible)}`}
      >
        <p className="text-xs font-bold tracking-[0.3em] text-white/70">GANGNEUNG, IN ADVANCE</p>
        <p className="mt-5 font-serif text-6xl font-bold tracking-[-0.04em] md:text-8xl">
          미리 강릉
        </p>
        <p className="mt-7 text-lg font-medium leading-relaxed text-white/90 md:text-xl">
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
