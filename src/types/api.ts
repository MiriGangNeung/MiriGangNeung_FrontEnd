import type { CourseStop, Place } from './domain';

export interface PlacesResponse {
  places: Place[];
}

export type CompositeJobStatus = 'queued' | 'running' | 'done';

export interface CompositeJob {
  id: string;
  status: CompositeJobStatus;
  progress: number;
  resultUrl?: string;
}

export interface CreateCourseRequest {
  placeIds: string[];
  onePickId: string;
  types: string[];
  companion: string;
  duration: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateCourseResponse {
  stops: CourseStop[];
}
