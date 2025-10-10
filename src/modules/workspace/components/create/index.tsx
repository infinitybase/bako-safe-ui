import { Box, Field, Input, Tabs, Textarea, VStack } from '@chakra-ui/react';
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
import { OnboardingStep } from '../form';

const CreateWorkspaceForm = ({
  form,
}: {
  form: UseCreateWorkspace['form'];
}) => (
  <VStack gap={2}>
    <Controller
      control={form.control}
      name="name"
      render={({ field, fieldState }) => (
        <Field.Root invalid={fieldState.invalid}>
          <Input
            minHeight={14}
            value={field.value}
            onChange={field.onChange}
            placeholder=" "
            variant="dark"
          />
          <FormLabel py={1}>Name your workspace</FormLabel>
          <Field.HelperText color="error.500">
            {fieldState.error?.message}
          </Field.HelperText>
        </Field.Root>
      )}
    />
    <Field.Root>
      <Textarea
        size="lg"
        {...form.register('description')}
        placeholder="Description"
        bg={`grey.825`}
        borderColor={`grey.800`}
        sx={{
          'textarea::placeholder': {
            color: 'grey.500',
          },
        }}
      />
      <Field.HelperText>Optional</Field.HelperText>
    </Field.Root>
  </VStack>
);

interface CreateWorkspaceDialogProps extends Omit<any, 'children'> {
  handleCancel: () => void;
}

const CreateWorkspaceDialog = (props: CreateWorkspaceDialogProps) => {
  const {
    form,
    tabs,
    request,
    onCancel,
    handleGoToWorkspace,
    handleConfigureMembers,
  } = useCreateWorkspace({
    onClose: props.onClose,
    handleCancel: props.handleCancel,
  });

  return (
    <Dialog.Modal
      size={{
        base: 'full',
        sm: !tabs.is(CreateWorkspaceTabState.FORM) ? 'xl' : 'lg',
      }}
      closeOnOverlayClick={false}
      {...props}
    >
      {tabs.is(CreateWorkspaceTabState.FORM) ? (
        <Dialog.Header
          mb={0}
          onClose={props.onClose}
          maxW={{ base: 450, xs: 550, sm: 450 }}
          title="Create Workspace"
          description="Define the details of your workspace. Set up this rules carefully because it cannot be changed later."
          descriptionFontSize="md"
        />
      ) : (
        <Dialog.Header
          mb={0}
          mt={0}
          onClose={props.onClose}
          maxW={450}
          title=""
          description=""
          zIndex={200}
          h={6}
        />
      )}

      <Dialog.Body
        maxW={540}
        mt={!tabs.is(CreateWorkspaceTabState.FORM) ? 0 : 'unset'}
      >
        <Box
          mb={8}
          mt={{
            base: 'unset',
            sm: tabs.is(CreateWorkspaceTabState.FORM) ? 6 : 'unset',
          }}
          hidden={!tabs.is(CreateWorkspaceTabState.FORM)}
        >
          <StepProgress length={tabs.length} value={tabs.tab} />
        </Box>
        <Tabs.Root value={String(tabs.tab)}>
          <Box>
            <Box p={0}>
              <OnboardingStep
                tabs={tabs}
                onCancel={props.handleCancel}
                onConfirm={() => tabs.set(CreateWorkspaceTabState.FORM)}
              />
            </Box>

            <Box p={0}>
              <CreateWorkspaceForm form={form} />
            </Box>
            <Box p={0}>
              <FeedbackSuccess
                hasCloseButton
                title="All set!"
                description="The workspace is now ready for use whenever you need to streamline
        your workflow!"
                primaryAction="Go to my workspace"
                secondaryAction="Members Settings"
                onPrimaryAction={handleGoToWorkspace}
                onSecondaryAction={handleConfigureMembers}
                showAction
              />
            </Box>
          </Box>
        </Tabs.Root>
      </Dialog.Body>

      <Dialog.Actions
        mt="auto"
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
          onClick={onCancel}
        >
          Cancel
        </Dialog.SecondaryAction>
        <Dialog.PrimaryAction
          w="70%"
          onClick={form.handleCreateWorkspace}
          fontSize="md"
          leftIcon={<SquarePlusIcon w={4} h={4} />}
          isDisabled={request.isPending}
          isLoading={request.isPending}
          _hover={{
            opacity: 0.8,
          }}
        >
          Create Workspace
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};

export { CreateWorkspaceDialog };
