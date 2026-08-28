import { Waves } from 'lucide-react';
import type { RefObject } from 'react';
import { useScrollProgress } from '../../../hooks/useScrollProgress';

export function IntroHeader({ heroRef }: { heroRef: RefObject<HTMLElement | null> }) {
  const progress = useScrollProgress(heroRef);
  const solid = progress > 0.5;

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300"
      style={{
        backgroundColor: `rgba(250,247,241,${progress})`,
        borderColor: `rgba(30,90,150,${progress * 0.18})`,
      }}
    >
      <div className="mx-auto flex h-[74px] max-w-[1560px] items-center px-6 md:px-10">
        <div
          className={`flex items-center gap-2.5 transition-colors duration-300 ${solid ? 'text-ink' : 'text-white'}`}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-sea text-white">
            <Waves size={18} strokeWidth={1.8} />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold -tracking-[.3px]">미리강릉</span>
            <span
              className={`text-[11px] font-medium transition-colors duration-300 ${solid ? 'text-ink-soft' : 'text-white/80'}`}
            >
              사진 합성 · 맞춤 코스
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
