import { HStack, TabPanels, Tabs } from '@chakra-ui/react';
import { Dialog } from '@bako-safe/ui/components';

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
      isOpen={control.isOpen}
      onClose={control.onClose}
      closeOnOverlayClick={false}
      size={{
        base: 'full',
        sm: 'lg',
      }}
    >
      <Dialog.Header
        title={steps.step.title}
        onClose={control.onClose}
        description={steps.step.description}
        hidden={steps.step.hideHeader}
        mb={0}
        mt={{ base: 4, xs: 0 }}
        maxW={440}
      />

      <Dialog.Body w="full" maxW={440} flex={1} display="flex">
        <Tabs index={tabs.tab} flex={1}>
          <TabPanels h="full">
            <APITokensList tabs={tabs} request={list.request} />
            <CreateAPITokenForm form={create.form} />
            <CreateAPITokenSuccess
              step={steps.step}
              createdAPIKey={create.createdAPIKey.value}
            />
          </TabPanels>
        </Tabs>
      </Dialog.Body>

      <Dialog.Actions
        w="full"
        maxW={440}
        dividerBorderColor="grey.425"
        position="relative"
      >
        <HStack w="full" justifyContent="space-between" spacing={6}>
          <Dialog.SecondaryAction
            flex={1}
            bgColor="transparent"
            border="1px solid white"
            onClick={steps.step.secondaryAction.handler}
            _hover={{
              borderColor: 'brand.500',
              color: 'brand.500',
            }}
          >
            {steps.step.secondaryAction.label}
          </Dialog.SecondaryAction>
          <Dialog.PrimaryAction
            flex={3}
            hidden={steps.step.primaryAction.hide}
            onClick={steps.step.primaryAction.handler}
            isDisabled={steps.step.primaryAction.disabled}
            _hover={{
              opacity: !steps.step.primaryAction.disabled && 0.8,
            }}
            isLoading={steps.step.primaryAction.isLoading}
          >
            {steps.step.primaryAction.label}
          </Dialog.PrimaryAction>
        </HStack>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};

export { CreateAPITokenDialog };
