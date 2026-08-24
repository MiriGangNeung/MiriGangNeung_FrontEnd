import { describe, expect, it } from 'vitest';

import { useAppStore } from './useAppStore';

describe('useAppStore initial place selection', () => {
  it('starts without mock place IDs before the API picker is loaded', () => {
    const state = useAppStore.getState();

    expect(state.picks).toEqual([]);
    expect(state.onePick).toBe('');
  });

  it('remembers the selected image index for each place', () => {
    type ImageSelectionState = {
      placeImageIndexes?: Record<string, number>;
      setPlaceImageIndex?: (placeId: string, imageIndex: number) => void;
    };
    const state = useAppStore.getState() as ImageSelectionState;

    state.setPlaceImageIndex?.('gyeongpo', 2);

    expect((useAppStore.getState() as ImageSelectionState).placeImageIndexes).toEqual({
      gyeongpo: 2,
    });
  });
});
