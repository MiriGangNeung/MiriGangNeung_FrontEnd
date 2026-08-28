import { createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { HeroSection } from './HeroSection';

describe('HeroSection', () => {
  it('uses the wider hero composition without overscaling the train image', () => {
    const markup = renderToStaticMarkup(<HeroSection heroRef={createRef<HTMLElement>()} />);

    expect(markup).toContain('/images/intro/hero-jeongdongjin-v2.png');
    expect(markup).toContain('h-full w-full object-cover');
    expect(markup).toContain('pb-48');
    expect(markup).toContain('md:pb-96');
    expect(markup).toContain('data-testid="section-wave"');
  });
});
