declare namespace kakao.maps {
  class LatLng {
    constructor(latitude: number, longitude: number);
  }

  class LatLngBounds {
    extend(position: LatLng): void;
  }

  class Map {
    constructor(container: HTMLElement, options: { center: LatLng; level: number });
    panTo(position: LatLng): void;
    setBounds(
      bounds: LatLngBounds,
      top?: number,
      right?: number,
      bottom?: number,
      left?: number,
    ): void;
    setCenter(position: LatLng): void;
    setLevel(level: number): void;
    relayout(): void;
  }

  class Size {
    constructor(width: number, height: number);
  }

  class Point {
    constructor(x: number, y: number);
  }

  class MarkerImage {
    constructor(src: string, size: Size, options?: { offset?: Point });
  }

  class Marker {
    constructor(options: { map: Map; position: LatLng; title?: string; image?: MarkerImage });
    setImage(image: MarkerImage): void;
    setMap(map: Map | null): void;
    setZIndex(zIndex: number): void;
  }

  class Polyline {
    constructor(options: {
      map: Map;
      path: LatLng[];
      strokeWeight?: number;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeStyle?: string;
    });
    setMap(map: Map | null): void;
    setPath(path: LatLng[]): void;
  }

  namespace event {
    function addListener(target: Marker, event: 'click', handler: () => void): void;
  }

  function load(callback: () => void): void;
}

declare namespace kakao.maps.services {
  interface PlacesSearchResultItem {
    id: string;
    place_name: string;
    category_name: string;
    address_name: string;
    road_address_name: string;
    x: string;
    y: string;
  }

  type PlacesSearchStatus = 'OK' | 'ZERO_RESULT' | 'ERROR';

  const Status: {
    OK: 'OK';
    ZERO_RESULT: 'ZERO_RESULT';
    ERROR: 'ERROR';
  };

  class Places {
    keywordSearch(
      keyword: string,
      callback: (results: PlacesSearchResultItem[], status: PlacesSearchStatus) => void,
    ): void;
  }
}

interface Window {
  kakao?: { maps: typeof kakao.maps };
}
