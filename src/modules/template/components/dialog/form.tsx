import { Box, TabPanels, Tabs } from '@chakra-ui/react';

import { Dialog, SquarePlusIcon, StepProgress } from '@/components';

import { IStep, useSteps } from '../../hooks';
import { useTemplateStore } from '../../store';

const CreateTemplateForm = () => {
  const { step } = useTemplateStore();
  const { steps, handleSubmit, onClose } = useSteps();

  return (
    <form onSubmit={handleSubmit(steps[step].onSubmit)}>
      <Box mb="100%" maxW={420}>
        <Box hidden={steps[step].hiddeProgressBar} mb={12}>
          <StepProgress length={steps.length} value={step} />
        </Box>
        <Tabs index={step} colorScheme="green">
          <TabPanels>{steps?.map((step: IStep) => step.component)}</TabPanels>
        </Tabs>
      </Box>

      <Dialog.Actions mt="auto" maxW={420} hidden={steps[step].hiddeFooter}>
        <Dialog.SecondaryAction onClick={onClose}>
          Cancel
        </Dialog.SecondaryAction>
        <Dialog.PrimaryAction
          hidden={steps[step].hiddeFooter}
          type="submit"
          leftIcon={<SquarePlusIcon />}
          isDisabled={steps[step].isLoading}
          isLoading={steps[step].isLoading}
        >
          Continue
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </form>
  );
};

export { CreateTemplateForm };
