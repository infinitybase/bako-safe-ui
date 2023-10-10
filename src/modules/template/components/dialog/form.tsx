import { Box, TabPanels, Tabs } from '@chakra-ui/react';

import { Dialog, SquarePlusIcon, StepProgress } from '@/components';

import { IStep, useModal, useSteps } from '../../hooks';
import { useTemplateStore } from '../../store';

const CreateTemplateForm = () => {
  const { step } = useTemplateStore();
  const { steps, handleSubmit } = useSteps();
  const { closeModal } = useModal();

  return (
    <form onSubmit={handleSubmit(steps[step].onSubmit)}>
      <Box w="full" maxW={420}>
        <Box hidden={steps[step].hiddeProgressBar} mb={12}>
          <StepProgress length={steps.length} value={step} />
        </Box>
        <Tabs index={step} colorScheme="green">
          <TabPanels>{steps?.map((step: IStep) => step.component)}</TabPanels>
        </Tabs>
      </Box>

      <Dialog.Actions maxW={420} hidden={steps[step].hiddeFooter}>
        <Dialog.SecondaryAction
          onClick={() => {
            closeModal();
          }}
        >
          cancel
        </Dialog.SecondaryAction>
        <Dialog.PrimaryAction
          hidden={steps[step].hiddeFooter}
          type="submit"
          leftIcon={<SquarePlusIcon />}
          isDisabled={steps[step].isLoading}
        >
          Continue
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </form>
  );
};

export { CreateTemplateForm };
