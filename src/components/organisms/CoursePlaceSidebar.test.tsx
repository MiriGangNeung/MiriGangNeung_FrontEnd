import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CoursePlaceSidebar } from './CoursePlaceSidebar';
import type { CourseStop, NearbyPlace } from '../../types/domain';

const courseStops: CourseStop[] = [
  {
    id: 'stop-1',
    n: 1,
    name: '경포해변',
    time: '09:00',
    stay: '60분',
    crowd: 'easy',
    note: '강릉시',
    lat: 37.8,
    lng: 128.9,
    external: false,
  },
];

const nearbyPlace: NearbyPlace = {
  externalPlaceId: 'kakao-1',
  name: '카페 예시',
  category: 'cafe',
  categoryName: '음식점 > 카페',
  address: '강릉시',
  roadAddress: '강릉시 해안로',
  phone: '',
  placeUrl: 'https://place.map.kakao.com/kakao-1',
  latitude: 37.8,
  longitude: 128.9,
  distanceMeters: 180,
  recommendationScore: 91,
};

function renderSidebar(overrides: Partial<Parameters<typeof CoursePlaceSidebar>[0]> = {}) {
  return renderToStaticMarkup(
    <CoursePlaceSidebar
      courseStops={courseStops}
      nearbyCategory="cafe"
      nearbyScope="nearby"
      nearbyStopId="all"
      nearbyStopOptions={[
        { id: 'all', name: '전체' },
        { id: 'stop-1', name: '경포해변' },
      ]}
      nearbySort="recommended"
      nearbyKeyword=""
      keywordDraft=""
      nearbyPlaces={[nearbyPlace]}
      nearbySearchRadiusMeters={2_000}
      nearbyHasNextPage={false}
      nearbyIsFetchingNextPage={false}
      isNearbyLoading={false}
      nearbyError={null}
      actionError={null}
      selectedPlace={nearbyPlace}
      onClose={() => undefined}
      onNearbyScope={() => undefined}
      onNearbyCategory={() => undefined}
      onNearbyStop={() => undefined}
      onNearbySort={() => undefined}
      onKeywordDraftChange={() => undefined}
      onNearbyKeyword={() => undefined}
      onNearbyLoadMore={() => undefined}
      onSelectPlace={() => undefined}
      onOpenPlaceDetails={() => undefined}
      onConfirmPlace={() => undefined}
      {...overrides}
    />,
  );
}

describe('CoursePlaceSidebar', () => {
  it('keeps categories and nearby recommendations in one compact sidebar hierarchy', () => {
    const markup = renderSidebar();

    expect(markup).toContain('data-course-place-adder');
    expect(markup).toContain('장소 추가');
    expect(markup).toContain('카페');
    expect(markup).toContain('주변 추천');
    expect(markup).toContain('data-nearby-search-trigger');
    expect(markup).toContain('aria-label="장소 검색"');
    expect(markup).toContain('aria-label="장소 카테고리"');
    expect(markup).toContain('aria-label="장소 탐색"');
    expect(markup).not.toContain('data-nearby-scope="all"');
    expect(markup).not.toContain('aria-label="카페 탐색 방식"');
    expect(markup).not.toContain('원하는 장소를 골라보세요');
    expect(markup).not.toContain('찾는 방법');
    expect(markup).not.toContain('강릉 전체 검색');
    expect(markup).not.toContain('강릉 대표');
    expect(markup).not.toContain('data-map-place-controls');
  });

  it('shows nearby criteria and candidate cards in nearby mode', () => {
    const markup = renderSidebar();

    expect(markup).toContain('data-course-place-results');
    expect(markup).toContain('overflow-y-auto');
    expect(markup).toContain('기준 관광지');
    expect(markup).toContain('경포해변');
    expect(markup).toContain('추천순');
    expect(markup).toContain('거리순');
    expect(markup).toContain('카페 예시');
    expect(markup).toContain('코스에 추가');
  });

  it('switches to a command-style search field for Gangneung-wide mode', () => {
    const markup = renderSidebar({
      nearbyScope: 'all',
      nearbyKeyword: '테라로사',
      keywordDraft: '테라로사',
    });

    expect(markup).toContain('data-place-search-command');
    expect(markup).toContain('role="search"');
    expect(markup).toContain('aria-label="강릉 장소 검색"');
    expect(markup).toContain('data-place-search-back');
    expect(markup).toContain('data-place-search-clear');
    expect(markup).toContain('cmdk-input');
    expect(markup).toContain('강릉 장소 검색');
    expect(markup).toContain('강릉에서 장소명을 검색하세요');
    expect(markup).toContain('검색');
    expect(markup).not.toContain('data-nearby-scope="all"');
    expect(markup).not.toContain('기준 관광지');
    expect(markup).not.toContain('추천순');
  });

  it('shows automatic expansion feedback without exposing a manual radius control', () => {
    const markup = renderSidebar({ nearbySearchRadiusMeters: 10_000 });

    expect(markup).toContain('10km까지 자동으로 넓혔어요');
    expect(markup).not.toContain('검색 범위');
    expect(markup).not.toContain('data-nearby-radius-selector');
  });
});
