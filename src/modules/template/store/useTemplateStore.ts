import { create } from 'zustand';

interface State {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  step: number;
  setStep: (step: number) => void;
}

const useTemplateStore = create<State>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  step: 0,
  setStep: (step) => set({ step }),
}));

export { useTemplateStore };
