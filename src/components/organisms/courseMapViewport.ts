type MapViewportState = {
  map: Pick<kakao.maps.Map, 'panTo' | 'setBounds'>;
  bounds: kakao.maps.LatLngBounds;
  positions: kakao.maps.LatLng[];
};

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
