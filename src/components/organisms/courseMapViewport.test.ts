import { describe, expect, it, vi } from 'vitest';

import { relayoutMap, updateMapViewport } from './courseMapViewport';

describe('relayoutMap', () => {
  it('recalculates the Kakao map tiles after the host size changes', () => {
    const map = {
      relayout: vi.fn(),
    };

    relayoutMap({ map });

    expect(map.relayout).toHaveBeenCalledOnce();
  });
});

describe('updateMapViewport', () => {
  it('preserves the user zoom level while centering the active stop', () => {
    const position = {} as kakao.maps.LatLng;
    const bounds = {} as kakao.maps.LatLngBounds;
    const map = {
      panTo: vi.fn(),
      setBounds: vi.fn(),
      setLevel: vi.fn(),
    };

    updateMapViewport({ map, bounds, positions: [position] }, 0, true);

    expect(map.panTo).toHaveBeenCalledWith(position);
    expect(map.setBounds).not.toHaveBeenCalled();
    expect(map.setLevel).not.toHaveBeenCalled();
  });

  it('keeps the initial course bounds when focus movement is disabled', () => {
    const map = {
      panTo: vi.fn(),
      setBounds: vi.fn(),
      setLevel: vi.fn(),
    };

    updateMapViewport(
      {
        map,
        bounds: {} as kakao.maps.LatLngBounds,
        positions: [{} as kakao.maps.LatLng],
      },
      0,
      false,
    );

    expect(map.panTo).not.toHaveBeenCalled();
    expect(map.setBounds).not.toHaveBeenCalled();
    expect(map.setLevel).not.toHaveBeenCalled();
  });
});
