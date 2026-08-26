import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { PhotoExperienceSection } from './PhotoExperienceSection';

describe('PhotoExperienceSection', () => {
  it('uses a left content column beside the comparison image on desktop while retaining the mobile flow', () => {
    const markup = renderToStaticMarkup(<PhotoExperienceSection />);

    expect(markup).toContain('md:grid-cols-[minmax(0,360px)_minmax(0,1fr)]');
    expect(markup).toContain('md:text-left');
    expect(markup).toContain('md:justify-start');
    expect(markup).toContain('flex-col');
    expect(markup).toContain(
      'h-14 w-14 items-center justify-center rounded-full border border-line',
    );
    expect(markup).toContain('width="32"');
  });
});
