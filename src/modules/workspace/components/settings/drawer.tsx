import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { Card, ErrorIcon, RemoveIcon, UserAddIcon } from '@/components';
import { EditIcon } from '@/components/icons/edit-icon';
import { useAddressBook } from '@/modules/addressBook';
import {
  AddressUtils,
  Member,
  Pages,
  PermissionRoles,
  Workspace,
} from '@/modules/core';
import { useGetCurrentWorkspace } from '@/modules/workspace/hooks';
import { WorkspacePermissionUtils } from '@/modules/workspace/utils';
import { useAuth } from '../../../auth/hooks/useAuth';

import { WorkspaceCard } from '../card';

interface WorkspaceSettingsDrawerProps
  extends Pick<DrawerProps, 'isOpen' | 'onClose'> {}

interface MemberCardProps {
  member: Member;
  workspace: Workspace;
  onEdit: (memberId: string) => void;
}

const MemberCard = ({ member, workspace, onEdit }: MemberCardProps) => {
  const { permissions: loggedPermissions } = useAuth();

  const permission = WorkspacePermissionUtils.getPermissionInWorkspace(
    workspace!,
    member,
  );

  const { contactByAddress } = useAddressBook();

  //TODO: Use this validation to delete button
  const isEditable =
    WorkspacePermissionUtils.hasPermissions(loggedPermissions!, [
      PermissionRoles.ADMIN,
      PermissionRoles.OWNER,
    ]) && permission?.title?.toUpperCase() !== PermissionRoles.OWNER;

  const contactNickname = contactByAddress(member.address!)?.nickname;
  return (
    <Card
      w="full"
      h={20}
      bgColor="grey.850"
      borderColor="grey.600"
      borderWidth="1.5px"
      key={member.id}
      _hover={{
        cursor: 'pointer',
        borderColor: 'brand.600',
      }}
    >
      <HStack
        w="full"
        h="full"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box display="flex" alignItems="center" gap={3}>
          <Avatar
            size="md"
            fontSize="md"
            color="white"
            bg="grey.900"
            variant="roundedSquare"
            name={contactByAddress(member.address!)?.nickname ?? member.address}
          />
          <Box mr={1}>
            <Text fontWeight="semibold" color="grey.200">
              {contactNickname ?? ''}
            </Text>
            <Text
              fontWeight={!contactNickname ? 'semibold' : 'normal'}
              color={!contactNickname ? 'grey.200' : 'grey.500'}
            >
              {AddressUtils.format(member.address)}
            </Text>
          </Box>
        </Box>
        {isEditable && (
          <HStack spacing={6}>
            <Badge
              rounded="xl"
              fontSize="xs"
              py={1}
              px={4}
              variant={permission?.variant}
            >
              {permission?.title}
            </Badge>

            <Box>
              <EditIcon
                _hover={{
                  cursor: 'pointer',
                  opacity: 0.8,
                }}
                onClick={() => onEdit(member.id)}
                w={6}
                h={6}
                mr={4}
              />

              <RemoveIcon
                _hover={{
                  cursor: 'pointer',
                  opacity: 0.8,
                }}
                onClick={() => {}}
                w={6}
                h={6}
              />
            </Box>
          </HStack>
        )}
      </HStack>
    </Card>
  );
};

const WorkspaceSettingsDrawer = ({
  ...drawerProps
}: WorkspaceSettingsDrawerProps) => {
  const navigate = useNavigate();

  const request = useGetCurrentWorkspace();

  return (
    <Drawer {...drawerProps} size="md" variant="glassmorphic" placement="right">
      <DrawerOverlay />
      <DrawerContent>
        <Flex mb={5} w="full" justifyContent="flex-end">
          <HStack cursor="pointer" onClick={drawerProps.onClose} spacing={2}>
            <ErrorIcon />
            <Text fontWeight="semibold" color="white">
              Close
            </Text>
          </HStack>
        </Flex>

        <DrawerHeader mb={10}>
          <VStack alignItems="flex-start" spacing={5}>
            <Heading fontSize="2xl" fontWeight="semibold" color="white">
              Workspace settings
            </Heading>
            <Text fontSize="sm" color="grey.200">
              This is the workspace that you are seeing.
            </Text>
          </VStack>
        </DrawerHeader>

        <DrawerBody>
          <WorkspaceCard
            key={request.workspace?.id}
            workspace={request.workspace!}
            counter={{
              members: request.workspace!.members.length,
              //In this case, the predicates are coming in an array, so we need to use the length property
              vaults: Array.isArray(request.workspace!.predicates)
                ? request.workspace!.predicates.length
                : 0,
            }}
            mb={10}
          />
          {/* <Card mb={10} bgColor="dark.200">
            <HStack spacing={5}>
              <Avatar
                p={10}
                size="lg"
                fontSize="md"
                color="white"
                bg="grey.900"
                variant="roundedSquare"
                name={request.workspace?.name}
              />
              <Box>
                <Heading mb={1} variant="title-xl" isTruncated maxW={600}>
                  {request.workspace?.name}
                </Heading>
                <Text variant="description">
                  {request.workspace?.description}
                </Text>
              </Box>
            </HStack>
          </Card> */}
          <Divider mb={10} />
          <Flex
            w="full"
            mb={10}
            justifyContent="space-between"
            alignItems="center"
          >
            <Flex h={14} flexDir="column" justify="space-around">
              <Heading fontSize="lg" fontWeight="semibold" color="grey.200">
                Members
              </Heading>
              <Text fontSize="sm" color="grey.400">
                {request.workspace?.members.length}{' '}
                {request.workspace?.members.length === 1 ? 'Member' : 'Members'}
              </Text>
            </Flex>

            <Button
              size="md"
              h={10}
              variant="primary"
              bgColor="grey.200"
              border="none"
              gap={2}
              onClick={() => {
                navigate(
                  Pages.membersWorkspace({
                    workspaceId: request.workspace?.id ?? '',
                  }),
                );
              }}
              _hover={{
                opacity: 0.8,
              }}
            >
              <UserAddIcon />
              Add member
            </Button>
          </Flex>

          <VStack w="full">
            {!!request.workspace?.members &&
              request.workspace?.members.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  workspace={request.workspace!}
                  onEdit={(memberId) =>
                    navigate(
                      Pages.updateMemberWorkspace({
                        workspaceId: request.workspace!.id,
                        memberId,
                      }),
                    )
                  }
                />
              ))}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export { WorkspaceSettingsDrawer };
