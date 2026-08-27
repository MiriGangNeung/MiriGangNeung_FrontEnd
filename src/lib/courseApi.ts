import type {
  BackendCourseResponse,
  BackendNearbyPlacesResponse,
  CreateCourseRequest,
} from '../types/api';
import { mapBackendCourse, mapBackendNearbyPlacesPage } from '../types/api';
import type {
  Course,
  NearbyPlace,
  NearbyPlaceCategory,
  NearbyPlaceScope,
  NearbyPlaceSort,
} from '../types/domain';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:8080/api/v1';

export async function createCourse(
  request: CreateCourseRequest,
  baseUrl = API_BASE_URL,
): Promise<Course> {
  const response = await requestJson<BackendCourseResponse>(
    `${normalizeBaseUrl(baseUrl)}/courses`,
    {
      method: 'POST',
      body: JSON.stringify(request),
    },
  );
  return mapBackendCourse(response);
}

export async function fetchCourse(courseId: string, baseUrl = API_BASE_URL): Promise<Course> {
  const response = await requestJson<BackendCourseResponse>(
    `${normalizeBaseUrl(baseUrl)}/courses/${encodeURIComponent(courseId)}`,
  );
  return mapBackendCourse(response);
}

export async function fetchNearbyPlaces(
  courseId: string,
  category: NearbyPlaceCategory,
  stopId?: string,
  baseUrl = API_BASE_URL,
  sort: NearbyPlaceSort = 'recommended',
): Promise<NearbyPlace[]> {
  const response = await fetchNearbyPlacesPage(
    courseId,
    category,
    { scope: 'nearby', stopId, sort },
    baseUrl,
  );
  return response.places;
}

export interface FetchNearbyPlacesParams {
  scope?: NearbyPlaceScope;
  stopId?: string;
  sort?: NearbyPlaceSort;
  keyword?: string;
  page?: number;
  size?: number;
}

export async function fetchNearbyPlacesPage(
  courseId: string,
  category: NearbyPlaceCategory,
  params: FetchNearbyPlacesParams = {},
  baseUrl = API_BASE_URL,
) {
  const scope = params.scope ?? 'nearby';
  const query = new URLSearchParams({ scope, category });
  if (scope === 'nearby') {
    if (params.stopId && params.stopId !== 'all') query.set('stopId', params.stopId);
    if (params.sort === 'distance') query.set('sort', params.sort);
  }
  if (scope === 'all' && params.keyword?.trim()) {
    query.set('keyword', params.keyword.trim());
  }
  query.set('page', String(params.page ?? 0));
  query.set('size', String(params.size ?? 15));
  const response = await requestJson<BackendNearbyPlacesResponse>(
    `${normalizeBaseUrl(baseUrl)}/courses/${encodeURIComponent(courseId)}/nearby-places?${query.toString()}`,
  );
  return mapBackendNearbyPlacesPage(response);
}

export async function addExternalCourseStop(
  courseId: string,
  place: NearbyPlace,
  baseUrl = API_BASE_URL,
): Promise<Course> {
  const response = await requestJson<BackendCourseResponse>(
    `${normalizeBaseUrl(baseUrl)}/courses/${encodeURIComponent(courseId)}/stops/external`,
    {
      method: 'POST',
      body: JSON.stringify({
        externalPlaceId: place.externalPlaceId,
        name: place.name,
        category: place.category,
        categoryName: place.categoryName,
        address: place.address,
        roadAddress: place.roadAddress,
        phone: place.phone,
        placeUrl: place.placeUrl,
        longitude: place.longitude,
        latitude: place.latitude,
      }),
    },
  );
  return mapBackendCourse(response);
}

export async function deleteCourseStop(
  courseId: string,
  stopId: string,
  baseUrl = API_BASE_URL,
): Promise<Course> {
  const response = await requestJson<BackendCourseResponse>(
    `${normalizeBaseUrl(baseUrl)}/courses/${encodeURIComponent(courseId)}/stops/${encodeURIComponent(stopId)}`,
    { method: 'DELETE' },
  );
  return mapBackendCourse(response);
}

export async function reorderCourseStops(
  courseId: string,
  stopIds: string[],
  baseUrl = API_BASE_URL,
): Promise<Course> {
  const response = await requestJson<BackendCourseResponse>(
    `${normalizeBaseUrl(baseUrl)}/courses/${encodeURIComponent(courseId)}/stops/order`,
    {
      method: 'PUT',
      body: JSON.stringify({ stopIds }),
    },
  );
  return mapBackendCourse(response);
}

async function requestJson<T>(url: string, init?: Parameters<typeof fetch>[1]): Promise<T> {
  const request: NonNullable<Parameters<typeof fetch>[1]> = { ...init };
  if (init?.body) {
    request.headers = {
      'Content-Type': 'application/json',
      ...init.headers,
    };
  }
  const response = Object.keys(request).length > 0 ? await fetch(url, request) : await fetch(url);
  if (!response.ok) {
    throw new Error(`Course request failed (${response.status})`);
  }
  return (await response.json()) as T;
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/$/, '');
}
