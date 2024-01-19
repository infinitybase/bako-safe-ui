import { Box, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import React from 'react';

import { Dialog, SquarePlusIcon, StepProgress } from '@/components';
import { useChangeMember } from '@/modules/workspace/hooks/members';

/* TODO: Move to components folder */
const MemberAddressForm = () => {
  return <>Address here</>;
};

/* TODO: Move to components folder */
const MemberPermissionForm = () => {
  return <>Permission here</>;
};

const CreateMemberPage = () => {
  const { form, request, handleClose, tabs } = useChangeMember();

  const TabsPanels = (
    <TabPanels>
      <TabPanel>
        <MemberAddressForm />
      </TabPanel>
      <TabPanel>
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
          onClick={form.handleAddMember}
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

export { CreateMemberPage };
