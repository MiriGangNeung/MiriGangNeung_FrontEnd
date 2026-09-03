import { useRef } from 'react';
import { ProgressHeader } from '../components/layout/ProgressHeader';
import { HeroSection } from '../components/organisms/intro/HeroSection';
import { PlaceSelectSection } from '../components/organisms/intro/PlaceSelectSection';
import { PhotoExperienceSection } from '../components/organisms/intro/PhotoExperienceSection';
import { CuratedTourSection } from '../components/organisms/intro/CuratedTourSection';
import { CtaSection } from '../components/organisms/intro/CtaSection';

export function IntroPage() {
  const heroRef = useRef<HTMLElement>(null);
  return (
    <main className="relative bg-sand">
      <ProgressHeader />
      <HeroSection heroRef={heroRef} />
      <PlaceSelectSection />
      <PhotoExperienceSection />
      <CuratedTourSection />
      <CtaSection />
      <div
        aria-hidden="true"
        className="grain-overlay pointer-events-none fixed inset-0 z-40 opacity-[0.04] mix-blend-overlay"
      />
    </main>
  );
}
