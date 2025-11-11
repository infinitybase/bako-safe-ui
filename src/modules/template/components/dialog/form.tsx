import { Box } from 'bako-ui';

import { Dialog, SquarePlusIcon, StepProgress } from '@/components';

import { useSteps } from '../../hooks';
import { useTemplateStore } from '../../store';

const CreateTemplateForm = () => {
  const { step } = useTemplateStore();
  const { steps, handleSubmit, onClose } = useSteps();

  return (
    <form onSubmit={handleSubmit(steps[step].onSubmit)} style={{ flex: 1 }}>
      <Box display="flex" flexDirection="column" height="100%">
        <Box maxW={420}>
          <Box hidden={steps[step].hiddeProgressBar} mb={12}>
            <StepProgress length={steps.length} value={step} />
          </Box>
          <Box>{steps[step]?.component}</Box>
        </Box>

        <Dialog.Actions
          mt={{ base: 'auto', sm: 0 }}
          maxW={420}
          hidden={steps[step].hiddeFooter}
        >
          <Dialog.SecondaryAction onClick={onClose}>
            Cancel
          </Dialog.SecondaryAction>
          <Dialog.PrimaryAction
            hidden={steps[step].hiddeFooter}
            type="submit"
            disabled={steps[step].isLoading}
            loading={steps[step].isLoading}
          >
            <SquarePlusIcon />
            Continue
          </Dialog.PrimaryAction>
        </Dialog.Actions>
      </Box>
    </form>
  );
};

export { CreateTemplateForm };
