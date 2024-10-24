import { TemplatePage } from '../pages';
import { useTemplateStore } from '../store';
import { useSteps } from './useSteps';

const CreateTemplatePage = () => {
  const { step } = useTemplateStore();
  const { steps, onClose } = useSteps();
  return (
    <TemplatePage onClose={onClose} isOpen={true} step={step} steps={steps} />
  );
};

export { CreateTemplatePage };
