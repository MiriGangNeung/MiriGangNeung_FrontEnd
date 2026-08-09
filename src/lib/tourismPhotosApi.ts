import type { BackgroundPhotoSource, Place } from '../types/domain';

export interface BackendTourismPhoto {
  id: string;
  title: string;
  location?: string | null;
  photographyMonth?: string | null;
  keywords?: string[] | null;
  originalImageUrl?: string | null;
  thumbnailUrl?: string | null;
  photographer?: string | null;
  source?: string | null;
}

export interface BackendTourismPhotosResponse {
  content: BackendTourismPhoto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:8080/api/v1';

function normalizeImageUrl(value: string | undefined): string | undefined {
  if (!value) {
    return value;
  }
  if (value === 'http://tong.visitkorea.or.kr') {
    return 'https://tong.visitkorea.or.kr';
  }
  if (value.startsWith('http://tong.visitkorea.or.kr/')) {
    return `https://tong.visitkorea.or.kr${value.slice('http://tong.visitkorea.or.kr'.length)}`;
  }
  return value;
}

export function mapTourismPhotosResponse(response: BackendTourismPhotosResponse): Place[] {
  if (!response || !Array.isArray(response.content)) {
    throw new Error('Invalid tourism photos response');
  }

  return response.content.flatMap((photo) => {
    const originalImageUrl = normalizeImageUrl(photo.originalImageUrl?.trim());
    const thumbnailUrl = normalizeImageUrl(photo.thumbnailUrl?.trim());
    const imageUrl = originalImageUrl || thumbnailUrl;

    if (!imageUrl) {
      return [];
    }

    const keywords = (photo.keywords ?? [])
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword.length > 0)
      .slice(0, 2);

    return [
      {
        id: `kto-gallery:${photo.id}`,
        name: photo.title,
        region: photo.location?.trim() ?? '',
        tags: keywords.length > 0 ? keywords : ['관광사진 갤러리'],
        cat: 'nature',
        lat: 0,
        lng: 0,
        thumbnailUrl: imageUrl,
        source: 'gallery' as BackgroundPhotoSource,
      },
    ];
  });
}

export async function fetchTourismPhotos(baseUrl = API_BASE_URL): Promise<Place[]> {
  const endpoint = `${baseUrl.replace(/\/$/, '')}/tourism-photos?page=0&size=100`;
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Tourism photo request failed (${response.status})`);
  }

  return mapTourismPhotosResponse((await response.json()) as BackendTourismPhotosResponse);
}
