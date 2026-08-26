export function moveCourseStop(stopIds: string[], fromIndex: number, toIndex: number): string[] {
  if (
    fromIndex < 0 ||
    fromIndex >= stopIds.length ||
    toIndex < 0 ||
    toIndex >= stopIds.length ||
    fromIndex === toIndex
  ) {
    return [...stopIds];
  }

  const next = [...stopIds];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}
