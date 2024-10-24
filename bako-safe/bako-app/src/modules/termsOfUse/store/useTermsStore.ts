import { create } from 'zustand';

interface Store {
  modalIsOpen: boolean;
  setModalIsOpen: (modalIsOpen: boolean) => void;
}

const useTermsStore = create<Store>((set) => ({
  modalIsOpen: false,
  setModalIsOpen: (modalIsOpen) => set({ modalIsOpen }),
}));

export { useTermsStore };
