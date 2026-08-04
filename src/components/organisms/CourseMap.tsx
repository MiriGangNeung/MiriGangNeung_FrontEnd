import { useEffect, useRef } from 'react';
import type L from 'leaflet';
import type { CourseStop } from '../../types/domain';

type CourseMapProps = {
  courseStops: CourseStop[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

/**
 * Leaflet + OpenStreetMap map of the generated course.
 * npm i leaflet  ·  import 'leaflet/dist/leaflet.css' in your entry file.
 * Real geometry only — never hand-draw coastlines.
 */
export function CourseMap({ courseStops, activeIndex, onSelect }: CourseMapProps) {
  // eslint-disable-next-line no-undef -- HTMLDivElement is a TS DOM lib type, not a runtime global
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const boundsRef = useRef<L.LatLngBounds | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !hostRef.current || mapRef.current) return;

      const map = L.map(hostRef.current, { zoomControl: false });
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const line = L.polyline(
        courseStops.map((s) => [s.lat, s.lng]),
        {
          color: '#2F6FED',
          weight: 3,
          opacity: 0.75,
          dashArray: '2 9',
          lineCap: 'round',
        },
      ).addTo(map);

      markersRef.current = courseStops.map((stop, i) =>
        L.marker([stop.lat, stop.lng], { title: stop.name, icon: pinIcon(L, stop, false) })
          .addTo(map)
          .on('click', () => onSelect(i)),
      );

      mapRef.current = map;
      boundsRef.current = line.getBounds().pad(0.18);
      map.fitBounds(boundsRef.current);
      window.setTimeout(() => map.invalidateSize(), 60);
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [courseStops, onSelect]);

  useEffect(() => {
    (async () => {
      if (!mapRef.current || !markersRef.current.length) return;
      const L = (await import('leaflet')).default;
      markersRef.current.forEach((m, i) => {
        m.setIcon(pinIcon(L, courseStops[i], i === activeIndex));
        m.setZIndexOffset(i === activeIndex ? 1000 : 0);
      });
      const stop = courseStops[activeIndex];
      if (stop) mapRef.current.flyTo([stop.lat, stop.lng], 14, { duration: 0.7 });
      else if (boundsRef.current) mapRef.current.fitBounds(boundsRef.current);
    })();
  }, [courseStops, activeIndex]);

  return <div ref={hostRef} className="h-full w-full bg-slot" />;
}

function pinIcon(L: typeof import('leaflet'), stop: CourseStop, active: boolean) {
  const size = active ? 44 : 34;
  const html = `<div style="width:${size}px;height:${size}px;border-radius:999px;background:${active ? '#1E54C4' : '#2F6FED'};color:#fff;border:2.5px solid #fff;box-shadow:${
    active
      ? '0 0 0 6px rgba(47,111,237,.22),0 6px 14px rgba(16,24,40,.28)'
      : '0 2px 6px rgba(16,24,40,.28)'
  };display:flex;align-items:center;justify-content:center;font:700 ${active ? 17 : 14}px/1 'Noto Sans KR',sans-serif">${stop.n}</div>`;
  return L.divIcon({
    html,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}
