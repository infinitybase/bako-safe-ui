import { CloseButton, Flex, Heading, Stack, Tabs, Text, VStack, Box } from 'bako-ui';

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
        w: { base: '100vw', md: '480px' },
        maxW: { base: '100vw', md: '480px' },
        h: { base: '100dvh', md: 'auto' },
        p: 0,
      }}
      size={{
        base: 'full',
        md: 'md',
      }}
    >
      <Stack
        w="100%"
        px={6}
        pt={6}
        pb={4}
      >
        <Flex w="100%" align="center" justify="space-between">
          <Heading fontSize="sm" color="textPrimary" lineHeight="short">
            {steps.step.title}
          </Heading>
          <CloseButton size="2xs" onClick={control.onClose} />
        </Flex>
        <Text fontSize="xs" color="textSecondary">
          {steps.step.description}
        </Text>
        {!steps.step.title && !steps.step.description && (
          <Box h="32px" />
        )}
      </Stack>
      <Dialog.Body
        w="100%"
        h={{ base: 'calc(100dvh - 96px)', md: '540px' }}
        overflow="hidden"
        p={0}
      >
        <Tabs.Root
          value={String(tabs.tab)}
          w="100%"
          h="100%"
          display="flex"
          flexDirection="column"
        >
          <Tabs.Content
            value="0"
            w="100%"
            h="100%"
            display="flex"
            flexDirection="column"
          >
            <APITokensList tabs={tabs} request={list.request} />
          </Tabs.Content>
          <Tabs.Content
            value="1"
            w="100%"
            h="100%"
            display="flex"
            flexDirection="column">
            <CreateAPITokenForm form={create.form} steps={steps} />
          </Tabs.Content>
          <Tabs.Content
            value="2"
            w="100%"
            h="100%"
            display="flex"
            flexDirection="column"
          >
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
