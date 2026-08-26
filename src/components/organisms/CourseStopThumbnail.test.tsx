import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CourseStopThumbnail } from './CourseStopThumbnail';
import type { CourseStop } from '../../types/domain';

const baseStop: CourseStop = {
  id: 'stop-1',
  n: 1,
  name: '장소 예시',
  time: '09:00',
  stay: '60분',
  crowd: 'easy',
  note: '장소 설명',
  lat: 37.77,
  lng: 128.94,
};

describe('CourseStopThumbnail', () => {
  it('does not reserve an empty image area for an externally added place', () => {
    const markup = renderToStaticMarkup(
      <CourseStopThumbnail stop={{ ...baseStop, external: true }} />,
    );

    expect(markup).toBe('');
  });

  it('keeps the tourism place thumbnail in the course card', () => {
    const markup = renderToStaticMarkup(
      <CourseStopThumbnail
        stop={{ ...baseStop, thumbnailUrl: 'https://tour.example/place.jpg' }}
      />,
    );

    expect(markup).toContain('src="https://tour.example/place.jpg"');
  });
});
