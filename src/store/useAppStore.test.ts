import { afterEach, describe, expect, it, vi } from 'vitest';
import type { StateStorage } from 'zustand/middleware';

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

describe('useAppStore session persistence', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it('restores the trip selections after the store module is reloaded', async () => {
    vi.stubGlobal('sessionStorage', createMemoryStorage());
    vi.resetModules();

    const firstModule = await import('./useAppStore');
    firstModule.useAppStore.getState().togglePick('anmok');
    firstModule.useAppStore.getState().setOnePick('anmok');
    firstModule.useAppStore.getState().setPlaceImageIndex('anmok', 3);
    firstModule.useAppStore.getState().setDuration('two-days');

    vi.resetModules();
    const reloadedModule = await import('./useAppStore');

    expect(reloadedModule.useAppStore.getState()).toMatchObject({
      picks: ['anmok'],
      onePick: 'anmok',
      placeImageIndexes: { anmok: 3 },
      duration: 'two-days',
    });
  });
});

function createMemoryStorage(): StateStorage {
  const entries = new Map<string, string>();

  return {
    getItem: (key) => entries.get(key) ?? null,
    removeItem: (key) => entries.delete(key),
    setItem: (key, value) => entries.set(key, value),
  };
}
