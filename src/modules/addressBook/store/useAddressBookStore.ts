import { create } from 'zustand';

interface State {
  address: string;
  setAddress: (address: string) => void;
}

const useAddressBookStore = create<State>((set) => ({
  address: '',
  setAddress: (address) => set({ address }),
}));

export { useAddressBookStore };
