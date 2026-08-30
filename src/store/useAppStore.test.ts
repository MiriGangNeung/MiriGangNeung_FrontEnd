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

  it('stores detailed preferences and removes them when their broad type is deselected', () => {
    type PreferenceState = {
      types: string[];
      detailTypes: string[];
      toggleType: (id: string) => void;
      toggleDetailType: (id: string) => void;
    };
    const state = useAppStore.getState() as PreferenceState;

    state.toggleType('food');
    state.toggleDetailType('food:chinese');

    expect((useAppStore.getState() as PreferenceState).detailTypes).toEqual(['food:chinese']);

    state.toggleType('food');

    expect((useAppStore.getState() as PreferenceState).types).not.toContain('food');
    expect((useAppStore.getState() as PreferenceState).detailTypes).toEqual([]);
  });

  it('allows all four travel types and multiple details within one type', () => {
    useAppStore.setState({ types: ['rest'], detailTypes: [] });
    const state = useAppStore.getState();

    state.toggleType('food');
    state.toggleType('culture');
    state.toggleType('nature');
    state.toggleDetailType('food:korean');
    state.toggleDetailType('food:japanese');

    expect(useAppStore.getState().types).toEqual(['rest', 'food', 'culture', 'nature']);
    expect(useAppStore.getState().detailTypes).toEqual(['food:korean', 'food:japanese']);
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

  it('migrates an old active-only session to a supported travel type', async () => {
    const storage = createMemoryStorage();
    storage.setItem(
      'mirigangneung-app-state-v1',
      JSON.stringify({
        state: {
          types: ['active'],
          detailTypes: [],
        },
        version: 0,
      }),
    );
    vi.stubGlobal('sessionStorage', storage);
    vi.resetModules();

    const migratedModule = await import('./useAppStore');

    expect(migratedModule.useAppStore.getState().types).toEqual(['rest']);
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
