import type { Place } from '../types/domain';

export interface BackendAwardPhoto {
  id: string;
  title: string;
  location?: string | null;
  award?: string | null;
  keywords?: string[] | null;
  originalImageUrl?: string | null;
  thumbnailUrl?: string | null;
  photographer?: string | null;
  copyrightCode?: string | null;
  source?: string | null;
}

export interface BackendAwardPhotosResponse {
  content: BackendAwardPhoto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:8080/api/v1';

export function mapAwardPhotosResponse(response: BackendAwardPhotosResponse): Place[] {
  if (!response || !Array.isArray(response.content)) {
    throw new Error('Invalid award photos response');
  }

  return response.content.flatMap((photo) => {
    const originalImageUrl = photo.originalImageUrl?.trim();
    const thumbnailUrl = photo.thumbnailUrl?.trim();
    const imageUrl = originalImageUrl || thumbnailUrl;

    if (!imageUrl) {
      return [];
    }

    const keywords = (photo.keywords ?? [])
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword.length > 0)
      .slice(0, 2);
    const award = photo.award?.trim();
    const tags = [award, ...keywords].filter((tag): tag is string => Boolean(tag));

    return [
      {
        id: `kto-award:${photo.id}`,
        name: photo.title,
        region: photo.location?.trim() ?? '',
        tags: tags.length > 0 ? tags : ['공모전 수상작'],
        cat: 'nature',
        lat: 0,
        lng: 0,
        thumbnailUrl: imageUrl,
      },
    ];
  });
}

export async function fetchAwardPhotos(baseUrl = API_BASE_URL): Promise<Place[]> {
  const endpoint = `${baseUrl.replace(/\/$/, '')}/award-photos?region=51&page=0&size=100`;
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Award photo request failed (${response.status})`);
  }

  return mapAwardPhotosResponse((await response.json()) as BackendAwardPhotosResponse);
}
