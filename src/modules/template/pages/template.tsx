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
    <Dialog.Modal
      size={{ base: 'full', sm: 'lg' }}
      isOpen={true}
      onClose={onClose}
      closeOnOverlayClick={false}
    >
      <Dialog.Header
        onClose={onClose}
        maxW={420}
        hidden={steps[step].hiddeTitle}
        title="Create Template"
        mt={0}
        description="Define the name and description of this template. These details will be visible only to you."
      />

      <Dialog.Body display="flex" flex={1} maxW={420}>
        <CreateTemplateForm />
      </Dialog.Body>
    </Dialog.Modal>
  );
};

export { TemplatePage };
