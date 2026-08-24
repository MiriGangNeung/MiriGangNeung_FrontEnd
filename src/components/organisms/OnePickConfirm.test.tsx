import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { OnePickConfirm } from './OnePickConfirm';
import type { Place } from '../../types/domain';

describe('OnePickConfirm', () => {
  it('uses the previously selected place image as the candidate thumbnail', () => {
    const place: Place = {
      id: 'gyeongpo',
      name: '경포대',
      region: '강릉시',
      tags: ['자연'],
      cat: 'nature',
      lat: 37.8,
      lng: 128.9,
      thumbnailUrl: 'https://tour.example/one.jpg',
      imageUrls: [
        'https://tour.example/one.jpg',
        'https://tour.example/two.jpg',
        'https://tour.example/three.jpg',
      ],
    };

    const markup = renderToStaticMarkup(
      <OnePickConfirm
        places={[place]}
        picks={[place.id]}
        onePick={place.id}
        placeImageIndexes={{ [place.id]: 2 }}
        onSelect={() => undefined}
        onBack={() => undefined}
        onNext={() => undefined}
      />,
    );

    expect(markup).toContain('src="https://tour.example/three.jpg"');
    expect(markup).not.toContain('src="https://tour.example/one.jpg"');
  });
});
