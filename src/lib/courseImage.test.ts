import { describe, expect, it } from 'vitest';

import { buildCourseCardSvg } from './courseImage';

describe('buildCourseCardSvg', () => {
  it('renders the course summary and every stop in visit order', () => {
    const svg = buildCourseCardSvg({
      title: '나만의 강릉 코스',
      stops: [
        {
          id: 'stop-1',
          n: 1,
          name: '안목해변 & 커피거리',
          time: '09:00',
          stay: '60분',
          crowd: 'easy',
          note: '강릉시 창해로',
          lat: 37.7,
          lng: 128.9,
          external: false,
        },
        {
          id: 'stop-2',
          n: 2,
          name: '동화가든',
          time: '11:00',
          stay: '60분',
          crowd: 'easy',
          note: '강릉시 초당동',
          address: '강릉시 초당동',
          lat: 37.7,
          lng: 128.9,
          external: true,
          category: 'restaurant',
        },
      ],
      totalDistanceMeters: 25_500,
      totalTravelMinutes: 394,
      tags: ['식도락 · 휴식', '친구'],
      compositeImageDataUrl: 'data:image/png;base64,course-image',
    });

    expect(svg).toContain('width="1600"');
    expect(svg).toContain('height="1000"');
    expect(svg).toContain('x="40" y="40" width="880" height="920"');
    expect(svg).not.toContain('width="1080"');
    expect(svg).toContain('COURSE INFO');
    expect(svg).toContain('cx="1002" cy="502"');
    expect(svg).not.toContain('cx="1002" cy="486"');
    expect(svg).toContain('총 2곳');
    expect(svg).toContain('25.5km');
    expect(svg).toContain('394분');
    expect(svg).toContain('식도락 · 휴식');
    expect(svg).toContain('친구');
    expect(svg).toContain('data:image/png;base64,course-image');
    expect(svg).toContain('안목해변 &amp; 커피거리');
    expect(svg).toContain('동화가든');
    expect(svg.indexOf('안목해변')).toBeLessThan(svg.indexOf('동화가든'));
  });
});
