/**
 * Mock photo data — kept separate from `places.ts` core data.
 * jeongdongjin, anmok, jumunjin, daegwallyeong, seongyojang, gyeongpo are real photos
 * of the actual location (Wikimedia Commons). haslla, simgok, gwaebangsan have no
 * verified Commons photo of the exact spot, so a matching real-world stand-in
 * (Pexels) is used instead — swap in an exact photo when available.
 */
export const PLACE_PHOTOS: Record<string, string> = {
  jeongdongjin:
    'https://upload.wikimedia.org/wikipedia/commons/d/d7/Jeongdongjin_Station_20160804_145225.jpg',
  anmok:
    'https://upload.wikimedia.org/wikipedia/commons/0/0b/%EC%95%88%EB%AA%A9%ED%95%B4%EB%B3%80%2C_AM_%EB%A3%A8%ED%94%84%ED%83%91%EC%97%90%EC%84%9C_%EB%B3%B8_%ED%92%8D%EA%B2%BD.jpg',
  jumunjin: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Jumunjin_Harbor_20220501_003.jpg',
  daegwallyeong: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Daegwallyeong_Sheep_Farm.jpg',
  haslla:
    'https://images.pexels.com/photos/34630125/pexels-photo-34630125.jpeg?auto=compress&cs=tinysrgb&w=1200',
  simgok:
    'https://images.pexels.com/photos/31939442/pexels-photo-31939442.jpeg?auto=compress&cs=tinysrgb&w=1200',
  seongyojang: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Seongyojang_20220501_060.jpg',
  gwaebangsan:
    'https://images.pexels.com/photos/36722392/pexels-photo-36722392.jpeg?auto=compress&cs=tinysrgb&w=1200',
  gyeongpo:
    'https://upload.wikimedia.org/wikipedia/commons/a/a9/%EA%B2%BD%ED%8F%AC%ED%95%B4%EB%B3%80.jpg',
};

/** Screen 1 hero photo: 진짜 강릉 시원하고 뻥 뚫린 경포 동해 바다 풍경 */
export const HERO_PHOTO =
  'https://upload.wikimedia.org/wikipedia/commons/a/a9/%EA%B2%BD%ED%8F%AC%ED%95%B4%EB%B3%80.jpg';
