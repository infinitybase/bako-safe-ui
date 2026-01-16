import { CloseButton, Flex, Heading, Stack, Tabs, Text, VStack } from 'bako-ui';

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
      modalContentProps={{
        sm: {
          minH: '590px',
          maxH: '90vh',
          overflowY: 'auto',
        },
        maxW: '480px',
        p: '0 !important',
      }}
      size={{
        base: 'full',
        md: 'md',
      }}
    >
      <Stack w="100%" maxW="480px" pt={6} px={6}>
        <Flex w="100%" align="center" justify="space-between">
          <Heading fontSize="sm" color="textPrimary" lineHeight="short">
            {steps.step.title}
          </Heading>
          <CloseButton size="2xs" onClick={control.onClose} />
        </Flex>
        <Text fontSize="xs" color="textSecondary">
          {steps.step.description}
        </Text>
      </Stack>
      <Dialog.Body w="full" h="full" maxW="480px" flex={1} display="flex">
        <Tabs.Root value={String(tabs.tab)} flex={1} display="flex">
          <Tabs.Content value="0">
            <APITokensList tabs={tabs} request={list.request} />
          </Tabs.Content>
          <Tabs.Content value="1">
            <CreateAPITokenForm form={create.form} steps={steps} />
          </Tabs.Content>
          <Tabs.Content value="2">
            <CreateAPITokenSuccess
              step={steps.step}
              steps={steps}
              createdAPIKey={create.createdAPIKey.value}
              name={create.createdAPIKeyName?.value}
              transactionTitle={create.createdAPIKeyTransactionTitle?.value}
            />
          </Tabs.Content>
        </Tabs.Root>
      </Dialog.Body>
    </Dialog.Modal>
  );
};

export { CreateAPITokenDialog };
