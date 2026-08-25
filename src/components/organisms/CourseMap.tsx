import { useEffect, useRef, useState } from 'react';
import { loadKakaoMaps } from '../../lib/kakaoMaps';
import { fetchWalkingRoute } from '../../lib/walkingRoute';
import type { CourseStop } from '../../types/domain';
import { toCourseCoordinates, toRouteStops } from './courseMapHelpers';
import { updateMapViewport } from './courseMapViewport';

type CourseMapProps = {
  courseStops: CourseStop[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

type MapState = {
  map: kakao.maps.Map;
  maps: typeof kakao.maps;
  bounds: kakao.maps.LatLngBounds;
  markers: kakao.maps.Marker[];
  polyline: kakao.maps.Polyline | null;
  positions: kakao.maps.LatLng[];
  stops: CourseStop[];
};

export function CourseMap({ courseStops, activeIndex, onSelect }: CourseMapProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const mapStateRef = useRef<MapState | null>(null);
  const onSelectRef = useRef(onSelect);
  const activeIndexRef = useRef(0);
  const [error, setError] = useState<string | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);

  onSelectRef.current = onSelect;
  activeIndexRef.current = activeIndex;

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      if (!hostRef.current || courseStops.length === 0) return;

      try {
        setError(null);
        setRouteError(null);
        const maps = await loadKakaoMaps();
        if (cancelled || !hostRef.current) return;

        const coordinates = toCourseCoordinates(courseStops);
        const positions = coordinates.map(({ lat, lng }) => new maps.LatLng(lat, lng));
        const bounds = new maps.LatLngBounds();
        positions.forEach((position) => bounds.extend(position));

        const map = new maps.Map(hostRef.current, { center: positions[0], level: 7 });
        const markers = courseStops.map((stop, index) => {
          const marker = new maps.Marker({
            map,
            position: positions[index],
            title: stop.name,
            image: createPinImage(maps, stop.n, index === activeIndexRef.current),
          });
          maps.event.addListener(marker, 'click', () => onSelectRef.current(index));
          return marker;
        });

        map.setBounds(bounds, 48, 48, 48, 48);
        const state: MapState = {
          map,
          maps,
          bounds,
          markers,
          polyline: null,
          positions,
          stops: courseStops,
        };
        mapStateRef.current = state;
        focusActiveStop(state, activeIndexRef.current, false);

        if (courseStops.length > 1) {
          void fetchWalkingRoute(toRouteStops(courseStops))
            .then((routePoints) => {
              if (cancelled || mapStateRef.current !== state || routePoints.length < 2) return;
              state.polyline = new maps.Polyline({
                map,
                path: routePoints.map(({ lat, lng }) => new maps.LatLng(lat, lng)),
                strokeColor: '#2F6FED',
                strokeWeight: 5,
                strokeOpacity: 0.85,
                strokeStyle: 'solid',
              });
            })
            .catch(() => {
              if (!cancelled) {
                setRouteError('도보 경로를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
              }
            });
        }
      } catch {
        if (!cancelled) {
          setError('카카오맵을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
        }
      }
    }

    void initialize();
    return () => {
      cancelled = true;
      const state = mapStateRef.current;
      state?.markers.forEach((marker) => marker.setMap(null));
      state?.polyline?.setMap(null);
      mapStateRef.current = null;
    };
  }, [courseStops]);

  useEffect(() => {
    focusActiveStop(mapStateRef.current, activeIndex, true);
  }, [activeIndex]);

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slot px-6 text-center text-sm text-ink-muted">
        {error}
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-slot">
      <div ref={hostRef} className="h-full w-full" />
      {routeError && (
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-lg bg-white/95 px-3 py-2 text-xs font-medium text-ink-muted shadow"
          role="status"
        >
          {routeError}
        </div>
      )}
    </div>
  );
}

function focusActiveStop(state: MapState | null, activeIndex: number, shouldFocus: boolean) {
  if (!state) return;

  state.markers.forEach((marker, index) => {
    marker.setImage(createPinImage(state.maps, state.stops[index].n, index === activeIndex));
    marker.setZIndex(index === activeIndex ? 1000 : 0);
  });

  updateMapViewport(state, activeIndex, shouldFocus);
}

function createPinImage(maps: typeof kakao.maps, number: number, active: boolean) {
  const size = active ? 44 : 34;
  const color = active ? '#1E54C4' : '#2F6FED';
  const ring = active
    ? '<circle cx="50%" cy="50%" r="20" fill="none" stroke="#2F6FED" stroke-opacity=".22" stroke-width="6" />'
    : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 44 44">${ring}<circle cx="22" cy="22" r="${active ? 16 : 14}" fill="${color}" stroke="#fff" stroke-width="2.5"/><text x="22" y="27" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="${active ? 17 : 14}" font-weight="700">${number}</text></svg>`;
  const source = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  return new maps.MarkerImage(source, new maps.Size(size, size), {
    offset: new maps.Point(size / 2, size / 2),
  });
}
