import type { CourseStop, Place } from '../types/domain';

const MOCK_TIMES = ['09:30', '12:30', '15:30'];
const MOCK_STAYS = ['60분', '90분', '60분'];
const MOCK_CROWD_LEVELS: CourseStop['crowd'][] = ['easy', 'mid', 'easy'];

/**
 * Builds the current mock itinerary from the places selected by the user.
 * The backend course-generation API can replace this adapter later without
 * changing the course result UI.
 */
export function buildMockCourseStops(
  places: Place[],
  picks: string[],
  onePickId: string,
): CourseStop[] {
  const placesById = new Map(places.map((place) => [place.id, place]));

  return picks
    .map((id) => placesById.get(id))
    .filter((place): place is Place => Boolean(place))
    .map((place, index) => ({
      n: index + 1,
      id: place.id,
      name: place.name,
      time: MOCK_TIMES[index] ?? `${String(9 + index * 2).padStart(2, '0')}:30`,
      stay: MOCK_STAYS[index] ?? '60분',
      crowd: MOCK_CROWD_LEVELS[index] ?? 'mid',
      onePick: place.id === onePickId,
      note: `${place.region} · ${place.tags[0] ?? '추천 장소'} 둘러보기`,
      lat: place.lat,
      lng: place.lng,
      thumbnailUrl: place.thumbnailUrl,
    }));
}
