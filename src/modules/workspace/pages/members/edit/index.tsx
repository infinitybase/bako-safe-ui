import {
  Avatar,
  Badge,
  Card,
  Center,
  Flex,
  HStack,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { Dialog, FeedbackSuccess, SquarePlusIcon } from '@/components';
import {
  AddressUtils,
  EditMembersForm,
  useGetWorkspaceRequest,
} from '@/modules';
import { useChangeMember } from '@/modules/workspace/hooks';
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
            <Text fontWeight="semibold" color="grey.200">
              {member?.name}
            </Text>
            <Text
              fontWeight={!member?.name ? 'semibold' : 'normal'}
              color={!member?.name ? 'grey.200' : 'grey.500'}
            >
              {AddressUtils.format(member?.address ?? '')}
            </Text>
            <Badge fontSize="xs" p={1} variant={permission?.variant}>
              {permission?.title}
            </Badge>
          </Flex>
        </Center>
      </HStack>
    </Card>
  );
};

export const EditMemberPage = () => {
  const { form, handleClose, tabs } = useChangeMember();
  const { formState, editForm } = form;

  return (
    <Dialog.Modal isOpen onClose={handleClose} closeOnOverlayClick={false}>
      <Dialog.Header
        maxW={420}
        title="Edit Member"
        description="Manage roles, remove or adjust permissions as needed."
      />

      <Dialog.Body mb={9} maxW={420}>
        <Tabs>
          <MemberTab />
        </Tabs>
        <Tabs index={tabs.tab} isLazy colorScheme="green">
          <EditMembersForm form={editForm} />
        </Tabs>
        <Tabs>
          <FeedbackSuccess
            title="Member edited successfully!"
            description="To view all the members in your workspace, click on members in workspace home page."
          />
        </Tabs>
      </Dialog.Body>

      <Dialog.Actions maxW={420}>
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
