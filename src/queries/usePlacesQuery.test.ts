import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useQuery } from '@tanstack/react-query';
import { fetchBackgroundPhotos } from '../lib/backgroundPhotosApi';
import { fetchPlaces } from '../lib/placesApi';
import { usePlacesQuery } from './usePlacesQuery';

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

vi.mock('../lib/backgroundPhotosApi', () => ({
  fetchBackgroundPhotos: vi.fn(),
}));

vi.mock('../lib/placesApi', () => ({
  fetchPlaces: vi.fn(),
}));

describe('usePlacesQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useQuery).mockReturnValue({} as ReturnType<typeof useQuery>);
    vi.mocked(fetchBackgroundPhotos).mockResolvedValue([]);
    vi.mocked(fetchPlaces).mockResolvedValue([]);
  });

  it('uses the KorService2-backed place list as the only background source', async () => {
    usePlacesQuery();

    const options = vi.mocked(useQuery).mock.calls[0]?.[0] as {
      queryKey: string[];
      queryFn: () => Promise<unknown>;
    };

    expect(options.queryKey).toEqual(['places']);
    await options.queryFn();

    expect(fetchPlaces).toHaveBeenCalledOnce();
    expect(fetchBackgroundPhotos).not.toHaveBeenCalled();
  });
});
