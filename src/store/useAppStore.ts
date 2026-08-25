import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

export const MAX_PICKS = 3;
const MAX_TYPES = 2;

interface AppState {
  courseId: string;
  picks: string[];
  onePick: string;
  placeImageIndexes: Record<string, number>;
  types: string[];
  companion: string;
  duration: string;
  startDate: string;
  endDate: string;
  togglePick: (id: string) => void;
  setOnePick: (id: string) => void;
  setPlaceImageIndex: (placeId: string, imageIndex: number) => void;
  toggleType: (id: string) => void;
  setCompanion: (id: string) => void;
  setDuration: (id: string) => void;
  setStartDate: (value: string) => void;
  setEndDate: (value: string) => void;
  setCourseId: (id: string) => void;
}

const unavailableSessionStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      courseId: '',
      picks: [],
      onePick: '',
      placeImageIndexes: {},
      types: ['active'],
      companion: 'couple',
      duration: 'day',
      startDate: '2026-08-08',
      endDate: '2026-08-09',

      togglePick: (id) => {
        const prev = get().picks;
        const next = prev.includes(id)
          ? prev.filter((x) => x !== id)
          : prev.length < MAX_PICKS
            ? [...prev, id]
            : prev;
        const onePick = next.includes(get().onePick) ? get().onePick : (next[0] ?? '');
        set({ picks: next, onePick, courseId: '' });
      },
      setOnePick: (id) => set({ onePick: id, courseId: '' }),
      setPlaceImageIndex: (placeId, imageIndex) =>
        set((state) => ({
          placeImageIndexes: {
            ...state.placeImageIndexes,
            [placeId]: imageIndex,
          },
        })),
      toggleType: (id) => {
        const prev = get().types;
        const next = prev.includes(id)
          ? prev.length > 1
            ? prev.filter((x) => x !== id)
            : prev
          : prev.length >= MAX_TYPES
            ? [...prev.slice(1), id]
            : [...prev, id];
        set({ types: next });
      },
      setCompanion: (id) => set({ companion: id }),
      setDuration: (id) => set({ duration: id }),
      setStartDate: (value) => set({ startDate: value }),
      setEndDate: (value) => set({ endDate: value }),
      setCourseId: (id) => set({ courseId: id }),
    }),
    {
      name: 'mirigangneung-app-state-v1',
      storage: createJSONStorage(() =>
        typeof globalThis.sessionStorage === 'undefined'
          ? unavailableSessionStorage
          : globalThis.sessionStorage,
      ),
      partialize: (state) => ({
        courseId: state.courseId,
        picks: state.picks,
        onePick: state.onePick,
        placeImageIndexes: state.placeImageIndexes,
        types: state.types,
        companion: state.companion,
        duration: state.duration,
        startDate: state.startDate,
        endDate: state.endDate,
      }),
    },
  ),
);
