import type { Place } from '../types/domain';

export const MAX_PLACE_IMAGES = 5;

export function normalizePlaceImages(
  thumbnailUrl?: string | null,
  imageUrls?: readonly (string | null | undefined)[] | null,
): string[] {
  return Array.from(
    new Set(
      [thumbnailUrl, ...(imageUrls ?? [])]
        .filter((url): url is string => typeof url === 'string')
        .map((url) => url.trim())
        .filter(Boolean),
    ),
  ).slice(0, MAX_PLACE_IMAGES);
}

export function getPlaceImages(place: Pick<Place, 'thumbnailUrl' | 'imageUrls'>): string[] {
  return normalizePlaceImages(place.thumbnailUrl, place.imageUrls);
}

export function getPlaceImageSelection(
  place: Pick<Place, 'thumbnailUrl' | 'imageUrls'>,
  requestedIndex: number,
): { imageUrl?: string; imageIndex: number; totalImages: number } {
  const images = getPlaceImages(place);
  const numericIndex = Number.isFinite(requestedIndex) ? Math.trunc(requestedIndex) : 0;
  const imageIndex = images.length > 0 ? Math.min(Math.max(numericIndex, 0), images.length - 1) : 0;

  return {
    imageUrl: images[imageIndex],
    imageIndex,
    totalImages: images.length,
  };
}

export function getNextPlaceImageIndex(
  currentIndex: number,
  direction: number,
  total: number,
): number {
  if (total <= 0) return 0;
  return (currentIndex + direction + total) % total;
}
