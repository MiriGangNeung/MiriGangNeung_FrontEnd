import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CourseMapNearbyPlaceLabel, CourseMapStopLabel } from './CourseMapPlaceLabel';
import type { CourseStop, NearbyPlace } from '../../types/domain';

const stop: CourseStop = {
  id: 'stop-1',
  n: 1,
  name: '정동진해변',
  time: '09:00',
  stay: '60분',
  crowd: 'easy',
  note: '강릉시',
  lat: 37.69,
  lng: 129.03,
  thumbnailUrl: 'https://example.com/jeongdongjin.jpg',
  external: false,
};

const nearbyPlace: NearbyPlace = {
  externalPlaceId: 'kakao-1',
  name: '카페 예시',
  category: 'cafe',
  categoryName: '음식점 > 카페',
  address: '강릉시',
  roadAddress: '강릉시 해안로',
  phone: '',
  placeUrl: 'https://place.map.kakao.com/kakao-1',
  latitude: 37.69,
  longitude: 129.03,
  distanceMeters: 180,
  recommendationScore: 91,
};

describe('CourseMapPlaceLabel', () => {
  it('shows a course stop name with its thumbnail on the map', () => {
    const markup = renderToStaticMarkup(
      <CourseMapStopLabel number={stop.n} stop={stop} onSelect={() => undefined} />,
    );

    expect(markup).toContain('data-map-course-stop-label');
    expect(markup).toContain('data-map-course-stop-number');
    expect(markup).toContain('>1</span>');
    expect(markup).toContain('정동진해변');
    expect(markup).toContain('src="https://example.com/jeongdongjin.jpg"');
    expect(markup).toContain('alt="정동진해변"');
  });

  it('keeps an unselected nearby place as a compact map label', () => {
    const markup = renderToStaticMarkup(
      <CourseMapNearbyPlaceLabel
        place={nearbyPlace}
        selected={false}
        onSelect={() => undefined}
        onReview={() => undefined}
        onAdd={() => undefined}
      />,
    );

    expect(markup).toContain('data-map-nearby-place-label');
    expect(markup).toContain('카페 예시');
    expect(markup).not.toContain('코스에 추가');
  });

  it('opens place actions when a nearby map label is selected', () => {
    const markup = renderToStaticMarkup(
      <CourseMapNearbyPlaceLabel
        place={nearbyPlace}
        selected
        onSelect={() => undefined}
        onReview={() => undefined}
        onAdd={() => undefined}
      />,
    );

    expect(markup).toContain('data-map-nearby-place-card');
    expect(markup).toContain('카카오맵 리뷰 보기');
    expect(markup).toContain('코스에 추가');
    expect(markup).toContain('추천 91점');
  });
});
