import { create } from 'zustand';

interface Store {
  unreadCounter: number;
  setUnreadCounter: (unreadCounter: number) => void;
}

const useNotificationsStore = create<Store>((set) => ({
  unreadCounter: 0,
  setUnreadCounter: (unreadCounter) => set({ unreadCounter }),
}));

export { useNotificationsStore };
