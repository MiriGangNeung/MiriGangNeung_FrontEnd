import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { CourseResult } from './CourseResult';
import type { CourseStop } from '../../types/domain';

vi.mock('./CourseMap', () => ({
  CourseMap: () => <div data-testid="course-map" />,
}));

const externalStop: CourseStop = {
  id: 'external-stop-1',
  n: 1,
  externalPlaceId: 'kakao-place-1',
  name: '보사노바 커피로스터스 강릉점',
  time: '09:00',
  stay: '60분',
  crowd: 'mid',
  note: '선택한 관광지 주변',
  lat: 37.8,
  lng: 128.9,
  external: true,
  category: 'cafe',
  address: '강원특별자치도 강릉시 창해로14번길 28',
  placeUrl: 'https://place.map.kakao.com/kakao-place-1',
};

const onePickTourismStop: CourseStop = {
  id: 'one-pick-tourism-stop',
  placeId: 'one-pick-tourism-place',
  n: 2,
  name: '경포해변',
  time: '10:30',
  stay: '60분',
  crowd: 'mid',
  onePick: true,
  note: '강원특별자치도 강릉시 창해로 514',
  lat: 37.805,
  lng: 128.907,
  external: false,
  placeUrl: 'https://place.map.kakao.com/one-pick-tourism-place',
};

const culturalStop: CourseStop = {
  id: 'cultural-stop',
  externalPlaceId: 'cultural-place',
  n: 3,
  name: '강릉 오죽헌',
  time: '12:00',
  stay: '60분',
  crowd: 'mid',
  note: '강원특별자치도 강릉시 율곡로 3139번길 24',
  lat: 37.78,
  lng: 128.88,
  external: true,
  category: 'culture',
  address: '강원특별자치도 강릉시 율곡로 3139번길 24',
  placeUrl: 'https://place.map.kakao.com/cultural-place',
};

function renderCourseResult() {
  return renderToStaticMarkup(
    <CourseResult
      places={[]}
      courseStops={[externalStop, onePickTourismStop, culturalStop]}
      mapStops={[externalStop, onePickTourismStop, culturalStop]}
      routeSegments={[]}
      routeStatus="UNAVAILABLE"
      onePick={onePickTourismStop.placeId ?? ''}
      types={[]}
      companion=""
      duration=""
      totalDistanceMeters={0}
      totalTravelMinutes={0}
      activeStop={0}
      nearbyCategory="cafe"
      nearbyStopId="all"
      nearbyStopOptions={[]}
      nearbyPlaces={[]}
      isNearbyLoading={false}
      nearbyError={null}
      onPlaceAdderOpenChange={() => {}}
      onNearbyCategory={() => {}}
      onNearbyStop={() => {}}
      onActiveStop={() => {}}
      onPreviewPlace={() => {}}
      onAddPlace={async () => {}}
      onDeleteStop={async () => {}}
      onReorder={async () => {}}
      onBack={() => {}}
    />,
  );
}

describe('CourseResult', () => {
  it('does not keep the retired bottom review padding on added place cards', () => {
    const markup = renderCourseResult();

    expect(markup).toContain('data-course-stop-card');
    expect(markup).not.toContain('pb-7');
  });

  it('renders an added stop with category and review actions above its title', () => {
    const markup = renderCourseResult();
    const titleIndex = markup.indexOf(externalStop.name);
    const locationIndex = markup.indexOf(externalStop.address ?? '');
    const categoryIndex = markup.indexOf('카페');
    const reviewIndex = markup.indexOf('data-kakao-place-review-button');
    const titleClassStart = markup.lastIndexOf('class="', titleIndex);
    const titleClassEnd = markup.indexOf('"', titleClassStart + 7);
    const titleClass = markup.slice(titleClassStart, titleClassEnd);

    expect(markup).not.toContain('09:00');
    expect(markup).toContain('min-h-[104px]');
    expect(titleIndex).toBeGreaterThan(-1);
    expect(titleClass).not.toContain('flex-1');
    expect(categoryIndex).toBeLessThan(titleIndex);
    expect(reviewIndex).toBeGreaterThan(categoryIndex);
    expect(reviewIndex).toBeLessThan(titleIndex);
    expect(locationIndex).toBeGreaterThan(titleIndex);
    expect(markup).not.toContain('data-course-stop-footer');
  });

  it('labels tourism and one-pick stops before the stop title', () => {
    const markup = renderCourseResult();
    const tourismTitleIndex = markup.lastIndexOf(onePickTourismStop.name);
    const tourismCategoryIndex = markup.indexOf('>관광지</span>');
    const onePickTagIndex = markup.indexOf('data-course-stop-one-pick');

    expect(tourismTitleIndex).toBeGreaterThan(-1);
    expect(tourismCategoryIndex).toBeGreaterThan(-1);
    expect(onePickTagIndex).toBeGreaterThan(-1);
    expect(tourismCategoryIndex).toBeLessThan(tourismTitleIndex);
    expect(onePickTagIndex).toBeLessThan(tourismTitleIndex);
  });

  it('renders the Kakao review action for an enriched original tourism stop', () => {
    const markup = renderCourseResult();

    expect(markup).toContain('경포해변 카카오맵 리뷰 보기');
  });

  it('labels cultural facility stops with the Kakao category name', () => {
    const markup = renderCourseResult();
    const culturalTitleIndex = markup.lastIndexOf(culturalStop.name);
    const culturalCategoryIndex = markup.indexOf('>문화시설</span>');

    expect(culturalTitleIndex).toBeGreaterThan(-1);
    expect(culturalCategoryIndex).toBeGreaterThan(-1);
    expect(culturalCategoryIndex).toBeLessThan(culturalTitleIndex);
  });

  it('keeps the review button outside the stop selection button', () => {
    const markup = renderCourseResult();
    const selectButtonStart = markup.indexOf('data-course-stop-select');
    const selectButtonEnd = markup.indexOf('</button>', selectButtonStart);
    const reviewIndex = markup.indexOf('data-kakao-place-review-button');

    expect(selectButtonStart).toBeGreaterThan(-1);
    expect(selectButtonEnd).toBeGreaterThan(selectButtonStart);
    expect(reviewIndex).toBeLessThan(selectButtonStart);
  });
});
