import { HStack, Tabs } from 'bako-ui';

import { Dialog } from '@/components';
import { UseAPITokenReturn } from '@/modules/cli/hooks';

import { APITokensList } from '../list';
import { CreateAPITokenForm } from './form';
import { CreateAPITokenSuccess } from './success';

interface CreateAPITokenDialogProps {
  control: UseAPITokenReturn['dialog'];
  steps: UseAPITokenReturn['steps'];
  tabs: UseAPITokenReturn['tabs'];
  create: UseAPITokenReturn['create'];
  list: UseAPITokenReturn['list'];
}

const CreateAPITokenDialog = (props: CreateAPITokenDialogProps) => {
  const { control, steps, tabs, create, list } = props;

  return (
    <Dialog.Modal
      open={control.isOpen}
      onOpenChange={control.onOpenChange}
      closeOnInteractOutside={false}
      trapFocus={false}
      size={{
        base: 'full',
        md: 'md',
      }}
    >
      <Dialog.Header
        title={steps.step.title}
        onClose={control.onClose}
        description={steps.step.description}
        hidden={steps.step.hideHeader}
        mb={0}
        mt={{ base: 4, sm: 0 }}
        maxW={440}
      />

      <Dialog.Body w="full" maxW={440} flex={1} display="flex">
        <Tabs.Root value={String(tabs.tab)} flex={1}>
          <Tabs.Content value="0">
            <APITokensList tabs={tabs} request={list.request} />
          </Tabs.Content>
          <Tabs.Content value="1">
            <CreateAPITokenForm form={create.form} />
          </Tabs.Content>
          <Tabs.Content value="2">
            <CreateAPITokenSuccess
              step={steps.step}
              createdAPIKey={create.createdAPIKey.value}
            />
          </Tabs.Content>
        </Tabs.Root>
      </Dialog.Body>

      <Dialog.Actions
        w="full"
        maxW={440}
        dividerBorderColor="grey.425"
        position="relative"
        hideDivider
        mt={4}
      >
        <HStack w="full" justifyContent="space-between" gap={6}>
          <Dialog.SecondaryAction
            flex={1}
            variant="subtle"
            onClick={steps.step.secondaryAction.handler}
            aria-label={'Secundary action create api token'}
          >
            {steps.step.secondaryAction.label}
          </Dialog.SecondaryAction>
          <Dialog.PrimaryAction
            flex={3}
            hidden={steps.step.primaryAction.hide}
            onClick={steps.step.primaryAction.handler}
            disabled={steps.step.primaryAction.disabled}
            _hover={{
              opacity: !steps.step.primaryAction.disabled ? 0.8 : 1,
            }}
            loading={steps.step.primaryAction.isLoading}
            aria-label={'Primary action create api token'}
          >
            {steps.step.primaryAction.label}
          </Dialog.PrimaryAction>
        </HStack>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};

export { CreateAPITokenDialog };
