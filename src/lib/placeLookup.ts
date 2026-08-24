import type { Place } from '../types/domain';

export function findPlaceById(places: Place[], id: string): Place | undefined {
  return places.find((place) => place.id === id);
}
