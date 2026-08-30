import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { NearbyPlaceCard } from './NearbyPlaceCard';
import type { NearbyPlace } from '../../types/domain';

const place: NearbyPlace = {
  externalPlaceId: 'kakao-1',
  name: '카페 예시',
  category: 'cafe',
  categoryName: '음식점 > 카페',
  address: '강릉시',
  roadAddress: '강릉시 창해로',
  phone: '',
  placeUrl: 'https://place.map.kakao.com/123456789',
  latitude: 37.77,
  longitude: 128.94,
  distanceMeters: 120,
  nearestStopName: '경포해변',
  recommendationScore: 93,
  recommendationReasons: ['휴식 취향에 맞는 장소예요', '커플과 잘 어울리는 장소예요'],
};

describe('NearbyPlaceCard', () => {
  it('keeps place selection and Kakao review preview as separate actions', () => {
    const markup = renderToStaticMarkup(
      <NearbyPlaceCard
        place={place}
        alreadyAdded={false}
        selected={false}
        onSelect={() => undefined}
        onOpenDetails={() => undefined}
      />,
    );

    expect(markup).toContain('카페 예시');
    expect(markup).toContain('카카오맵 리뷰 보기');
    expect(markup).toContain('추천 93점');
    expect(markup).toContain('휴식 취향에 맞는 장소예요');
    expect(markup).toContain('aria-label="카페 예시 카카오맵 리뷰 보기"');
    expect(markup.match(/<button/g)).toHaveLength(2);
  });

  it('does not render a review action when Kakao has no place URL', () => {
    const markup = renderToStaticMarkup(
      <NearbyPlaceCard
        place={{ ...place, placeUrl: '' }}
        alreadyAdded={false}
        selected={false}
        onSelect={() => undefined}
        onOpenDetails={() => undefined}
      />,
    );

    expect(markup).not.toContain('카카오맵 리뷰 보기');
    expect(markup.match(/<button/g)).toHaveLength(1);
  });

  it('hides nearby distance metadata for Gangneung-wide results', () => {
    const markup = renderToStaticMarkup(
      <NearbyPlaceCard
        place={{ ...place, distanceMeters: null, recommendationScore: null }}
        alreadyAdded={false}
        selected={false}
        showDistance={false}
        onSelect={() => undefined}
        onOpenDetails={() => undefined}
      />,
    );

    expect(markup).not.toContain('120m');
    expect(markup).not.toContain('추천');
    expect(markup).toContain('강릉 전체 검색 결과');
  });
});
