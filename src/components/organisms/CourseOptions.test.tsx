import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CourseOptions } from './CourseOptions';

describe('CourseOptions preference groups', () => {
  it('keeps broad travel types together and renders selected details in a shared group', () => {
    const markup = renderToStaticMarkup(
      <CourseOptions
        places={[
          {
            id: 'place-1',
            name: '안목해변',
            region: '강릉시',
            tags: ['자연'],
            cat: 'nature',
            lat: 37.77,
            lng: 128.94,
          },
        ]}
        picks={['place-1']}
        onePick="place-1"
        types={['food', 'rest']}
        detailTypes={['food:chinese', 'rest:coffee']}
        companion="couple"
        duration="day"
        startDate=""
        endDate=""
        onToggleType={() => {}}
        onToggleDetailType={() => {}}
        onCompanion={() => {}}
        onDuration={() => {}}
        onStartDate={() => {}}
        onEndDate={() => {}}
        onNext={() => {}}
      />,
    );

    const broadTypesIndex = markup.indexOf('data-trip-type-options');
    const detailGroupsIndex = markup.indexOf('data-trip-type-details');
    const foodDetailsIndex = markup.indexOf('data-trip-type-detail-group="food"');
    const restDetailsIndex = markup.indexOf('data-trip-type-detail-group="rest"');

    expect(broadTypesIndex).toBeGreaterThan(-1);
    expect(detailGroupsIndex).toBeGreaterThan(broadTypesIndex);
    expect(foodDetailsIndex).toBeGreaterThan(detailGroupsIndex);
    expect(restDetailsIndex).toBeGreaterThan(foodDetailsIndex);
    expect(markup).toContain('세부 취향');
    expect(markup).toContain('중식');
    expect(markup).toContain('커피 · 로스터리');
    expect(markup).toContain('최소 1개 선택');
    expect(markup).not.toContain('최대 2개');
  });
});
