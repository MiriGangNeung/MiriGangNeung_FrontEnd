import { INTRO_TOUR_STOPS, PLACES } from '../data/places';
import type { Place } from '../types/domain';

export function getIntroTourStops(places: readonly Place[] = PLACES) {
  return INTRO_TOUR_STOPS.map((stop) => ({
    ...stop,
    place: places.find((place) => place.id === stop.placeId) ?? PLACES[0],
  }));
}
