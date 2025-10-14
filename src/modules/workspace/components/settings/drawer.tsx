import {
  Avatar,
  Badge,
  Box,
  Button,
  Drawer,
  DrawerRootProps,
  Flex,
  Heading,
  HStack,
  Portal,
  Separator,
  Text,
  VStack,
} from 'bako-ui';
import { useNavigate } from 'react-router-dom';

import { Card, LineCloseIcon, UserAddIcon } from '@/components';
import { EditIcon } from '@/components/icons/edit-icon';
import {
  AddressUtils,
  Member,
  Pages,
  PermissionRoles,
  Workspace,
} from '@/modules/core';
import { WorkspacePermissionUtils } from '@/modules/workspace/utils';

import { useWorkspaceContext } from '../../WorkspaceProvider';
import { WorkspaceCard } from '../card';

interface WorkspaceSettingsDrawerProps
  extends Pick<DrawerRootProps, 'open' | 'onOpenChange'> {}

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

  const contactNickname = contactByAddress(member.address)?.nickname;

  return (
    <Card
      alignSelf={{ base: 'start', sm: 'unset' }}
      h={{ base: 24, sm: 20 }}
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
      px={{ base: 3, sm: 6 }}
      py={2}
    >
      <Box
        display="flex"
        w="full"
        h="full"
        justifyContent="space-between"
        alignItems={{ base: 'start', sm: 'center' }}
        flexDir={{ base: 'column', sm: 'row' }}
      >
        <Box display="flex" alignItems="center" justifyContent="center" gap={3}>
          <Avatar
            boxSize="40px"
            fontSize="md"
            color="white"
            bg="grey.900"
            shape="rounded"
            name={
              contactByAddress(member?.address)?.nickname ?? member?.address
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
          w={{ base: '100%', sm: '32%' }}
          gap={4}
          justifyContent="space-between"
        >
          <Badge
            rounded="xl"
            fontSize="xs"
            py={{ base: 0.5, sm: 1 }}
            px={{ base: 2, sm: 4 }}
            colorPalette={permission?.variant}
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
              boxSize={{ base: 5, sm: 6 }}
            />
          )}
        </HStack>
      </Box>
    </Card>
  );
};

const WorkspaceSettingsDrawer = ({
  ...drawerProps
}: WorkspaceSettingsDrawerProps) => {
  const navigate = useNavigate();
  const {
    workspaceInfos: {
      currentWorkspaceRequest: { currentWorkspace },
    },
    screenSizes: { isExtraSmall },
  } = useWorkspaceContext();

  const pathname = window.location.pathname;

  const isEditingOrCreatingMember = pathname.includes('/members');

  return (
    <Drawer.Root
      {...drawerProps}
      size="md"
      // variant="solid-dark"
      placement="end"
    >
      {!isEditingOrCreatingMember && (
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Content>
            <Flex mb={5} w="full" justifyContent="flex-end" zIndex={200}>
              <HStack
                cursor="pointer"
                onClick={() => drawerProps.onOpenChange?.({ open: false })}
                gap={2}
              >
                <LineCloseIcon fontSize="24px" aria-label="Close window" />
              </HStack>
            </Flex>

            <Drawer.Header
              position="relative"
              top={isExtraSmall ? '-42px' : -12}
            >
              <VStack alignItems="flex-start" gap={5}>
                <Heading
                  fontSize={isExtraSmall ? '18px' : 'xl'}
                  fontWeight="semibold"
                  color="white"
                >
                  Workspace settings
                </Heading>
                <Text fontSize="sm" color="grey.200">
                  This is the workspace that you are seeing.
                </Text>
              </VStack>
            </Drawer.Header>

            <Drawer.Body
              mt={-2}
              overflowY="scroll"
              css={{
                '&::-webkit-scrollbar': { width: '0' },
                scrollbarWidth: 'none',
              }}
            >
              <WorkspaceCard
                // key={currentWorkspace?.id!}
                workspace={currentWorkspace!}
                counter={{
                  members: currentWorkspace?.members?.length ?? 0,
                  vaults: currentWorkspace?.predicates ?? 0,
                }}
                mb={10}
              />
              <Separator mb={6} />
              <Flex
                w="full"
                mb={4}
                justifyContent="space-between"
                alignItems="center"
              >
                <Flex h={14} flexDir="column" justify="space-around">
                  <Heading fontSize="lg" fontWeight="semibold" color="grey.200">
                    Members
                  </Heading>
                  <Text fontSize="sm" color="grey.400">
                    {currentWorkspace?.members?.length}{' '}
                    {currentWorkspace?.members?.length === 1
                      ? 'Member'
                      : 'Members'}
                  </Text>
                </Flex>

                <Button
                  size="md"
                  h={10}
                  // variant="primary"
                  bgColor="grey.200"
                  border="none"
                  gap={2}
                  onClick={() => {
                    navigate(
                      Pages.membersWorkspace({
                        workspaceId: currentWorkspace?.id ?? '',
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
              <VStack w="full" maxW="full">
                {!!currentWorkspace?.members &&
                  currentWorkspace?.members?.map((member) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      workspace={currentWorkspace!}
                      onEdit={(memberId) =>
                        navigate(
                          Pages.updateMemberWorkspace({
                            workspaceId: currentWorkspace!.id,
                            memberId,
                          }),
                        )
                      }
                    />
                  ))}
              </VStack>
            </Drawer.Body>
          </Drawer.Content>
        </Portal>
      )}
    </Drawer.Root>
  );
};

export { WorkspaceSettingsDrawer };
