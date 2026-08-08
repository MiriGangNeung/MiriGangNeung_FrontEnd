import type { CourseStop, Place } from '../types/domain';

export function createAddedStop(place: Place, courseStops: CourseStop[]): CourseStop | null {
  if (courseStops.some((stop) => stop.id === place.id)) return null;

  const lastStop = courseStops.at(-1);
  return {
    n: (lastStop?.n ?? 0) + 1,
    id: place.id,
    name: place.name,
    time: addMinutes(lastStop?.time ?? '09:00', 90),
    stay: '60분',
    crowd: 'mid',
    note: place.region,
    lat: place.lat,
    lng: place.lng,
  };
}

export function getMapStops(courseStops: CourseStop[], previewPlace: Place | null): CourseStop[] {
  if (!previewPlace) return courseStops;

  const previewStop = createAddedStop(previewPlace, courseStops);
  return previewStop ? [...courseStops, previewStop] : courseStops;
}

function addMinutes(time: string, minutesToAdd: number): string {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = (hours * 60 + minutes + minutesToAdd) % (24 * 60);
  const nextHours = Math.floor(totalMinutes / 60);
  const nextMinutes = totalMinutes % 60;

  return `${String(nextHours).padStart(2, '0')}:${String(nextMinutes).padStart(2, '0')}`;
}
