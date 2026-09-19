export function submitCoursePlaceKeyword(
  keyword: string,
  onNearbyKeyword: (keyword: string) => void,
): boolean {
  const normalizedKeyword = keyword.trim();
  if (!normalizedKeyword) return false;
  onNearbyKeyword(normalizedKeyword);
  return true;
}
