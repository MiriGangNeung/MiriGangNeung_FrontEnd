import type { CourseStop } from '../../types/domain';

export function toCourseCoordinates(stops: CourseStop[]): Array<{ lat: number; lng: number }> {
  return stops.map(({ lat, lng }) => ({ lat, lng }));
}

export function toRouteStops(
  stops: CourseStop[],
): Array<{ name: string; lat: number; lng: number }> {
  return stops.map(({ name, lat, lng }) => ({ name, lat, lng }));
}
