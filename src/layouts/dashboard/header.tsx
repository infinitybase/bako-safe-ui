import {
  Avatar,
  Box,
  Center,
  chakra,
  CircularProgress,
  Flex,
  HStack,
  Icon,
  Image,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useFuel } from '@fuels/react';
import { useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';

import logo from '@/assets/bakoLogoWhite.svg';
import {
  ExitIcon,
  NotificationIcon,
  ReplaceIcon,
  SettingsIcon,
} from '@/components';
import { TypeUser } from '@/modules/auth/services';
import { useScreenSize } from '@/modules/core/hooks';
import { Workspace } from '@/modules/core/models';
import { AddressUtils } from '@/modules/core/utils/address';
import { useHome } from '@/modules/home/hooks/useHome';
import { NotificationsDrawer } from '@/modules/notifications/components';
import { useAppNotifications } from '@/modules/notifications/hooks';
import { SettingsDrawer } from '@/modules/settings/components/drawer';
import {
  CreateWorkspaceDialog,
  SelectWorkspaceDialog,
} from '@/modules/workspace/components';

import { AddressCopy } from '@/components/addressCopy';
import { useMySettingsRequest } from '@/modules/settings/hooks/useMySettingsRequest';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import { useGetWorkspaceRequest, useUserWorkspacesRequest } from '@/modules';

const SpacedBox = chakra(Box, {
  baseStyle: {
    paddingX: {
      base: 3,
      sm: 6,
    },
    paddingY: 3,
  },
});

const TopBarItem = chakra(SpacedBox, {
  baseStyle: {
    borderLeftWidth: 1,
    borderColor: 'dark.100',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '35%',
  },
});

const UserBox = () => {
  const { isMobile } = useScreenSize();
  const { authDetails } = useWorkspaceContext();
  const { fuel } = useFuel();
  const settingsDrawer = useDisclosure();
  const notificationDrawerState = useDisclosure();
  const { unreadCounter, setUnreadCounter } = useAppNotifications();
  const mySettingsRequest = useMySettingsRequest(
    authDetails.userInfos?.address,
  );
  const name = mySettingsRequest.data?.name;
  const hasNickName = !name?.startsWith('fuel');

  const logout = async () => {
    authDetails.userInfos?.type === TypeUser.FUEL && (await fuel.disconnect());
    authDetails.handlers.logout?.();
  };

  // Bug fix to unread counter that keeps previous state after redirect
  useEffect(() => {
    setUnreadCounter(0);
    setUnreadCounter(unreadCounter);
  }, []);

  return (
    <>
      <SettingsDrawer
        isOpen={settingsDrawer.isOpen}
        onClose={settingsDrawer.onClose}
        onOpen={settingsDrawer.onOpen}
      />

      <NotificationsDrawer
        isOpen={notificationDrawerState.isOpen}
        onClose={notificationDrawerState.onClose}
      />

      <Popover>
        <PopoverTrigger>
          <Flex
            w="100%"
            alignItems="center"
            cursor={'pointer'}
            px={{ base: 0, sm: 2 }}
          >
            <Box mr={{ base: 2, sm: 4 }}>
              <Avatar
                variant="roundedSquare"
                src={authDetails.userInfos?.avatar}
                size={{ base: 'sm', sm: 'md' }}
              />
            </Box>

            <Box display={{ base: 'none', sm: 'block' }} mr={9}>
              <Text fontWeight="semibold" color="grey.200">
                {AddressUtils.format(authDetails.userInfos?.address)}
              </Text>
            </Box>

            <Icon
              color="grey.200"
              fontSize={{ base: 'sm', sm: 'lg' }}
              as={FaChevronDown}
            />
          </Flex>
        </PopoverTrigger>

        <PopoverContent
          bg={'dark.300'}
          border={'none'}
          w="100%"
          m={0}
          p={0}
          boxShadow="lg"
        >
          <PopoverBody>
            {isMobile && (
              <>
                <Box
                  borderTop={'1px solid'}
                  borderTopColor={'dark.100'}
                  cursor={'pointer'}
                  onClick={notificationDrawerState.onOpen}
                  p={5}
                >
                  <HStack>
                    <Icon
                      color="grey.200"
                      as={NotificationIcon}
                      fontSize="xl"
                    />
                    <Text color="grey.200" fontWeight={'bold'}>
                      Notifications
                    </Text>

                    {unreadCounter > 0 && (
                      <Center
                        px={1}
                        py={0}
                        bg="error.600"
                        borderRadius={10}
                        position="relative"
                      >
                        <Text fontSize="xs">+{unreadCounter}</Text>
                      </Center>
                    )}
                  </HStack>
                </Box>
              </>
            )}

            <Box
              borderTop={'1px solid'}
              borderTopColor={'dark.100'}
              cursor={'pointer'}
              p={5}
              display="flex"
              flexDir={'column'}
              alignItems="start"
            >
              {hasNickName && (
                <Text color="grey.50" fontWeight={500} fontSize="16px" mb="4px">
                  {name}
                </Text>
              )}
              <AddressCopy
                addressColor="grey.250"
                spacing={1}
                flexDir="row"
                address={AddressUtils.format(authDetails.userInfos?.address)!}
                addressToCopy={authDetails.userInfos?.address}
                bg="transparent"
                fontSize={14}
                alignSelf="start"
                p={0}
              />
            </Box>

            <Box
              borderTop={'1px solid'}
              borderTopColor={'dark.100'}
              cursor={'pointer'}
              onClick={settingsDrawer.onOpen}
              p={5}
            >
              <HStack>
                <Icon color="grey.200" w={6} h={6} as={SettingsIcon} />
                <Text color="grey.200" fontWeight={'bold'}>
                  Settings
                </Text>
              </HStack>
              <Text color="grey.500">Personalize Your Preferences.</Text>
            </Box>

            <Box borderTop={'1px solid'} borderTopColor={'dark.100'} p={4}>
              <HStack cursor={'pointer'} onClick={logout}>
                <Icon color="grey.200" fontSize="xl" as={ExitIcon} />
                <Text color="grey.200" fontWeight={'bold'}>
                  Logout
                </Text>
              </HStack>
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};

const WorkspaceBox = ({
  isLoading,
  currentWorkspace,
}: {
  currentWorkspace?: Workspace;
  isLoading?: boolean;
}) => {
  const { isMobile } = useScreenSize();

  if (isLoading)
    return (
      <CircularProgress
        trackColor="dark.100"
        size={18}
        isIndeterminate
        color="brand.500"
      />
    );

  if (!currentWorkspace) return null;

  const { avatar, name, single: isMyWorkspace } = currentWorkspace;

  return (
    <Flex
      w="full"
      alignItems="center"
      justifyContent={{ base: 'flex-end', sm: 'space-between' }}
    >
      <Flex>
        {isMyWorkspace && (
          <Text
            fontSize={{ base: 'xs', sm: 'md' }}
            fontWeight="semibold"
            color="grey.200"
            border="2px"
            padding={2}
            borderRadius="lg"
            borderColor="grey.500"
            _hover={{ opacity: 0.8 }}
          >
            Choose a workspace
          </Text>
        )}
        {!isMyWorkspace && (
          <HStack
            spacing={{ base: 2, sm: 4 }}
            flexDirection={{ base: 'row-reverse', sm: 'row' }}
          >
            <Avatar
              variant="roundedSquare"
              src={avatar}
              size={{ base: 'sm', sm: 'md' }}
            />
            <Box w={{ base: 100, sm: 150 }}>
              <Text
                fontSize={{ base: 'xs', sm: 'md' }}
                fontWeight="semibold"
                color="grey.200"
                isTruncated
                maxW={150}
                textAlign={{
                  base: 'right',
                  sm: 'left',
                }}
              >
                {name}
              </Text>
              <Text
                fontSize={{ base: 'xs', sm: 'sm' }}
                color="grey.500"
                textAlign={{
                  base: 'right',
                  sm: 'left',
                }}
              >
                {isMobile ? 'Workspace' : 'Current workspace'}
              </Text>
            </Box>
            {!isMobile && <ReplaceIcon color="grey.200" fontSize={20} />}
          </HStack>
        )}
      </Flex>
    </Flex>
  );
};

const Header = () => {
  const notificationDrawerState = useDisclosure();
  const createWorkspaceDialog = useDisclosure();
  const { data: userWorkspaces } = useUserWorkspacesRequest();
  const {
    authDetails,
    workspaceInfos: { workspaceDialog, handleWorkspaceSelection },
  } = useWorkspaceContext();
  const currentWorkspace = useGetWorkspaceRequest(
    authDetails.userInfos?.workspace?.id,
  );

  const { unreadCounter, setUnreadCounter } = useAppNotifications();
  const { goHome } = useHome();
  const handleGoToCreateWorkspace = () => createWorkspaceDialog.onOpen();

  // Bug fix to unread counter that keeps previous state after redirect
  useEffect(() => {
    setUnreadCounter(0);
    setUnreadCounter(unreadCounter);
  }, []);

  const handleCancel = async () => {
    createWorkspaceDialog.onClose();
  };

  const handleClose = async () => {
    createWorkspaceDialog.onClose();
    workspaceDialog.onClose();
  };

  return (
    <Flex
      h={{
        base: '64px',
        sm: 82,
      }}
      zIndex={100}
      w="100%"
      bgColor="dark.300"
      px={{ base: 0, sm: 4 }}
      alignItems="center"
      borderBottomWidth={1}
      position="sticky"
      top="0"
      justifyContent="space-between"
      borderBottomColor="dark.100"
    >
      <NotificationsDrawer
        isOpen={notificationDrawerState.isOpen}
        onClose={notificationDrawerState.onClose}
      />
      <SelectWorkspaceDialog
        dialog={workspaceDialog}
        userWorkspaces={userWorkspaces ?? []}
        onSelect={handleWorkspaceSelection.handler}
        onCreate={handleGoToCreateWorkspace}
        isCreatingWorkspace={createWorkspaceDialog.isOpen}
      />

      {createWorkspaceDialog.isOpen && (
        <CreateWorkspaceDialog
          isOpen={createWorkspaceDialog.isOpen}
          handleCancel={handleCancel}
          onClose={handleClose}
        />
      )}

      <SpacedBox
        cursor="pointer"
        onClick={() => {
          goHome();
        }}
        pl={{ base: 1, sm: 6 }}
        mr={{ base: -8, sm: 0 }}
      >
        <Image width={{ base: 90, sm: 140 }} src={logo} alt="" />
      </SpacedBox>

      <HStack spacing={0} height="100%">
        <TopBarItem
          onClick={workspaceDialog.onOpen}
          cursor="pointer"
          w={{
            base: 190,
            sm: currentWorkspace.workspace?.single ? 235 : 300,
          }}
          borderLeftWidth={{ base: 0, sm: 1 }}
        >
          <WorkspaceBox
            currentWorkspace={currentWorkspace.workspace}
            isLoading={currentWorkspace.isLoading}
          />
        </TopBarItem>

        <TopBarItem
          display={{ base: 'none', sm: 'flex' }}
          cursor="pointer"
          onClick={notificationDrawerState.onOpen}
          width={78}
        >
          <Icon
            color="grey.200"
            as={NotificationIcon}
            fontSize={30}
            position="absolute"
          />

          {unreadCounter > 0 && (
            <Center
              px={1}
              py={0}
              bg="error.600"
              borderRadius={10}
              position="relative"
              top={-1.5}
              right={-2.5}
            >
              <Text fontSize="xs">+{unreadCounter}</Text>
            </Center>
          )}
        </TopBarItem>

        <TopBarItem>
          <UserBox />
        </TopBarItem>
      </HStack>
    </Flex>
  );
};

export { Header };
