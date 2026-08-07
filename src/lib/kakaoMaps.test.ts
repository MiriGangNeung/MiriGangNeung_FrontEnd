import { describe, expect, it } from 'vitest';

import { loadKakaoMaps } from './kakaoMaps';

describe('loadKakaoMaps', () => {
  it('rejects when the Kakao Maps JavaScript key is missing', async () => {
    await expect(loadKakaoMaps('')).rejects.toThrow('VITE_KAKAO_MAP_API_KEY');
  });
});
