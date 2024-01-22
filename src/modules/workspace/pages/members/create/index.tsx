import { Box, Heading, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import React from 'react';
import { Controller } from 'react-hook-form';

import { Dialog, SquarePlusIcon, StepProgress } from '@/components';
import { AutoComplete } from '@/components/autocomplete';
import {
  UseChangeMember,
  useChangeMember,
} from '@/modules/workspace/hooks/members';

interface MemberAddressForm {
  form: UseChangeMember['form'];
}

const MemberAddressForm = ({ form }: MemberAddressForm) => {
  return (
    <Box w="full">
      <Dialog.Section
        title={
          <Heading fontSize="md" color="grey.200">
            Member address
          </Heading>
        }
        description="Who it will be a new member in your workspace?"
        mb={8}
      />
      <Controller
        name="address"
        control={form.control}
        render={({ field, fieldState }) => (
          <AutoComplete
            label="Name or address"
            value={field.value}
            onInputChange={field.onChange}
            onChange={field.onChange}
            errorMessage={fieldState.error?.message}
            options={[]}
            isLoading={false}
            isInvalid={false}
            isDisabled={false}
          />
        )}
      />
    </Box>
  );
};

/* TODO: Move to components folder */
const MemberPermissionForm = () => {
  return <>Permission here</>;
};

const CreateMemberPage = () => {
  const { form, request, handleClose, tabs } = useChangeMember();
  const { formState } = form;

  const TabsPanels = (
    <TabPanels>
      <TabPanel p={0}>
        <MemberAddressForm form={form} />
      </TabPanel>
      <TabPanel p={0}>
        <MemberPermissionForm />
      </TabPanel>
    </TabPanels>
  );

  return (
    <Dialog.Modal isOpen onClose={handleClose} closeOnOverlayClick={false}>
      <Dialog.Header
        maxW={420}
        title="Add Member"
        description="Define the details of your vault. Set up this rules carefully because it cannot be changed later."
      />

      <Dialog.Body maxW={420}>
        <Box mb={12}>
          <StepProgress length={tabs.length} value={tabs.tab} />
        </Box>
        <Tabs index={tabs.tab} colorScheme="green">
          {TabsPanels}
        </Tabs>
      </Dialog.Body>

      <Dialog.Actions maxW={420}>
        <Dialog.SecondaryAction onClick={handleClose}>
          Cancel
        </Dialog.SecondaryAction>
        <Dialog.PrimaryAction
          onClick={formState?.handleSubmit}
          leftIcon={<SquarePlusIcon />}
          isDisabled={!formState?.isValid}
          isLoading={request.isLoading}
        >
          Continue
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};

export { CreateMemberPage };
