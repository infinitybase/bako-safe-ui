import { Card, EditIcon } from '@bako-safe/ui/components';
import { Avatar, Badge, Box, HStack, Text } from '@chakra-ui/react';

import {
  AddressUtils,
  Member,
  PermissionRoles,
  Workspace,
} from '@/modules/core';
import { WorkspacePermissionUtils } from '@/modules/workspace/utils';

import { useWorkspaceContext } from '../../WorkspaceProvider';

interface MemberCardProps {
  member: Member;
  workspace: Workspace;
  onEdit: (memberId: string) => void;
}

const MemberCard = ({ member, workspace, onEdit }: MemberCardProps) => {
  const {
    authDetails: {
      userInfos: {
        workspace: { permission: loggedPermissions, avatar },
      },
    },
    addressBookInfos: {
      handlers: { contactByAddress },
    },
  } = useWorkspaceContext();

  const permission = WorkspacePermissionUtils.getPermissionInWorkspace(
    workspace!,
    member,
  );

  //TODO: Use this validation to delete button
  const isEditable =
    WorkspacePermissionUtils.hasPermissions(loggedPermissions!, [
      PermissionRoles.ADMIN,
      PermissionRoles.OWNER,
    ]) && permission?.title?.toUpperCase() !== PermissionRoles.OWNER;

  const contactNickname = contactByAddress(member?.address!)?.nickname;

  return (
    <Card
      alignSelf={{ base: 'start', xs: 'unset' }}
      h={{ base: 24, xs: 20 }}
      w="full"
      maxW="full"
      bg="gradients.transaction-card"
      borderColor="gradients.transaction-border"
      borderWidth="1.5px"
      key={member.id}
      _hover={{
        cursor: 'pointer',
        borderColor: 'brand.600',
      }}
      px={{ base: 3, xs: 6 }}
      py={2}
    >
      <Box
        display="flex"
        w="full"
        h="full"
        justifyContent="space-between"
        alignItems={{ base: 'start', xs: 'center' }}
        flexDir={{ base: 'column', xs: 'row' }}
      >
        <Box display="flex" alignItems="center" justifyContent="center" gap={3}>
          <Avatar
            boxSize="40px"
            fontSize="md"
            color="white"
            bg="grey.900"
            variant="roundedSquare"
            name={
              contactByAddress(member?.address!)?.nickname ?? member?.address
            }
            src={avatar}
          />
          <Box mr={1}>
            <Text fontWeight="semibold" color="grey.200">
              {contactNickname ?? ''}
            </Text>
            <Text
              fontWeight={!contactNickname ? 'semibold' : 'normal'}
              color={!contactNickname ? 'grey.200' : 'grey.500'}
            >
              {AddressUtils.format(member?.address)}
            </Text>
          </Box>
        </Box>

        <HStack
          w={{ base: '100%', xs: '32%' }}
          spacing={4}
          justifyContent="space-between"
        >
          <Badge
            rounded="xl"
            fontSize="xs"
            py={{ base: 0.5, xs: 1 }}
            px={{ base: 2, xs: 4 }}
            variant={permission?.variant}
          >
            {permission?.title}
          </Badge>

          {isEditable && (
            <EditIcon
              _hover={{
                cursor: 'pointer',
                opacity: 0.8,
              }}
              onClick={() => onEdit(member?.id)}
              boxSize={{ base: 5, xs: 6 }}
            />
          )}
        </HStack>
      </Box>
    </Card>
  );
};
export { MemberCard };
