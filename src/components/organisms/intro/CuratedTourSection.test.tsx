import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { CuratedTourSection } from './CuratedTourSection';

describe('CuratedTourSection', () => {
  it('renders the enlarged course story with the requested line break and illustrated route', () => {
    const markup = renderToStaticMarkup(<CuratedTourSection />);

    expect(markup).toContain('가장 알맞는 코스를<br/>추천해드립니다.');
    expect(markup).toContain('xl:text-[26px]');
    expect(markup).toContain('stroke-dasharray="4 8"');
    expect(markup).toContain('lucide-camera');
    expect(markup).toContain('lucide-map-pin');
    expect(markup).toContain('lucide-flag');
  });

  it('keeps the desktop story and compact tour cards in one row with a wave divider', () => {
    const markup = renderToStaticMarkup(<CuratedTourSection />);

    expect(markup).toContain('xl:grid-cols-[280px_minmax(0,1fr)]');
    expect(markup).toContain('whitespace-nowrap');
    expect(markup).toContain('md:max-w-[140px]');
    expect(markup).toContain('xl:gap-14');
    expect(markup).toContain('data-route-marker="true"');
    expect(markup).toContain('top-full');
    expect(markup).toContain('text-canvas');
    expect(markup).toContain('data-testid="curated-tour-wave"');
  });
});
