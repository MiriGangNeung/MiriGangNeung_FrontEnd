import { Camera, ChevronLeft, ChevronRight, Image as ImageIcon, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { PointerEvent } from 'react';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { REVEAL_BASE, revealClass } from '../../../lib/introMotion';
import { clampComparisonPercent } from '../../../lib/introSlider';
import { SectionWave } from './SectionWave';
import { StationHeading } from './StationHeading';

const PERSON_FOCAL_POSITION = 'center 20%';
const REST_POSITION = 50;
const HINT_PEEK_POSITION = 38;
const SWEEP =
  'transition-[left,clip-path] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none';

export function PhotoExperienceSection() {
  const { ref, visible } = useScrollReveal<HTMLElement>();
  const [position, setPosition] = useState(REST_POSITION);
  const [hinted, setHinted] = useState(false);
  const [dragging, setDragging] = useState(false);
  const changePosition = (clientX: number, element: HTMLElement) =>
    setPosition(
      clampComparisonPercent(
        ((clientX - element.getBoundingClientRect().left) / element.clientWidth) * 100,
      ),
    );
  useEffect(() => {
    if (!visible || hinted || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // One gentle, CSS-transitioned peek — not a multi-step interval that reads as a shake.
    setHinted(true);
    const peek = window.setTimeout(() => setPosition(HINT_PEEK_POSITION), 450);
    const settle = window.setTimeout(() => setPosition(REST_POSITION), 1150);
    return () => {
      window.clearTimeout(peek);
      window.clearTimeout(settle);
    };
  }, [visible, hinted]);
  const endDrag = (event: PointerEvent<HTMLElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    setDragging(false);
  };
  const sweep = dragging ? '' : SWEEP;
  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-sand-deep px-7 pb-28 pt-28 md:px-16 md:pb-44 md:pt-40"
    >
      <div
        className={`mx-auto max-w-[1200px] text-center md:grid md:grid-cols-[minmax(0,360px)_minmax(0,1fr)] md:items-center md:gap-10 md:text-left ${REVEAL_BASE} ${revealClass(visible)}`}
      >
        <div>
          <StationHeading index={2} label="두 번째 · 사진 더하기" />
          <h2 className="mt-6 font-serif text-[26px] font-bold leading-[1.45] tracking-[-0.03em] text-heading md:text-[32px]">
            아직 떠나지 않았지만,
            <br />
            먼저 만나보는 여행.
          </h2>
          <p className="mt-6 text-[15px] leading-[1.6] text-copy">
            선택한 여행지에 당신의 사진을 더해
            <br />
            여행을 떠난 나의 모습을 미리 만나볼 수 있습니다.
          </p>
          <div className="my-9 flex items-center justify-center gap-4 text-[11px] font-semibold text-ink-muted md:justify-start md:gap-5">
            <span className="flex flex-col items-center gap-2 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line">
                <User size={32} />
              </span>
              나의 사진
            </span>
            <b className="mt-3 self-start text-label">+</b>
            <span className="flex flex-col items-center gap-2 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line">
                <ImageIcon size={32} />
              </span>
              선택한 여행지
            </span>
            <b className="mt-3 self-start text-label">=</b>
            <span className="flex flex-col items-center gap-2 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line">
                <Camera size={32} />
              </span>
              미리 보는 여행
            </span>
          </div>
        </div>
        <div>
          <div
            className="relative aspect-[4/3] touch-pan-y overflow-hidden rounded-3xl bg-slot shadow-panel md:aspect-[2/1]"
            onPointerMove={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId))
                changePosition(event.clientX, event.currentTarget);
            }}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              setHinted(true);
              setDragging(true);
              changePosition(event.clientX, event.currentTarget);
            }}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <img
              src="/images/intro/after-beach.png"
              alt="해변으로 합성한 결과"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: PERSON_FOCAL_POSITION }}
            />
            <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold tracking-widest text-ink">
              IMAGINED
            </span>
            <div
              className={`absolute inset-0 ${sweep}`}
              style={{ clipPath: `inset(0 0 0 ${position}%)` }}
            >
              <img
                src="/images/intro/before-cafe.png"
                alt="카페 앞 원본 사진"
                className="h-full w-full object-cover"
                style={{ objectPosition: PERSON_FOCAL_POSITION }}
              />
              <span className="absolute right-5 top-5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold tracking-widest text-ink">
                BEFORE
              </span>
            </div>
            <div
              className={`absolute inset-y-0 w-px bg-white ${sweep}`}
              style={{ left: `${position}%` }}
            />
            <button
              type="button"
              aria-label="이미지 비교 위치 조절"
              className={`absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-panel ${sweep}`}
              style={{ left: `${position}%` }}
            >
              <ChevronLeft size={17} />
              <ChevronRight size={17} />
            </button>
            <input
              aria-label="합성 전후 비교 위치"
              type="range"
              min="0"
              max="100"
              value={position}
              onChange={(event) => {
                setHinted(true);
                setPosition(Number(event.target.value));
              }}
              className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
            />
          </div>
          <p className="mt-4 text-xs text-copy">
            이미지 비교 슬라이더를 움직여 합성 효과를 확인해보세요.
          </p>
        </div>
      </div>
      <SectionWave fillClass="fill-sand" />
    </section>
  );
}
