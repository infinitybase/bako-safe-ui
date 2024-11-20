import { Box, chakra, Flex, Image, useDisclosure } from '@chakra-ui/react';
import { useEffect } from 'react';

import logo from '@/assets/bakoLogoWhite.svg';
import { UserBox, useUserWorkspacesRequest } from '@/modules';
import { NotificationsDrawer } from '@/modules/notifications/components';
import { useAppNotifications } from '@/modules/notifications/hooks';
import { SelectWorkspaceDialog } from '@/modules/workspace/components';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

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
    borderColor: 'dark.100',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '35%',
  },
});

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
