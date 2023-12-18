import { Dialog, DialogModalProps } from '@/components';

import { CreateTemplateForm } from '../components/dialog';
import { IStep } from '../hooks';
import { useTemplateStore } from '../store';

const TemplatePage = (
  props: Omit<DialogModalProps, 'children'> & {
    steps: IStep[];
    step: number;
  },
) => {
  const { step } = useTemplateStore();
  const { onClose, steps } = props;

  return (
    <Dialog.Modal isOpen={true} onClose={onClose} closeOnOverlayClick={false}>
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
