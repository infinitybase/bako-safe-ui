import {
  Avatar,
  Badge,
  Box,
  Card,
  Center,
  Flex,
  HStack,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { FiPlusSquare as PlusSquareIcon } from 'react-icons/fi';
import { useParams } from 'react-router-dom';

import {
  Dialog,
  FeedbackDelete,
  FeedbackSuccess,
  FeedbackUpdate,
  RemoveIcon,
  StepProgress,
} from '@/components';
import { RefreshIcon } from '@/components/icons/refresh-icon';
import { UserPlusIcon } from '@/components/icons/user-add-icon';
import { CreateContactDialog } from '@/modules/addressBook';
import { AddressUtils } from '@/modules/core';
import { MemberAddressForm } from '@/modules/workspace/components';
import { MemberPermissionForm } from '@/modules/workspace/components/form/MemberPermissionsForm';
import {
  MemberTabState,
  useChangeMember,
} from '@/modules/workspace/hooks/members';
import { WorkspacePermissionUtils } from '@/modules/workspace/utils';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const MemberTab = () => {
  const { memberId } = useParams();
  const {
    addressBookInfos: {
      handlers: { contactByAddress },
    },
    workspaceInfos: {
      currentWorkspaceRequest: { currentWorkspace },
    },
  } = useWorkspaceContext();

  const member = currentWorkspace?.members.find(
    (member) => member.id === memberId,
  );

  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const contactNickname = contactByAddress(member?.address!)?.nickname;

  const permission = WorkspacePermissionUtils.getPermissionInWorkspace(
    currentWorkspace!,
    member!,
  );

  return (
    <Card.Root
      w="full"
      bgColor="grey.850"
      p={4}
      mb={5}
      border="1px"
      borderRadius="xl"
      borderColor="grey.400"
      key={member?.id}
    >
      <HStack w="full" justifyContent="space-between">
        <Center w="full" gap={4}>
          <Avatar.Root
            size="md"
            fontSize="md"
            color="white"
            bg="grey.900"
            shape="rounded"
          >
            <Avatar.Fallback name={contactNickname ?? member?.address} />
            <Avatar.Image src={member?.avatar} />
          </Avatar.Root>
          <Flex
            w="full"
            mr={1}
            h="14"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Flex flexDir="column">
              {contactNickname && (
                <Text fontWeight="semibold" color="grey.200">
                  {contactNickname}
                </Text>
              )}
              <Text
                fontWeight={!contactNickname ? 'semibold' : 'normal'}
                color={!contactNickname ? 'grey.200' : 'grey.500'}
              >
                {AddressUtils.format(member?.address ?? '')}
              </Text>
            </Flex>
            <Badge
              fontSize="xs"
              rounded="xl"
              p={1}
              px={3}
              colorPalette={permission?.variant}
            >
              {permission?.title}
            </Badge>
          </Flex>
        </Center>
      </HStack>
    </Card.Root>
  );
};

const CreateMemberPage = () => {
  const { form, handleClose, tabs, addressBook, dialog, isEditMember } =
    useChangeMember();
  const { formState, memberForm, permissionForm } = form;
  const {
    screenSizes: { isExtraSmallDevice },
  } = useWorkspaceContext();

  const TabsPanels = (
    <Box>
      <Box p={0}>
        <MemberPermissionForm form={permissionForm} formState={formState} />
      </Box>
      <Box p={0}>
        {tabs.is(MemberTabState.SUCCESS) && (
          <FeedbackSuccess
            showAction
            title={formState.title}
            description="To view all the members added to your workspace, click on members on the workspace home page"
            primaryAction={formState.primaryAction}
            secondaryAction={formState.secondaryAction}
            onPrimaryAction={formState.handlePrimaryAction}
            onSecondaryAction={formState.handleSecondaryAction}
            membersFormIcon={UserPlusIcon}
          />
        )}
      </Box>
      <Box p={0}>
        {tabs.is(MemberTabState.UPDATE) && (
          <FeedbackUpdate
            title={formState.title}
            showAction
            primaryAction={formState.primaryAction}
            secondaryAction={formState.secondaryAction}
            onPrimaryAction={formState.handlePrimaryAction}
            onSecondaryAction={formState.handleSecondaryAction}
            newPermission={
              // @ts-expect-error - TODO RESOLVE THIS
              WorkspacePermissionUtils.permissions[
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formState.newPermission ?? ''
              ].title
            }
            oldPermission={
              // @ts-expect-error - TODO RESOLVE THIS
              WorkspacePermissionUtils.permissions[
                formState.oldPermission ?? ''
              ].title
            }
          />
        )}
      </Box>
      <Box p={0}>
        {tabs.is(MemberTabState.DELETE) && (
          <FeedbackDelete
            title={formState.title}
            showAction
            primaryAction={formState.primaryAction}
            secondaryAction={formState.secondaryAction}
            onPrimaryAction={formState.handlePrimaryAction}
            onSecondaryAction={formState.handleSecondaryAction}
          />
        )}
      </Box>
    </Box>
  );

  return (
    <Dialog.Modal
      open
      onOpenChange={handleClose}
      size={{
        base: 'full',
        sm: 'xl',
      }}
      closeOnInteractOutside={false}
    >
      <CreateContactDialog
        form={addressBook.form}
        dialog={addressBook.dialog.contactDialog}
        isLoading={addressBook.requests.createContactRequest.isPending}
        isEdit={false}
      />
      <Dialog.Header
        maxW={480}
        title={dialog.title}
        mb={0}
        mt={0}
        onClose={handleClose}
        description={dialog.description}
        descriptionFontSize="md"
        descriptionColor="grey.200"
        hidden={!tabs.is(MemberTabState.FORM)}
      />
      {formState.isEditMember && (
        <Tabs.Root
          value="0"
          maxW={480}
          w="full"
          hidden={!tabs.is(MemberTabState.FORM)}
        >
          <MemberTab />
        </Tabs.Root>
      )}
      {!formState.isEditMember && tabs.is(MemberTabState.FORM) && (
        <>
          <Box maxW={480} w="full" mt={{ base: 2, sm: 6 }} mb={8}>
            <StepProgress length={tabs.length - 2} value={tabs.tab} />
          </Box>
          <MemberAddressForm form={memberForm} addressBook={addressBook} />
        </>
      )}
      <Dialog.Body mb={{ base: formState.isEditMember ? 6 : 2, sm: 1 }}>
        <Tabs.Root
          value={String(tabs.tab)}
          maxH="full"
          lazyMount
          minH={{ base: 440, sm: 'full' }}
        >
          {TabsPanels}
        </Tabs.Root>
      </Dialog.Body>
      {tabs.is(MemberTabState.FORM) && (
        <>
          <Dialog.Actions
            css={{
              '&>hr': {
                marginTop:
                  isExtraSmallDevice && formState.isEditMember ? '0' : 4,
              },
            }}
            maxW={480}
            mt={{ base: isExtraSmallDevice ? -6 : 'auto', sm: 'unset' }}
            p={0}
          >
            {!isEditMember ? (
              <Dialog.SecondaryAction
                w="25%"
                onClick={formState?.handleSecondaryAction}
              >
                {formState?.secondaryAction}
              </Dialog.SecondaryAction>
            ) : (
              <Dialog.TertiaryAction
                onClick={formState.handleTertiaryAction}
                disabled={!formState?.tertiaryAction}
                loading={formState?.isLoading}
                w="50%"
                _hover={{
                  opacity: 0.8,
                }}
              >
                <RemoveIcon color="error.500" />
                {formState.tertiaryAction}
              </Dialog.TertiaryAction>
            )}
            <Dialog.PrimaryAction
              w={isEditMember ? '50%' : '75%'}
              _hover={{
                opacity: 0.8,
              }}
              onClick={formState?.handlePrimaryAction}
              disabled={!formState?.isValid}
              loading={formState?.isLoading}
            >
              {!isEditMember ? <PlusSquareIcon /> : <RefreshIcon />}
              {formState.primaryAction}
            </Dialog.PrimaryAction>
          </Dialog.Actions>
        </>
      )}
    </Dialog.Modal>
  );
};

export { CreateMemberPage };
