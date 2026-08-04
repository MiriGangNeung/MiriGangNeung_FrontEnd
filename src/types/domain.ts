export type PlaceCategory = 'beach' | 'food' | 'nature' | 'culture';

export interface Place {
  id: string;
  name: string;
  region: string;
  tags: string[];
  cat: PlaceCategory;
}

export interface Tab {
  id: string;
  label: string;
}

export type ComposePhase = 'ready' | 'running' | 'done';

export interface ComposeStage {
  label: string;
  hint: string;
}

export interface TripType {
  id: string;
  label: string;
}

export interface Companion {
  id: string;
  label: string;
  hint: string;
}

export interface Duration {
  id: string;
  label: string;
}

export type CrowdLevel = 'easy' | 'mid' | 'busy';

export interface CourseStop {
  n: number;
  id: string;
  name: string;
  time: string;
  stay: string;
  crowd: CrowdLevel;
  onePick?: boolean;
  note: string;
  lat: number;
  lng: number;
}
