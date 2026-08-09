import type { Place } from '../types/domain';
import { fetchAwardPhotos } from './awardPhotosApi';
import { fetchTourismPhotos } from './tourismPhotosApi';

export async function fetchBackgroundPhotos(baseUrl?: string): Promise<Place[]> {
  const results = await Promise.allSettled([
    fetchAwardPhotos(baseUrl),
    fetchTourismPhotos(baseUrl),
  ]);
  const successfulResults = results.filter(
    (result): result is PromiseFulfilledResult<Place[]> => result.status === 'fulfilled',
  );

  if (successfulResults.length === 0) {
    throw new Error('Background photo requests failed');
  }

  return successfulResults.flatMap((result) => result.value);
}
