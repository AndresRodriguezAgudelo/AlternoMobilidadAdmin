import { create } from 'zustand';
import { Guide, GuideResponse } from '../types/guide';

interface GuidesState {
  guides: Guide[];
  meta: GuideResponse['meta'] | null;
  setGuides: (guides: Guide[]) => void;
  setMeta: (meta: GuideResponse['meta']) => void;
  clearGuides: () => void;
}

export const useGuidesStore = create<GuidesState>((set) => ({
  guides: [],
  meta: null,
  setGuides: (guides) => set({ guides }),
  setMeta: (meta) => set({ meta }),
  clearGuides: () => set({ guides: [], meta: null })
}));
