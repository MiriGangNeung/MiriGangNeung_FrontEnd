import type { BackgroundPhotoSource, Place } from '../types/domain';

export const PHOTO_SOURCE_TABS = [
  { id: 'award', label: '공모전 수상작' },
  { id: 'gallery', label: '관광사진 갤러리' },
] as const;

export function filterBackgroundPhotos(
  places: Place[],
  source: BackgroundPhotoSource,
  category: string,
): Place[] {
  const sourcePlaces = places.filter((place) => place.source === source);

  if (category === 'all' || category === 'filter') {
    return sourcePlaces;
  }

  return sourcePlaces.filter((place) => place.cat === category);
}
