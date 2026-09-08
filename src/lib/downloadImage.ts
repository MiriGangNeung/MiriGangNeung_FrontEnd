/** Fetch an image URL and trigger a browser download with the given filename. */
export async function downloadImage(url: string, filename: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`다운로드 실패 (${response.status})`);
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}
