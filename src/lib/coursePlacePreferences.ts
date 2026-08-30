import type { CoursePlaceMode, NearbyPlaceCategory, NearbyPlaceScope } from '../types/domain';

export const COURSE_PLACE_CATEGORIES: ReadonlyArray<{
  id: NearbyPlaceCategory;
  label: string;
}> = [
  { id: 'cafe', label: '카페' },
  { id: 'restaurant', label: '음식점' },
  { id: 'culture', label: '문화시설' },
  { id: 'attraction', label: '관광명소' },
];

export const COURSE_PLACE_MODES: ReadonlyArray<{
  id: CoursePlaceMode;
  label: string;
  disabled?: boolean;
}> = [
  { id: 'nearby', label: '주변 추천' },
  { id: 'all', label: '강릉 전체 검색' },
  { id: 'representative', label: '강릉 대표', disabled: true },
];

export function shouldFetchCoursePlaces(
  mode: CoursePlaceMode,
  panelOpen: boolean,
  submittedKeyword: string,
): boolean {
  if (!panelOpen || mode === 'representative') {
    return false;
  }
  return mode === 'nearby' || Boolean(submittedKeyword.trim());
}

export function apiScopeForCoursePlaceMode(mode: CoursePlaceMode): NearbyPlaceScope | null {
  return mode === 'representative' ? null : mode;
}
