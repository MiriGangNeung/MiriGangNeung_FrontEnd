import type { Place } from '../types/domain';

let sdkPromise: Promise<typeof kakao.maps> | null = null;

export function loadKakaoMaps(apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY) {
  if (!apiKey) return Promise.reject(new Error('VITE_KAKAO_MAP_API_KEY is required'));
  if (window.kakao?.maps) return Promise.resolve(window.kakao.maps);
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = 'kakao-maps-sdk';
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(apiKey)}&libraries=services&autoload=false`;
    script.onload = () => {
      if (!window.kakao?.maps) {
        reject(new Error('Kakao Maps SDK did not initialize'));
        return;
      }
      window.kakao.maps.load(() => resolve(window.kakao!.maps));
    };
    script.onerror = () => reject(new Error('Kakao Maps SDK failed to load'));
    document.head.append(script);
  });

  return sdkPromise;
}

/** Searches real places via the Kakao Places API (requires the `services` library loaded above). */
export function searchKakaoPlaces(keyword: string): Promise<Place[]> {
  const trimmed = keyword.trim();
  if (!trimmed) return Promise.resolve([]);

  return loadKakaoMaps().then(
    (maps) =>
      new Promise<Place[]>((resolve, reject) => {
        new maps.services.Places().keywordSearch(trimmed, (results, status) => {
          if (status === maps.services.Status.OK) {
            resolve(results.map(toPlace));
          } else if (status === maps.services.Status.ZERO_RESULT) {
            resolve([]);
          } else {
            reject(new Error('Kakao Places search failed'));
          }
        });
      }),
  );
}

// ponytail: `cat` drives category tabs on the one-pick screen only; CourseStop (what
// search results turn into) has no category field, so it's unused here. Hardcoded
// rather than mapping Kakao's category_group_code to satisfy the Place type.
function toPlace(result: kakao.maps.services.PlacesSearchResultItem): Place {
  const tag = result.category_name.split(' > ').at(-1);
  return {
    id: result.id,
    name: result.place_name,
    region: result.road_address_name || result.address_name,
    tags: tag ? [tag] : [],
    cat: 'food',
    lat: Number(result.y),
    lng: Number(result.x),
  };
}
