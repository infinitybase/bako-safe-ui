import { create } from 'zustand';

interface Store {
  isTokenExpired: boolean;
  setIsTokenExpired: (isTokenExpired: boolean) => void;
}

const useAuthStore = create<Store>((set) => ({
  isTokenExpired: false,
  setIsTokenExpired: (isTokenExpired) => set({ isTokenExpired }),
}));

export { useAuthStore };
