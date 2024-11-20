import { LineCloseIcon, UserAddIcon } from '@bako-safe/ui';
import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  type DrawerProps,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { Pages } from '@/modules/core';

import { useWorkspaceContext } from '../../WorkspaceProvider';
import { WorkspaceCard } from '../card';
import { MemberCard } from './memberCard';

interface WorkspaceSettingsDrawerProps
  extends Pick<DrawerProps, 'isOpen' | 'onClose'> {}

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
    <Drawer {...drawerProps} size="md" variant="solid-dark" placement="right">
      {!isEditingOrCreatingMember && (
        <>
          <DrawerOverlay />
          <DrawerContent>
            <Flex mb={5} w="full" justifyContent="flex-end" zIndex={200}>
              <HStack
                cursor="pointer"
                onClick={drawerProps.onClose}
                spacing={2}
              >
                <LineCloseIcon fontSize="24px" aria-label="Close window" />
              </HStack>
            </Flex>

            <DrawerHeader
              position="relative"
              top={isExtraSmall ? '-42px' : -12}
            >
              <VStack alignItems="flex-start" spacing={5}>
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
            </DrawerHeader>

            <DrawerBody
              mt={-2}
              overflowY="scroll"
              css={{
                '&::-webkit-scrollbar': { width: '0' },
                scrollbarWidth: 'none',
              }}
            >
              <WorkspaceCard
                key={currentWorkspace?.id!}
                workspace={currentWorkspace!}
                counter={{
                  members: currentWorkspace?.members?.length ?? 0,
                  vaults: currentWorkspace?.predicates ?? 0,
                }}
                mb={10}
              />
              <Divider mb={6} />
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
                  variant="primary"
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
            </DrawerBody>
          </DrawerContent>
        </>
      )}
    </Drawer>
  );
};

export { WorkspaceSettingsDrawer };
