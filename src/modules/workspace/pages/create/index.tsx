import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { Controller } from 'react-hook-form';

import { Dialog, SquarePlusIcon, StepProgress } from '@/components';

import { OnboardingStep, SuccesStep } from '../../components';
import {
  TabState,
  UseCreateWorkspace,
  useCreateWorkspace,
} from '../../hooks/create';

const CreateWorkspaceForm = ({
  form,
}: {
  form: UseCreateWorkspace['form'];
}) => (
  <VStack spacing={6}>
    <Controller
      control={form.control}
      name="name"
      render={({ field, fieldState }) => (
        <FormControl isInvalid={fieldState.invalid}>
          <Input
            value={field.value}
            onChange={field.onChange}
            placeholder=" "
          />
          <FormLabel>Name your workspace</FormLabel>
          <FormHelperText color="error.500">
            {fieldState.error?.message}
          </FormHelperText>
        </FormControl>
      )}
    />
    <FormControl>
      <Textarea {...form.register('description')} placeholder=" " />
      <FormLabel>Description</FormLabel>
      <FormHelperText>Optional</FormHelperText>
    </FormControl>
  </VStack>
);

const CreateWorkspacePage = () => {
  const { request, form, tabs, handleClose, handleGoToWorkspace } =
    useCreateWorkspace();

  return (
    <Dialog.Modal isOpen onClose={handleClose} closeOnOverlayClick={false}>
      {tabs.is(TabState.FORM) && (
        <Dialog.Header
          maxW={420}
          title="Create Workspace"
          description="Setting Sail on a Journey to Unlock the Potential of User-Centered Design."
        />
      )}

      <Dialog.Body maxW={tabs.is(TabState.ON_BOARDING) ? 540 : 420}>
        <Box hidden={!tabs.is(TabState.FORM)} mb={12}>
          <StepProgress length={tabs.tabsLength} value={tabs.tab} />
        </Box>
        <Tabs index={tabs.tab} colorScheme="green">
          <TabPanels>
            <TabPanel>
              <OnboardingStep
                onCancel={handleClose}
                onConfirm={() => tabs.set(TabState.FORM)}
              />
            </TabPanel>
            <TabPanel>
              <CreateWorkspaceForm form={form} />
            </TabPanel>
            <TabPanel>
              <SuccesStep
                onGoToWorkspace={handleGoToWorkspace}
                onConfigureMembers={handleClose}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Dialog.Body>

      <Dialog.Actions hidden={!tabs.is(TabState.FORM)} maxW={420}>
        <Dialog.SecondaryAction onClick={handleClose}>
          Cancel
        </Dialog.SecondaryAction>
        <Dialog.PrimaryAction
          onClick={form.handleCreateWorkspace}
          leftIcon={<SquarePlusIcon />}
          isDisabled={request.isLoading}
          isLoading={request.isLoading}
        >
          Continue
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};

export { CreateWorkspacePage };
