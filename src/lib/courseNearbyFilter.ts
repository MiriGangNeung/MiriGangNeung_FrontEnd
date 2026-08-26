import type { CourseStop } from '../types/domain';

export const ALL_NEARBY_STOP_ID = 'all';

export interface NearbyStopOption {
  id: string;
  name: string;
}

export function getNearbyStopOptions(stops: CourseStop[]): NearbyStopOption[] {
  return [
    { id: ALL_NEARBY_STOP_ID, name: '전체' },
    ...stops.filter((stop) => !stop.external).map((stop) => ({ id: stop.id, name: stop.name })),
  ];
}
