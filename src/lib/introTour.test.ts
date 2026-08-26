import { describe, expect, it } from 'vitest';

import { getIntroTourStops } from './introTour';

describe('getIntroTourStops', () => {
  it('joins the prescribed three places in travel-time order', () => {
    expect(
      getIntroTourStops().map(({ place, time, caption }) => ({ id: place.id, time, caption })),
    ).toEqual([
      { id: 'jeongdongjin', time: '09:00', caption: '강릉에서 시작하는 아침' },
      { id: 'anmok', time: '14:30', caption: '바다와 커피가 있는 오후' },
      { id: 'jumunjin', time: '18:20', caption: '노을과 항구의 마무리' },
    ]);
  });
});
