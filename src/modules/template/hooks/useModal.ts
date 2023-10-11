import { useNavigate } from 'react-router-dom';

import { useTemplateStore } from '../store/useTemplateStore';

const useModal = () => {
  const { isOpen, setIsOpen, step, setStep } = useTemplateStore();
  const navigate = useNavigate();

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    navigate('/home');
  };
  const nextStep = () => {
    setStep(step + 1);
  };
  const prevStep = () => setStep(step - 1);

  return { isOpen, openModal, closeModal, step, nextStep, prevStep };
};

export { useModal };
