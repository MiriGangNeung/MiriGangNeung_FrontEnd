import type {
  Course,
  CourseRouteSegment,
  CourseStop,
  NearbyPlace,
  NearbyPlaceCategory,
  NearbyPlaceScope,
  Place,
} from './domain';

export interface PlacesResponse {
  places: Place[];
}

export type CompositeJobStatus = 'queued' | 'running' | 'done';

export interface CompositeJob {
  id: string;
  status: CompositeJobStatus;
  progress: number;
  resultUrl?: string;
}

export interface CreateCourseRequest {
  placeIds: string[];
  onePickId: string;
  types: string[];
  companion: string;
  duration: string;
  startDate?: string;
  endDate?: string;
}

export interface BackendCourseStop {
  stopId: string;
  sequence: number;
  placeId?: string | null;
  externalPlaceId?: string | null;
  name: string;
  thumbnailUrl?: string | null;
  arrivalTime: string;
  stayMinutes: number;
  crowdLevel: string;
  isOnePick: boolean;
  note: string;
  latitude?: number | null;
  longitude?: number | null;
  external: boolean;
  category?: string | null;
  categoryName?: string | null;
  address?: string | null;
  phone?: string | null;
  placeUrl?: string | null;
}

export interface BackendRouteSegment {
  fromStopId?: string | null;
  toStopId?: string | null;
  distanceMeters: number;
  durationSeconds: number;
  polyline?: Array<[number, number]> | null;
}

export interface BackendCourseResponse {
  courseId: string;
  title: string;
  duration: string;
  types?: string[] | null;
  companion?: string | null;
  stops: BackendCourseStop[];
  totalDistanceMeters: number;
  totalTravelMinutes: number;
  routeStatus?: 'READY' | 'UNAVAILABLE' | string;
  routeSegments?: BackendRouteSegment[] | null;
}

export interface BackendNearbyPlace {
  externalPlaceId: string;
  name: string;
  category: string;
  categoryName?: string | null;
  address?: string | null;
  roadAddress?: string | null;
  phone?: string | null;
  placeUrl?: string | null;
  latitude: number;
  longitude: number;
  distanceMeters?: number | null;
  nearestStopId?: string | null;
  nearestStopName?: string | null;
  recommendationScore?: number | null;
  recommendationReasons?: string[] | null;
}

export interface BackendNearbyPlacesResponse {
  scope?: string | null;
  category: string;
  page?: number;
  size?: number;
  isEnd?: boolean;
  places: BackendNearbyPlace[];
}

export interface BackendNearbyPlacesPage {
  scope: NearbyPlaceScope;
  category: NearbyPlaceCategory;
  page: number;
  size: number;
  isEnd: boolean;
  places: NearbyPlace[];
}

export type CreateCourseResponse = BackendCourseResponse;

export function mapBackendCourse(response: BackendCourseResponse): Course {
  return {
    courseId: response.courseId,
    title: response.title,
    duration: response.duration,
    types: response.types ?? [],
    companion: response.companion ?? '',
    stops: response.stops.map(mapBackendCourseStop),
    totalDistanceMeters: response.totalDistanceMeters ?? 0,
    totalTravelMinutes: response.totalTravelMinutes ?? 0,
    routeStatus: response.routeStatus === 'READY' ? 'READY' : 'UNAVAILABLE',
    routeSegments: (response.routeSegments ?? []).map(mapBackendRouteSegment),
  };
}

function mapBackendCourseStop(stop: BackendCourseStop): CourseStop {
  return {
    n: stop.sequence,
    id: stop.stopId,
    placeId: stop.placeId ?? undefined,
    externalPlaceId: stop.externalPlaceId ?? undefined,
    name: stop.name,
    time: stop.arrivalTime,
    stay: `${stop.stayMinutes}분`,
    crowd: mapCrowd(stop.crowdLevel),
    onePick: stop.isOnePick,
    note: stop.note,
    lat: stop.latitude ?? 0,
    lng: stop.longitude ?? 0,
    thumbnailUrl: stop.thumbnailUrl ?? undefined,
    external: stop.external,
    category: stop.category ?? undefined,
    categoryName: stop.categoryName ?? undefined,
    address: stop.address ?? undefined,
    phone: stop.phone ?? undefined,
    placeUrl: stop.placeUrl ?? undefined,
  };
}

function mapBackendRouteSegment(segment: BackendRouteSegment): CourseRouteSegment {
  return {
    fromStopId: segment.fromStopId,
    toStopId: segment.toStopId,
    distanceMeters: segment.distanceMeters,
    durationSeconds: segment.durationSeconds,
    polyline: (segment.polyline ?? []).map(
      ([longitude, latitude]) => [longitude, latitude] as [number, number],
    ),
  };
}

function mapCrowd(level: string): CourseStop['crowd'] {
  switch (level.trim().toLowerCase()) {
    case 'high':
    case 'busy':
      return 'busy';
    case 'mid':
    case 'normal':
      return 'mid';
    default:
      return 'easy';
  }
}

export function mapBackendNearbyPlaces(response: BackendNearbyPlacesResponse): NearbyPlace[] {
  return (response.places ?? []).map((place) => ({
    externalPlaceId: place.externalPlaceId,
    name: place.name,
    category: mapNearbyPlaceCategory(place.category),
    categoryName: place.categoryName ?? '',
    address: place.address ?? '',
    roadAddress: place.roadAddress ?? '',
    phone: place.phone ?? '',
    placeUrl: place.placeUrl ?? '',
    latitude: place.latitude,
    longitude: place.longitude,
    distanceMeters: place.distanceMeters ?? null,
    nearestStopId: place.nearestStopId,
    nearestStopName: place.nearestStopName,
    recommendationScore: place.recommendationScore ?? null,
    recommendationReasons: place.recommendationReasons ?? [],
  }));
}

export function mapBackendNearbyPlacesPage(
  response: BackendNearbyPlacesResponse,
): BackendNearbyPlacesPage {
  const scope = response.scope === 'all' ? 'all' : 'nearby';
  const category = mapNearbyPlaceCategory(response.category);
  return {
    scope,
    category,
    page: response.page ?? 0,
    size: response.size ?? response.places?.length ?? 0,
    isEnd: response.isEnd ?? true,
    places: mapBackendNearbyPlaces(response),
  };
}

function mapNearbyPlaceCategory(category: string): NearbyPlaceCategory {
  switch (category) {
    case 'cafe':
    case 'restaurant':
    case 'culture':
      return category;
    default:
      return 'restaurant';
  }
}
