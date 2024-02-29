import {
  Avatar,
  Box,
  Center,
  chakra,
  CircularProgress,
  Flex,
  HStack,
  Icon,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useFuel } from '@fuels/react';
import { useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import logo from '@/assets/bakoLogoWhite.svg';
import {
  ExitIcon,
  NotificationIcon,
  QuestionIcon,
  ReplaceIcon,
  SettingsIcon,
} from '@/components';
import { useAuth } from '@/modules/auth/hooks';
import { useLoadImage, useScreenSize } from '@/modules/core/hooks';
import { Workspace } from '@/modules/core/models';
import { Pages } from '@/modules/core/routes';
import { AddressUtils } from '@/modules/core/utils/address';
import { useHome } from '@/modules/home/hooks/useHome';
import { NotificationsDrawer } from '@/modules/notifications/components';
import { useAppNotifications } from '@/modules/notifications/hooks';
import { SettingsDrawer } from '@/modules/settings/components/drawer';
import { SelectWorkspaceDialog } from '@/modules/workspace/components';
import { useWorkspace } from '@/modules/workspace/hooks';

import { useSidebar } from './hook';

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
    height: '100%',
  },
});

const UserBox = () => {
  const { isMobile } = useScreenSize();
  const auth = useAuth();
  const avatarImage = useLoadImage(auth.avatar);
  const { fuel } = useFuel();
  const settingsDrawer = useDisclosure();
  const { drawer } = useSidebar();

  const logout = async () => {
    await fuel.disconnect();
    auth.handlers.logout();
  };

  return (
    <>
      <SettingsDrawer
        isOpen={settingsDrawer.isOpen}
        onClose={settingsDrawer.onClose}
        onOpen={settingsDrawer.onOpen}
      />

      <NotificationsDrawer isOpen={drawer.isOpen} onClose={drawer.onClose} />

      <Popover>
        <PopoverTrigger>
          <Flex w="100%" alignItems="center" cursor={'pointer'}>
            <Box mr={4}>
              {avatarImage.isLoading ? (
                <Skeleton
                  w="48px"
                  h="48px"
                  startColor="dark.100"
                  endColor="dark.300"
                  borderRadius={5}
                />
              ) : (
                <Avatar
                  variant="roundedSquare"
                  src={auth.avatar}
                  size={{ base: 'sm', sm: 'md' }}
                />
              )}
            </Box>

            {!isMobile && (
              <Box mr={9}>
                <Text fontWeight="semibold" color="grey.200">
                  {AddressUtils.format(auth.account)}
                </Text>
              </Box>
            )}

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
                  onClick={drawer.onOpen}
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
                  </HStack>
                </Box>

                <Box
                  borderTop={'1px solid'}
                  borderTopColor={'dark.100'}
                  cursor={'pointer'}
                  onClick={() =>
                    window.open(import.meta.env.VITE_USABILITY_URL, '__BLANK')
                  }
                  p={5}
                >
                  <HStack>
                    <Icon color="grey.200" as={QuestionIcon} fontSize="xl" />
                    <Text color="grey.200" fontWeight={'bold'}>
                      Help
                    </Text>
                  </HStack>
                </Box>
              </>
            )}

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
          </HStack>
        )}
      </Flex>

      {!isMobile && <ReplaceIcon color="grey.200" fontSize={20} />}
    </Flex>
  );
};

const Header = () => {
  const { isMobile } = useScreenSize();
  const navigate = useNavigate();
  const { drawer } = useSidebar();
  const {
    currentWorkspace,
    workspaceDialog,
    userWorkspacesRequest: { data: userWorkspaces },
    handleWorkspaceSelection,
  } = useWorkspace();
  const { unreadCounter, setUnreadCounter } = useAppNotifications();
  const { goHome } = useHome();
  const handleGoToCreateWorkspace = () => navigate(Pages.createWorkspace());

  // Bug fix to unread counter that keeps previous state after redirect
  useEffect(() => {
    setUnreadCounter(0);
    setUnreadCounter(unreadCounter);
  }, []);

  return (
    <Flex
      h={{
        base: '64px',
        sm: 82,
      }}
      w="100%"
      bgColor="dark.300"
      alignItems="center"
      borderBottomWidth={1}
      justifyContent="space-between"
      borderBottomColor="dark.100"
    >
      <NotificationsDrawer isOpen={drawer.isOpen} onClose={drawer.onClose} />
      <SelectWorkspaceDialog
        dialog={workspaceDialog}
        userWorkspaces={userWorkspaces ?? []}
        onSelect={handleWorkspaceSelection.handler}
        onCreate={handleGoToCreateWorkspace}
      />

      <SpacedBox
        cursor="pointer"
        onClick={() => {
          goHome();
        }}
        pl={6}
      >
        <img width={isMobile ? 65 : 95} src={logo} alt="" />
      </SpacedBox>

      <HStack spacing={0} height="100%">
        <TopBarItem
          onClick={workspaceDialog.onOpen}
          cursor="pointer"
          w={{
            base: 190,
            sm: 310,
          }}
          borderLeftWidth={{ base: 0, sm: 1 }}
        >
          <WorkspaceBox
            currentWorkspace={currentWorkspace.workspace}
            isLoading={currentWorkspace.isLoading}
          />
        </TopBarItem>

        {!isMobile && (
          <>
            <TopBarItem
              onClick={() =>
                window.open(import.meta.env.VITE_USABILITY_URL, '__BLANK')
              }
            >
              <Icon color="grey.200" as={QuestionIcon} />
            </TopBarItem>

            <TopBarItem cursor="pointer" onClick={drawer.onOpen} width={78}>
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
          </>
        )}

        <TopBarItem>
          <UserBox />
        </TopBarItem>
      </HStack>
    </Flex>
  );
};

export { Header };
