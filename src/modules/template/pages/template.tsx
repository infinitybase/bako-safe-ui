import { Dialog } from '@/components';

import { CreateTemplateForm } from '../components/dialog';
import { useSteps } from '../hooks';
import { useTemplateStore } from '../store';

const TemplatePage = () => {
  const { step } = useTemplateStore();
  const { steps, onClose } = useSteps();

  return (
    <Dialog.Modal isOpen={true} onClose={onClose}>
      <Dialog.Header
        maxW={420}
        hidden={steps[step].hiddeTitle}
        title="Create Template"
        description="Define the name and description of this template. These details will be visible only to you."
      />

      <Dialog.Body maxW={420}>
        <CreateTemplateForm />
      </Dialog.Body>
    </Dialog.Modal>
  );
};

export { TemplatePage };
