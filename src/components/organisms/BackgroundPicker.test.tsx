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

  it('shows the curated default thumbnail on the background picker only', () => {
    const markup = renderToStaticMarkup(
      <BackgroundPicker
        places={[
          {
            id: 'anmok-id',
            name: '안목해변',
            region: '강릉시',
            tags: ['해변'],
            cat: 'beach',
            lat: 37.7,
            lng: 128.9,
            thumbnailUrl: 'https://tour.example/anmok-1.jpg',
            imageUrls: [
              'https://tour.example/anmok-1.jpg',
              'https://tour.example/anmok-2.jpg',
              'https://tour.example/anmok-3.jpg',
              'https://tour.example/anmok-4.jpg',
              'https://tour.example/anmok-5.jpg',
            ],
          },
        ]}
        tab="all"
        onTab={() => undefined}
        picks={[]}
        placeImageIndexes={{}}
        maxPicks={3}
        onTogglePick={() => undefined}
        onPlaceImageIndexChange={() => undefined}
        onNext={() => undefined}
      />,
    );

    expect(markup).toContain('alt="안목해변 사진 1"');
    expect(markup).toContain('src="https://tour.example/anmok-5.jpg"');
  });
});
