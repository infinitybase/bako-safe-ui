import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  ModalProps,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import {
  Dialog,
  FeedbackSuccess,
  SquarePlusIcon,
  StepProgress,
} from '@/components';

import {
  CreateWorkspaceTabState,
  UseCreateWorkspace,
  useCreateWorkspace,
} from '../../hooks/create';
import { OnboardingStep } from '..';

const CreateWorkspaceForm = ({
  form,
}: {
  form: UseCreateWorkspace['form'];
}) => (
  <VStack spacing={2}>
    <Controller
      control={form.control}
      name="name"
      render={({ field, fieldState }) => (
        <FormControl isInvalid={fieldState.invalid}>
          <Input
            minHeight={14}
            value={field.value}
            onChange={field.onChange}
            placeholder=" "
          />
          <FormLabel py={1}>Name your workspace</FormLabel>
          <FormHelperText color="error.500">
            {fieldState.error?.message}
          </FormHelperText>
        </FormControl>
      )}
    />
    <FormControl>
      <Textarea size="lg" {...form.register('description')} placeholder=" " />
      <FormLabel>Description</FormLabel>
      <FormHelperText>Optional</FormHelperText>
    </FormControl>
  </VStack>
);

interface CreateWorkspaceDialogProps extends Omit<ModalProps, 'children'> {}

const CreateWorkspaceDialog = (props: CreateWorkspaceDialogProps) => {
  const {
    form,
    tabs,
    request,
    handleClose,
    handleGoToWorkspace,
    handleConfigureMembers,
  } = useCreateWorkspace({
    onClose: props.onClose,
  });

  return (
    <Dialog.Modal
      size={{
        base: 'full',
        sm: !tabs.is(CreateWorkspaceTabState.FORM) ? '2xl' : 'lg',
      }}
      closeOnOverlayClick={false}
      {...props}
    >
      {tabs.is(CreateWorkspaceTabState.FORM) && (
        <Dialog.Header
          mb={0}
          position="relative"
          maxW={450}
          top={-6}
          title="Create Workspace"
          description="Define the details of your workspace. Set up this rules carefully because it cannot be changed later."
          descriptionFontSize="md"
        />
      )}

      <Dialog.Body minH="full" maxH="full" maxW={540}>
        <Box hidden={!tabs.is(CreateWorkspaceTabState.FORM)} mb={8}>
          <StepProgress length={tabs.length} value={tabs.tab} />
        </Box>
        <Tabs index={tabs.tab}>
          <TabPanels>
            <TabPanel p={0}>
              <OnboardingStep
                tabs={tabs}
                onCancel={handleClose}
                onConfirm={() => tabs.set(CreateWorkspaceTabState.FORM)}
              />
            </TabPanel>

            <TabPanel p={0}>
              <CreateWorkspaceForm form={form} />
            </TabPanel>
            <TabPanel p={0}>
              <FeedbackSuccess
                title="All set!!"
                description="The workspace template is now ready for use whenever you need to streamline
        your workflow!"
                primaryAction="Go to my workspace"
                secondaryAction="Members Settings"
                onPrimaryAction={handleGoToWorkspace}
                onSecondaryAction={handleConfigureMembers}
                showAction
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Dialog.Body>

      {tabs.is(CreateWorkspaceTabState.FORM) && (
        <Dialog.Actions
          hidden={!tabs.is(CreateWorkspaceTabState.FORM)}
          maxW={500}
        >
          <Dialog.SecondaryAction
            _hover={{
              borderColor: 'brand.500',
              color: 'brand.500',
            }}
            bg="transparent"
            border="1px solid white"
            w="25%"
            onClick={handleClose}
          >
            Cancel
          </Dialog.SecondaryAction>
          <Dialog.PrimaryAction
            w="70%"
            onClick={form.handleCreateWorkspace}
            fontSize="md"
            leftIcon={<SquarePlusIcon w={4} h={4} />}
            isDisabled={request.isLoading}
            isLoading={request.isLoading}
            _hover={{
              opacity: 0.8,
            }}
          >
            Create Workspace
          </Dialog.PrimaryAction>
        </Dialog.Actions>
      )}
    </Dialog.Modal>
  );
};

export { CreateWorkspaceDialog };
