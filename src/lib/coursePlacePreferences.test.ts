import { describe, expect, it } from 'vitest';
import {
  COURSE_PLACE_CATEGORIES,
  COURSE_PLACE_MODES,
  shouldFetchCoursePlaces,
} from './coursePlacePreferences';

describe('course place preference navigation', () => {
  it('keeps the four place categories as the first navigation level', () => {
    expect(COURSE_PLACE_CATEGORIES.map((category) => category.id)).toEqual([
      'cafe',
      'restaurant',
      'culture',
      'attraction',
    ]);
  });

  it('keeps the three search modes inside the selected category', () => {
    expect(COURSE_PLACE_MODES.map((mode) => mode.id)).toEqual(['nearby', 'all', 'representative']);
  });

  it('does not fetch all places until a keyword is submitted', () => {
    expect(shouldFetchCoursePlaces('all', true, '')).toBe(false);
    expect(shouldFetchCoursePlaces('all', true, '   ')).toBe(false);
    expect(shouldFetchCoursePlaces('all', true, '테라로사')).toBe(true);
  });

  it('does not fetch representative places because the mode is not implemented yet', () => {
    expect(shouldFetchCoursePlaces('representative', true, '')).toBe(false);
    expect(shouldFetchCoursePlaces('representative', true, '테라로사')).toBe(false);
  });
});
