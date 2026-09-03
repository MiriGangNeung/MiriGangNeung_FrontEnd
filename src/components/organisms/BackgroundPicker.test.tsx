import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { BackgroundPicker } from './BackgroundPicker';

describe('BackgroundPicker category chips', () => {
  it('keeps a selected category chip in the neutral style', () => {
    const markup = renderToStaticMarkup(
      <BackgroundPicker
        places={[]}
        tab="beach"
        onTab={() => undefined}
        picks={[]}
        placeImageIndexes={{}}
        maxPicks={3}
        onTogglePick={() => undefined}
        onPlaceImageIndexChange={() => undefined}
        onNext={() => undefined}
      />,
    );

    expect(markup).not.toContain('bg-brand text-white shadow-[0_4px_12px_rgba(47,111,237,.28)]');
  });
});
