import { useTemplateStore } from '../store/useTemplateStore';

const useModal = () => {
  const { isOpen, setIsOpen, step, setStep } = useTemplateStore();

  const openModal = () => setIsOpen(true);

  const nextStep = () => {
    setStep(step + 1);
  };
  const prevStep = () => setStep(step - 1);

  return { isOpen, openModal, step, nextStep, prevStep };
};

export { useModal };
