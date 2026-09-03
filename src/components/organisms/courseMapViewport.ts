type MapViewportState = {
  map: Pick<kakao.maps.Map, 'panTo' | 'setBounds'> & {
    getProjection?: kakao.maps.Map['getProjection'];
  };
  bounds: kakao.maps.LatLngBounds;
  positions: kakao.maps.LatLng[];
};

type MapRelayoutState = {
  map: Pick<kakao.maps.Map, 'relayout'>;
};

export type MapViewportSnapshot = {
  latitude: number;
  longitude: number;
  level: number;
};

export function relayoutMap(state: MapRelayoutState) {
  state.map.relayout();
}

export function captureMapViewport(
  map: Pick<kakao.maps.Map, 'getCenter' | 'getLevel'>,
): MapViewportSnapshot {
  const center = map.getCenter();
  return {
    latitude: center.getLat(),
    longitude: center.getLng(),
    level: map.getLevel(),
  };
}

export function restoreMapViewport(
  map: Pick<kakao.maps.Map, 'setCenter' | 'setLevel'>,
  createPosition: (latitude: number, longitude: number) => kakao.maps.LatLng,
  snapshot: MapViewportSnapshot,
) {
  map.setCenter(createPosition(snapshot.latitude, snapshot.longitude));
  map.setLevel(snapshot.level);
}

export function focusMapOnPosition(
  map: Pick<kakao.maps.Map, 'panTo' | 'getLevel' | 'setLevel'>,
  position: kakao.maps.LatLng | undefined,
  targetLevel: number,
) {
  if (!position) return;

  map.panTo(position);
  if (map.getLevel() > targetLevel) {
    map.setLevel(targetLevel);
  }
}

export function updateMapViewport(
  state: MapViewportState,
  activeIndex: number,
  shouldFocus: boolean,
  offsetY = 0,
) {
  if (!shouldFocus) return;

  const position = state.positions[activeIndex];
  if (!position) {
    state.map.setBounds(state.bounds, 48, 48, 48, 48);
    return;
  }

  panToPosition(state.map, position, offsetY);
}

/**
 * Returns the amount a map target must be lifted from the full-map centre to
 * land at the centre of the area not covered by a bottom sheet or action bar.
 */
export function getVisibleMapFocusOffset(
  mapHeight: number,
  sheetVisibleFraction: number,
  bottomInset: number,
) {
  const visibleHeight = Math.max(0, mapHeight * (1 - sheetVisibleFraction) - bottomInset);
  return Math.max(0, (mapHeight - visibleHeight) / 2);
}

/**
 * Pan the map to `position`. On mobile the bottom sheet covers the lower half of
 * the map, so a positive `offsetY` (px) shifts the target up to land it in the
 * middle of the visible strip.
 */
export function panToPosition(
  map: MapViewportState['map'],
  position: kakao.maps.LatLng,
  offsetY = 0,
) {
  const projection = offsetY > 0 ? map.getProjection?.() : undefined;
  if (projection && offsetY > 0) {
    const point = projection.pointFromCoords(position);
    point.y += offsetY;
    map.panTo(projection.coordsFromPoint(point));
    return;
  }
  map.panTo(position);
}
