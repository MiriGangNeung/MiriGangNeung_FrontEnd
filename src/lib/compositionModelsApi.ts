const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:8080/api/v1';

export interface CompositionModel {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
}

export async function fetchCompositionModels(baseUrl = API_BASE_URL): Promise<CompositionModel[]> {
  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/composition-models`);
  if (!response.ok) throw new Error(`composition models request failed: ${response.status}`);
  return (await response.json()) as CompositionModel[];
}

export function toCompositionModelImageUrl(imageUrl: string, baseUrl = API_BASE_URL) {
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return new URL(imageUrl, `${baseUrl.replace(/\/$/, '')}/`).toString();
}
