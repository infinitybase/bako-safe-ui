import {
  Avatar,
  Badge,
  Box,
  Card,
  Center,
  Flex,
  HStack,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import {
  Dialog,
  FeedbackDelete,
  FeedbackSuccess,
  FeedbackUpdate,
  SquarePlusIcon,
  StepProgress,
} from '@/components';
import { TrashIcon } from '@/components/icons/trash';
import { CreateContactDialog } from '@/modules/addressBook';
import { AddressUtils } from '@/modules/core';
import { MemberAddressForm } from '@/modules/workspace/components';
import { MemberPermissionForm } from '@/modules/workspace/components/form/MemberPermissionsForm';
import { useGetWorkspaceRequest } from '@/modules/workspace/hooks';
import {
  MemberTabState,
  useChangeMember,
} from '@/modules/workspace/hooks/members';
import { WorkspacePermissionUtils } from '@/modules/workspace/utils';

const MemberTab = () => {
  const { workspaceId, memberId } = useParams();

  const request = useGetWorkspaceRequest(workspaceId ?? '');
  const workspace = request.workspace;
  const member = request.workspace?.members.find(
    (member) => member.id === memberId,
  );

  const permission = WorkspacePermissionUtils.getPermissionInWorkspace(
    workspace!,
    member!,
  );

  return (
    <Card
      w="full"
      bgColor="dark.300"
      p={4}
      mb={5}
      border="1px"
      borderColor="dark.100"
      key={member?.id}
    >
      <HStack w="full" justifyContent="space-between">
        <Center gap={4}>
          <Avatar
            size="md"
            fontSize="md"
            color="white"
            bg="grey.900"
            variant="roundedSquare"
            name={member?.name ?? member?.address}
          />
          <Flex
            mr={1}
            h="14"
            direction="column"
            alignItems="start"
            justifyContent="space-between"
          >
            {member?.name ? (
              <Text fontWeight="semibold" color="grey.200">
                {member?.name}
              </Text>
            ) : (
              <Text
                fontWeight={!member?.name ? 'semibold' : 'normal'}
                color={!member?.name ? 'grey.200' : 'grey.500'}
              >
                {AddressUtils.format(member?.address ?? '')}
              </Text>
            )}
            <Badge fontSize="xs" p={1} variant={permission?.variant}>
              {permission?.title}
            </Badge>
          </Flex>
        </Center>
      </HStack>
    </Card>
  );
};

const CreateMemberPage = () => {
  const { form, handleClose, tabs, addressBook, dialog } = useChangeMember();
  const { formState, memberForm, permissionForm } = form;

  const TabsPanels = (
    <TabPanels>
      {/* <TabPanel p={0}>
        <MemberAddressForm form={memberForm} addressBook={addressBook} />
      </TabPanel> */}
      <TabPanel p={0}>
        <MemberPermissionForm form={permissionForm} formState={formState} />
      </TabPanel>
      <TabPanel p={0}>
        {tabs.is(MemberTabState.SUCCESS) && (
          <FeedbackSuccess
            showAction
            title={formState.title}
            description="To view all the members added to your workspace, click on settings on the workspace home page."
            primaryAction={formState.primaryAction}
            secondaryAction={formState.secondaryAction}
            onPrimaryAction={formState.handlePrimaryAction}
            onSecondaryAction={formState.handleSecondaryAction}
          />
        )}
      </TabPanel>
      <TabPanel p={0}>
        {tabs.is(MemberTabState.UPDATE) && (
          <FeedbackUpdate
            title={formState.title}
            showAction
            primaryAction={formState.primaryAction}
            secondaryAction={formState.secondaryAction}
            onPrimaryAction={formState.handlePrimaryAction}
            onSecondaryAction={formState.handleSecondaryAction}
            newPermission={
              WorkspacePermissionUtils.permissions[
                formState.newPermission ?? ''
              ].title
            }
            oldPermission={
              WorkspacePermissionUtils.permissions[
                formState.oldPermission ?? ''
              ].title
            }
          />
        )}
      </TabPanel>
      <TabPanel p={0}>
        {tabs.is(MemberTabState.DELETE) && (
          <FeedbackDelete
            title={formState.title}
            showAction
            primaryAction={formState.primaryAction}
            secondaryAction={formState.secondaryAction}
            onPrimaryAction={formState.handlePrimaryAction}
            onSecondaryAction={formState.handleSecondaryAction}
            description={formState.description}
          />
        )}
      </TabPanel>
    </TabPanels>
  );

  return (
    <Dialog.Modal
      isOpen
      onClose={handleClose}
      closeOnOverlayClick={false}
      autoFocus={false}
    >
      <CreateContactDialog
        form={addressBook.form}
        dialog={addressBook.contactDialog}
        isLoading={addressBook.createContactRequest.isLoading}
        isEdit={false}
      />

      <Dialog.Header
        maxW={500}
        title={dialog.title}
        description={dialog.description}
        hidden={!tabs.is(MemberTabState.FORM)}
      />

      {formState.isEditMember && (
        <Tabs
          maxW={500}
          w="full"
          pr={12}
          hidden={!tabs.is(MemberTabState.FORM)}
        >
          <MemberTab />
        </Tabs>
      )}

      {!formState.isEditMember && tabs.is(MemberTabState.FORM) && (
        <>
          <Box maxW={500} w={500} mb={10} pr={12}>
            <StepProgress length={tabs.length - 2} value={tabs.tab} />
          </Box>
          <MemberAddressForm form={memberForm} addressBook={addressBook} />
        </>
      )}

      <Dialog.Body
        mb={7}
        maxW={500}
        pr={12}
        maxH={520}
        overflowY="scroll"
        css={{
          '&::-webkit-scrollbar': {
            width: '5px',
            height: '5px' /* Adjust the height of the scrollbar */,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#2C2C2C',
            borderRadius: '20px',
            height: '20px' /* Adjust the height of the scrollbar thumb */,
          },
        }}
      >
        <Tabs index={tabs.tab} isLazy colorScheme="green">
          {TabsPanels}
        </Tabs>
      </Dialog.Body>

      {tabs.is(MemberTabState.FORM) && (
        <>
          <Dialog.Actions maxW={500} pr={12}>
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
          {formState.tertiaryAction && (
            <Dialog.Actions maxW={500} pr={12}>
              <Dialog.TertiaryAction
                display="block"
                onClick={formState.handleTertiaryAction}
                leftIcon={<TrashIcon />}
                isDisabled={!formState?.tertiaryAction}
                isLoading={formState?.isLoading}
              >
                {formState.tertiaryAction}
              </Dialog.TertiaryAction>
            </Dialog.Actions>
          )}
        </>
      )}
    </Dialog.Modal>
  );
};

export { CreateMemberPage };
