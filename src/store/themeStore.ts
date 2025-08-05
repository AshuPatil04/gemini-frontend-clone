

import { create } from 'zustand';

export const useThemeStore = create<{
  dark: boolean;
  toggle: () => void;
}>((set) => ({
  dark: false,
  toggle: () => set((s) => ({ dark: !s.dark })),
}));
