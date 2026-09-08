export function formatCompositionTimestamp(value: string): string | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts
      .filter((part) => ['month', 'day', 'hour', 'minute'].includes(part.type))
      .map((part) => [part.type, part.value]),
  );

  return `${values.month}/${values.day} ${values.hour}:${values.minute}`;
}
