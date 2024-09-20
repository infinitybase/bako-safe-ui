import {
  Avatar,
  Box,
  chakra,
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
  VStack,
} from '@chakra-ui/react';
import { useFuel } from '@fuels/react';
import { useEffect } from 'react';

import logo from '@/assets/bakoLogoWhite.svg';
import {
  AddressWithCopyBtn,
  ExitIcon,
  NotificationIcon,
  SettingsIcon,
} from '@/components';
import { useUserWorkspacesRequest } from '@/modules';
import { TypeUser } from '@/modules/auth/services';
import { AddressUtils } from '@/modules/core/utils/address';
import { NotificationsDrawer } from '@/modules/notifications/components';
import { useAppNotifications } from '@/modules/notifications/hooks';
import { SettingsDrawer } from '@/modules/settings/components/drawer';
import { useMySettingsRequest } from '@/modules/settings/hooks/useMySettingsRequest';
import { SelectWorkspaceDialog } from '@/modules/workspace/components';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import { limitCharacters } from '@/utils';

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
    // borderLeftWidth: 1,
    borderColor: 'dark.100',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '35%',
  },
});

const UserBox = () => {
  const { authDetails } = useWorkspaceContext();
  const { fuel } = useFuel();
  const settingsDrawer = useDisclosure();
  const notificationDrawerState = useDisclosure();
  const { unreadCounter, setUnreadCounter } = useAppNotifications();
  const mySettingsRequest = useMySettingsRequest(
    authDetails.userInfos?.address,
  );

  const name = mySettingsRequest.data?.name ?? '';
  const hasNickName = !AddressUtils.isValid(name);

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

      <Popover placement="bottom-end">
        <PopoverTrigger>
          <HStack
            w="100%"
            alignItems="center"
            cursor={'pointer'}
            spacing={2}
            position="relative"
            border="1px solid #353230"
            borderRadius="6px"
            pl={4}
          >
            <Text fontWeight="semibold" color="grey.200">
              {name ? (
                limitCharacters(name, 20)
              ) : (
                <AddressWithCopyBtn
                  address={authDetails.userInfos?.address ?? ''}
                  justifyContent="start"
                  aria-label="Copy address"
                  isSidebarAddress
                  flexDir="row-reverse"
                  hideCopyButton
                />
              )}
            </Text>

            <Avatar
              variant="roundedSquare"
              src={authDetails.userInfos?.avatar}
              size={{ base: 'sm' }}
            />

            {unreadCounter > 0 && (
              <Text
                fontSize="xs"
                rounded="full"
                bgColor="error.600"
                color="white"
                border="none"
                w="16px"
                textAlign="center"
                position="absolute"
                right={-2}
                top={-2}
              >
                {unreadCounter}
              </Text>
            )}
          </HStack>
        </PopoverTrigger>

        <PopoverContent
          bg={'dark.300'}
          w="100%"
          m={0}
          p={0}
          borderTop="none"
          border="1px solid #353230"
          _focus={{ ring: 'none' }}
        >
          <PopoverBody>
            <VStack
              cursor={'pointer'}
              alignItems="start"
              px={4}
              py={2}
              spacing={1.5}
            >
              {hasNickName && (
                <Text color="grey.50" fontWeight={500}>
                  {limitCharacters(name, 25)}
                </Text>
              )}
              <AddressWithCopyBtn
                address={authDetails.userInfos?.address ?? ''}
                justifyContent="start"
                aria-label="Copy address"
                isSidebarAddress
                flexDir="row-reverse"
                addressProps={{ color: '#AAA6A1' }}
              />
            </VStack>

            <VStack
              borderTop={'1px solid'}
              borderTopColor={'dark.100'}
              cursor={'pointer'}
              alignItems="start"
              justifyContent="center"
              px={4}
              h="70px"
              onClick={notificationDrawerState.onOpen}
            >
              <HStack>
                <Icon color="grey.75" as={NotificationIcon} fontSize="xl" />
                <Text color="grey.75" fontWeight={500}>
                  Notifications
                </Text>
                {unreadCounter > 0 && (
                  <Text
                    fontSize="xs"
                    rounded="full"
                    bgColor="error.600"
                    color="white"
                    border="none"
                    w="16px"
                    textAlign="center"
                  >
                    {unreadCounter}
                  </Text>
                )}
              </HStack>
            </VStack>

            <VStack
              borderTop={'1px solid'}
              borderTopColor={'dark.100'}
              cursor={'pointer'}
              alignItems="start"
              justifyContent="center"
              px={4}
              h="70px"
              onClick={settingsDrawer.onOpen}
            >
              <HStack>
                <Icon color="grey.75" w={6} h={6} as={SettingsIcon} />
                <Text color="grey.75" fontWeight={500}>
                  Settings
                </Text>
              </HStack>
              <Text color="grey.500" fontSize="sm">
                Personalize Your Preferences.
              </Text>
            </VStack>

            <VStack
              borderTop={'1px solid'}
              borderTopColor={'dark.100'}
              cursor={'pointer'}
              alignItems="start"
              justifyContent="center"
              px={4}
              h="70px"
            >
              <HStack cursor={'pointer'} onClick={logout}>
                <Icon color="grey.75" fontSize="xl" as={ExitIcon} />
                <Text color="grey.75" fontWeight={500}>
                  Disconnect
                </Text>
              </HStack>
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};

// Commented out code to temporarily disable workspaces.

// const WorkspaceBox = ({
//   isLoading,
//   currentWorkspace,
// }: {
//   currentWorkspace?: Partial<Workspace>;
//   isLoading?: boolean;
// }) => {
//   const {
//     screenSizes: { isMobile },
//   } = useWorkspaceContext();

//   if (isLoading)
//     return (
//       <CircularProgress
//         trackColor="dark.100"
//         size={18}
//         isIndeterminate
//         color="brand.500"
//       />
//     );

//   if (!currentWorkspace) return null;

//   const { avatar, name, single: isMyWorkspace } = currentWorkspace;

//   return (
//     <Flex
//       w="full"
//       alignItems="center"
//       justifyContent={{ base: 'flex-end', sm: 'space-between' }}
//     >
//       <Flex>
//         {isMyWorkspace && (
//           <Text
//             fontSize={{ base: 'xs', sm: 'md' }}
//             fontWeight="semibold"
//             color="grey.200"
//             border="2px"
//             padding={2}
//             borderRadius="lg"
//             borderColor="grey.500"
//             _hover={{ opacity: 0.8 }}
//           >
//             Choose a workspace
//           </Text>
//         )}
//         {!isMyWorkspace && (
//           <HStack
//             spacing={{ base: 2, sm: 4 }}
//             flexDirection={{ base: 'row-reverse', sm: 'row' }}
//           >
//             <Avatar
//               variant="roundedSquare"
//               src={avatar}
//               size={{ base: 'sm', sm: 'md' }}
//             />
//             <Box w={{ base: 100, sm: 150 }}>
//               <Text
//                 fontSize={{ base: 'xs', sm: 'md' }}
//                 fontWeight="semibold"
//                 color="grey.200"
//                 isTruncated
//                 maxW={150}
//                 textAlign={{
//                   base: 'right',
//                   sm: 'left',
//                 }}
//               >
//                 {name}
//               </Text>
//               <Text
//                 fontSize={{ base: 'xs', sm: 'sm' }}
//                 color="grey.500"
//                 textAlign={{
//                   base: 'right',
//                   sm: 'left',
//                 }}
//               >
//                 {isMobile ? 'Workspace' : 'Current workspace'}
//               </Text>
//             </Box>
//             {!isMobile && <ReplaceIcon color="grey.200" fontSize={20} />}
//           </HStack>
//         )}
//       </Flex>
//     </Flex>
//   );
// };

const Header = () => {
  const notificationDrawerState = useDisclosure();
  const createWorkspaceDialog = useDisclosure();
  const { data: userWorkspaces } = useUserWorkspacesRequest();
  const {
    // authDetails: { userInfos },
    workspaceInfos: {
      workspaceDialog,
      handlers: { handleWorkspaceSelection, goHome },
    },
  } = useWorkspaceContext();

  const { unreadCounter, setUnreadCounter } = useAppNotifications();

  const handleGoToCreateWorkspace = () => createWorkspaceDialog.onOpen();

  // Bug fix to unread counter that keeps previous state after redirect
  useEffect(() => {
    setUnreadCounter(0);
    setUnreadCounter(unreadCounter);
  }, []);

  // WorkspaceLogic
  // const handleCancel = async () => {
  //   createWorkspaceDialog.onClose();
  // };

  // const handleClose = async () => {
  //   createWorkspaceDialog.onClose();
  //   workspaceDialog.onClose();
  // };

  return (
    <Flex
      h={{
        base: '64px',
        sm: '72px',
      }}
      zIndex={100}
      w="100%"
      bgColor="dark.950"
      px={{ base: 0, sm: 4 }}
      alignItems="center"
      position="sticky"
      top="0"
      justifyContent="space-between"
      boxShadow="0px 8px 12px 0px rgba(0, 0, 0, 0.2)"
    >
      <NotificationsDrawer
        isOpen={notificationDrawerState.isOpen}
        onClose={notificationDrawerState.onClose}
      />
      <SelectWorkspaceDialog
        dialog={workspaceDialog}
        userWorkspaces={userWorkspaces ?? []}
        onSelect={handleWorkspaceSelection}
        onCreate={handleGoToCreateWorkspace}
        isCreatingWorkspace={createWorkspaceDialog.isOpen}
      />

      {/* {createWorkspaceDialog.isOpen && (
        <CreateWorkspaceDialog
          isOpen={createWorkspaceDialog.isOpen}
          handleCancel={handleCancel}
          onClose={handleClose}
        />
      )} */}

      <Box
        cursor="pointer"
        onClick={() => {
          goHome();
        }}
      >
        <Image width={{ base: 90, sm: 140 }} src={logo} alt="" p={0} />
      </Box>

      {/* <HStack spacing={0} height="100%"> */}
      {/* Commented out code to temporarily disable workspaces. */}

      {/* <TopBarItem
          onClick={workspaceDialog.onOpen}
          cursor="pointer"
          w={{
            base: 190,
            sm: userInfos.onSingleWorkspace ? 235 : 300,
          }}
          borderLeftWidth={{ base: 0, sm: 1 }}
        >
          <WorkspaceBox
            currentWorkspace={{
              single: userInfos?.onSingleWorkspace,
              ...userInfos?.workspace,
            }}
            isLoading={userInfos?.isLoading}
          />
        </TopBarItem> */}

      <TopBarItem>
        <UserBox />
      </TopBarItem>
      {/* </HStack> */}
    </Flex>
  );
};

export { Header };
