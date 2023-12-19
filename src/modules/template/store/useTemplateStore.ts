import { create } from 'zustand';

interface State {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  step: number;
  setStep: (step: number) => void;
  templateFormInitial: {
    minSigners: number;
    addresses: string[];
  };
  setTemplateFormInitial: (params: {
    minSigners: number;
    addresses: string[];
  }) => void;
}

const useTemplateStore = create<State>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  step: 0,
  setStep: (step) => set({ step }),
  templateFormInitial: {
    minSigners: 0,
    addresses: [],
  },
  setTemplateFormInitial: (templateFormInitial) => set({ templateFormInitial }),
}));

export { useTemplateStore };
