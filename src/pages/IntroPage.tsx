import { useRef } from 'react';
import { IntroHeader } from '../components/organisms/intro/IntroHeader';
import { HeroSection } from '../components/organisms/intro/HeroSection';
import { PlaceSelectSection } from '../components/organisms/intro/PlaceSelectSection';
import { PhotoExperienceSection } from '../components/organisms/intro/PhotoExperienceSection';
import { CuratedTourSection } from '../components/organisms/intro/CuratedTourSection';
import { CtaSection } from '../components/organisms/intro/CtaSection';

export function IntroPage() {
  const heroRef = useRef<HTMLElement>(null);
  return (
    <main>
      <IntroHeader heroRef={heroRef} />
      <HeroSection heroRef={heroRef} />
      <PlaceSelectSection />
      <PhotoExperienceSection />
      <CuratedTourSection />
      <CtaSection />
    </main>
  );
}
