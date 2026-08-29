import { describe, expect, it, vi } from 'vitest';

import {
  captureMapViewport,
  focusMapOnPosition,
  relayoutMap,
  restoreMapViewport,
  updateMapViewport,
} from './courseMapViewport';

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

describe('map viewport persistence', () => {
  it('captures the current map center and zoom level before the map is recreated', () => {
    const center = {
      getLat: () => 37.75,
      getLng: () => 128.9,
    };
    const map = {
      getCenter: () => center,
      getLevel: () => 6,
    };

    expect(captureMapViewport(map)).toEqual({
      latitude: 37.75,
      longitude: 128.9,
      level: 6,
    });
  });

  it('restores a saved center and zoom level on the recreated map', () => {
    const position = {} as kakao.maps.LatLng;
    const map = {
      setCenter: vi.fn(),
      setLevel: vi.fn(),
    };

    restoreMapViewport(map, () => position, {
      latitude: 37.75,
      longitude: 128.9,
      level: 6,
    });

    expect(map.setCenter).toHaveBeenCalledWith(position);
    expect(map.setLevel).toHaveBeenCalledWith(6);
  });

  it('focuses the selected tourism stop without zooming out an already closer map', () => {
    const position = {} as kakao.maps.LatLng;
    const map = {
      panTo: vi.fn(),
      getLevel: vi.fn(() => 4),
      setLevel: vi.fn(),
    };

    focusMapOnPosition(map, position, 5);

    expect(map.panTo).toHaveBeenCalledWith(position);
    expect(map.setLevel).not.toHaveBeenCalled();
  });
});
