import { Box, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

import {
  Dialog,
  FeedbackSuccess,
  SquarePlusIcon,
  StepProgress,
} from '@/components';
import { CreateContactDialog } from '@/modules/addressBook';
import { MemberAddressForm } from '@/modules/workspace/components';
import { MemberPermissionForm } from '@/modules/workspace/components/form/MemberPermissionsForm';
import {
  MemberTabState,
  useChangeMember,
} from '@/modules/workspace/hooks/members';

const CreateMemberPage = () => {
  const { form, handleClose, tabs, addressBook, dialog } = useChangeMember();
  const { formState, memberForm, permissionForm } = form;

  const TabsPanels = (
    <TabPanels>
      <TabPanel p={0}>
        <MemberAddressForm form={memberForm} addressBook={addressBook} />
      </TabPanel>
      <TabPanel p={0}>
        <MemberPermissionForm form={permissionForm} />
      </TabPanel>
      <TabPanel p={0}>
        <FeedbackSuccess
          title="New member added!"
          description="To view all the members added to your workspace, click on settings on the workspace home page."
        />
      </TabPanel>
    </TabPanels>
  );

  return (
    <Dialog.Modal isOpen onClose={handleClose} closeOnOverlayClick={false}>
      <CreateContactDialog
        form={addressBook.form}
        dialog={addressBook.contactDialog}
        isLoading={addressBook.createContactRequest.isLoading}
        isEdit={false}
      />
      <Dialog.Header
        maxW={420}
        title={dialog.title}
        description="Define the details of your vault. Set up this rules carefully because it cannot be changed later."
        hidden={tabs.is(MemberTabState.SUCCESS)}
      />

      <Dialog.Body mb={9} maxW={420}>
        <Box hidden={tabs.is(MemberTabState.SUCCESS)} mb={12}>
          <StepProgress length={tabs.length} value={tabs.tab} />
        </Box>
        <Tabs index={tabs.tab} isLazy colorScheme="green">
          {TabsPanels}
        </Tabs>
      </Dialog.Body>

      <Dialog.Actions
        maxW={420}
        hideDivider={tabs.is(MemberTabState.PERMISSION)}
      >
        <Dialog.SecondaryAction onClick={formState?.handleSecondaryAction}>
          {formState?.secondaryAction}
        </Dialog.SecondaryAction>
        <Dialog.PrimaryAction
          onClick={formState?.handlePrimaryAction}
          leftIcon={<SquarePlusIcon />}
          isDisabled={!formState?.isValid}
          isLoading={formState?.isLoading}
        >
          {formState.primaryAction}
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};

export { CreateMemberPage };
