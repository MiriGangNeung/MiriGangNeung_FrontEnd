import { describe, expect, it } from 'vitest';

import { loadKakaoMaps, searchKakaoPlaces } from './kakaoMaps';

describe('loadKakaoMaps', () => {
  it('rejects when the Kakao Maps JavaScript key is missing', async () => {
    await expect(loadKakaoMaps('')).rejects.toThrow('VITE_KAKAO_MAP_API_KEY');
  });
});

describe('searchKakaoPlaces', () => {
  it('resolves to an empty list for a blank keyword without loading the SDK', async () => {
    await expect(searchKakaoPlaces('   ')).resolves.toEqual([]);
  });
});
