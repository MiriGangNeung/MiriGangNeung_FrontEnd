export type PlaceCategory =
  'beach' | 'food' | 'nature' | 'culture' | 'active' | 'lodging' | 'shopping' | 'course' | 'event';

export interface Place {
  id: string;
  name: string;
  region: string;
  tags: string[];
  cat: PlaceCategory;
  lat: number;
  lng: number;
  thumbnailUrl?: string;
  imageUrls?: string[];
}

export interface Tab {
  id: string;
  label: string;
}

export type ComposePhase = 'ready' | 'running' | 'done';

export interface ComposeStage {
  label: string;
  hint: string;
}

export interface TripType {
  id: string;
  label: string;
}

export interface Companion {
  id: string;
  label: string;
  hint: string;
}

export interface Duration {
  id: string;
  label: string;
}

export type CrowdLevel = 'easy' | 'mid' | 'busy';

export interface CourseStop {
  n: number;
  id: string;
  placeId?: string;
  externalPlaceId?: string;
  name: string;
  time: string;
  stay: string;
  crowd: CrowdLevel;
  onePick?: boolean;
  note: string;
  lat: number;
  lng: number;
  thumbnailUrl?: string;
  external?: boolean;
  category?: string;
  categoryName?: string;
  address?: string;
  phone?: string;
  placeUrl?: string;
}

export type NearbyPlaceCategory = 'restaurant' | 'cafe';

export interface NearbyPlace {
  externalPlaceId: string;
  name: string;
  category: NearbyPlaceCategory;
  categoryName: string;
  address: string;
  roadAddress: string;
  phone: string;
  placeUrl: string;
  latitude: number;
  longitude: number;
  distanceMeters: number;
  nearestStopId?: string | null;
  nearestStopName?: string | null;
}

export interface CourseRouteSegment {
  fromStopId?: string | null;
  toStopId?: string | null;
  distanceMeters: number;
  durationSeconds: number;
  polyline: Array<[number, number]>;
}

export interface Course {
  courseId: string;
  title: string;
  duration: string;
  stops: CourseStop[];
  totalDistanceMeters: number;
  totalTravelMinutes: number;
  routeStatus: 'READY' | 'UNAVAILABLE';
  routeSegments: CourseRouteSegment[];
}
