type MapViewportState = {
  map: Pick<kakao.maps.Map, 'panTo' | 'setBounds'>;
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
) {
  if (!shouldFocus) return;

  const position = state.positions[activeIndex];
  if (position) {
    state.map.panTo(position);
  } else {
    state.map.setBounds(state.bounds, 48, 48, 48, 48);
  }
}
