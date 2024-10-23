import { create } from 'zustand';

interface Store {
  unreadCounter: number;
  setUnreadCounter: (unreadCounter: number) => void;
  hasNewNotification: boolean;
  setHasNewNotification: (hasNewNotification: boolean) => void;
}

const useNotificationsStore = create<Store>((set) => ({
  unreadCounter: 0,
  setUnreadCounter: (unreadCounter) => set({ unreadCounter }),
  hasNewNotification: false,
  setHasNewNotification: (hasNewNotification) => set({ hasNewNotification }),
}));

export { useNotificationsStore };
