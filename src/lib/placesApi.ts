import type { Place, PlaceCategory } from '../types/domain';
import { normalizePlaceImages } from './placeImages';

export interface BackendPlace {
  id: string;
  name: string;
  region?: string | null;
  category?: string | null;
  tags?: string[] | null;
  thumbnailUrl?: string | null;
  imageUrls?: string[] | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface BackendPlacesResponse {
  content: BackendPlace[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

const CATEGORY_LABELS: Record<PlaceCategory, string> = {
  beach: '해변',
  food: '맛집',
  nature: '자연',
  culture: '문화',
  active: '액티비티',
  lodging: '숙박',
  shopping: '쇼핑',
  course: '여행 코스',
  event: '행사',
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:8080/api/v1';

export function mapPlacesResponse(response: BackendPlacesResponse): Place[] {
  if (!response || !Array.isArray(response.content)) {
    throw new Error('Invalid places response');
  }

  return response.content.flatMap((place) => {
    const imageUrls = normalizePlaceImages(place.thumbnailUrl, place.imageUrls);
    const thumbnailUrl = imageUrls[0];
    if (!thumbnailUrl) {
      return [];
    }

    const cat = normalizeCategory(place.category);
    const tags = place.tags?.filter(Boolean) ?? [];

    return [
      {
        id: place.id,
        name: place.name,
        region: place.region ?? '',
        tags: tags.length > 0 ? tags : [CATEGORY_LABELS[cat]],
        cat,
        lat: place.latitude ?? 0,
        lng: place.longitude ?? 0,
        thumbnailUrl,
        imageUrls,
      },
    ];
  });
}

export async function fetchPlaces(baseUrl = API_BASE_URL): Promise<Place[]> {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, '');
  const response = await fetch(`${normalizedBaseUrl}/places?page=0&size=100`);
  if (!response.ok) {
    throw new Error(`Place request failed (${response.status})`);
  }
  return mapPlacesResponse(await (response.json() as Promise<BackendPlacesResponse>));
}

function normalizeCategory(category: string | null | undefined): PlaceCategory {
  switch (category?.trim().toLowerCase()) {
    case 'beach':
      return 'beach';
    case 'food':
      return 'food';
    case 'culture':
      return 'culture';
    case 'active':
      return 'active';
    case 'lodging':
      return 'lodging';
    case 'shopping':
      return 'shopping';
    case 'course':
      return 'course';
    case 'event':
      return 'event';
    default:
      return 'nature';
  }
}
