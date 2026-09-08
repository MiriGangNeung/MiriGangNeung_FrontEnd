import type { Place } from '../types/domain';
import { getPlaceImages } from './placeImages';

const PREFERRED_BACKGROUND_IMAGE_INDEXES: Record<string, number> = {
  안목해변: 4,
  경포해수욕장: 3,
  주문진등대: 2,
  향호해변: 2,
};

function normalizePlaceName(name: string): string {
  return name.replace(/\s+/g, '').trim();
}

/** Returns the 0-based default image index used only by the screen 1 picker. */
export function getPreferredBackgroundImageIndex(placeName: string): number | undefined {
  return PREFERRED_BACKGROUND_IMAGE_INDEXES[normalizePlaceName(placeName)];
}

/** Returns original image indexes in the order shown by the screen 1 picker. */
export function getBackgroundPickerImageOrder(placeName: string, totalImages: number): number[] {
  const indexes = Array.from({ length: Math.max(0, totalImages) }, (_, index) => index);
  const preferredIndex = getPreferredBackgroundImageIndex(placeName);

  if (preferredIndex === undefined || !indexes.includes(preferredIndex)) {
    return indexes;
  }

  return [preferredIndex, ...indexes.filter((index) => index !== preferredIndex)];
}

export function reorderBackgroundPickerPlace(place: Place): {
  place: Place;
  originalIndexes: number[];
} {
  const images = getPlaceImages(place);
  const originalIndexes = getBackgroundPickerImageOrder(place.name, images.length);

  if (originalIndexes.every((index, position) => index === position)) {
    return { place, originalIndexes };
  }

  const orderedImages = originalIndexes.map((index) => images[index]);
  return {
    place: {
      ...place,
      thumbnailUrl: orderedImages[0],
      imageUrls: orderedImages,
    },
    originalIndexes,
  };
}
