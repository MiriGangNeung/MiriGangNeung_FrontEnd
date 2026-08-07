let sdkPromise: Promise<typeof kakao.maps> | null = null;

export function loadKakaoMaps(apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY) {
  if (!apiKey) return Promise.reject(new Error('VITE_KAKAO_MAP_API_KEY is required'));
  if (window.kakao?.maps) return Promise.resolve(window.kakao.maps);
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = 'kakao-maps-sdk';
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(apiKey)}&autoload=false`;
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
