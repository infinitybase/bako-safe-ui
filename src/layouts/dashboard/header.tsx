import {
  Avatar,
  Box,
  Center,
  chakra,
  Flex,
  HStack,
  Icon,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '@/assets/logo.svg';
import {
  ExitIcon,
  NotificationIcon,
  QuestionIcon,
  ReplaceIcon,
} from '@/components';
import { useFuelAccount } from '@/modules/auth/store';
import { Pages } from '@/modules/core';
import { useDisconnect, useLoadImage } from '@/modules/core/hooks';
import { Workspace } from '@/modules/core/models';
import { NotificationsDrawer } from '@/modules/notifications/components';
import { useAppNotifications } from '@/modules/notifications/hooks';
import { SelectWorkspaceDialog } from '@/modules/workspace/components';
import { useWorkspace } from '@/modules/workspace/hooks';

import { useSidebar } from './hook';

const SpacedBox = chakra(Box, {
  baseStyle: {
    paddingX: 6,
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

/* TODO: create props with data user */
const UserBox = () => {
  const { formattedAccount, avatar } = useFuelAccount();
  const avatarImage = useLoadImage(avatar);
  const { discconnect } = useDisconnect();

  return (
    <Flex w="100%" display="flex" alignItems="center">
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
          <Avatar variant="roundedSquare" src={avatar} />
        )}
      </Box>
      <Box mr={9}>
        <Text fontWeight="semibold" color="grey.200">
          {formattedAccount}
        </Text>
      </Box>
      <Box onClick={() => discconnect()} cursor="pointer">
        <Icon color="grey.200" fontSize="lg" as={ExitIcon} />
      </Box>
    </Flex>
  );
};

const WorkspaceBox = ({
  currentWorkspace,
}: {
  currentWorkspace: Workspace;
}) => {
  const { avatar, name, single: isMyWorkspace } = currentWorkspace;

  return (
    <Flex w="full" alignItems="center" justifyContent="space-between">
      <Flex>
        {isMyWorkspace && (
          <Text fontWeight="semibold" color="grey.200">
            Access workspace
          </Text>
        )}
        {!isMyWorkspace && (
          <HStack spacing={4}>
            <Avatar variant="roundedSquare" src={avatar} />
            <Box w={150}>
              <Text
                fontWeight="semibold"
                color="grey.200"
                isTruncated
                maxW={150}
              >
                {name}
              </Text>
              <Text fontSize="sm" color="grey.500">
                Current workspace
              </Text>
            </Box>
          </HStack>
        )}
      </Flex>

      <ReplaceIcon color="grey.200" fontSize={20} />
    </Flex>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const { drawer } = useSidebar();
  const {
    currentWorkspace,
    workspaceDialog,
    userWorkspacesRequest: { data: userWorkspaces },
    handleWorkspaceSelection,
  } = useWorkspace();
  const { unreadCounter, setUnreadCounter } = useAppNotifications();

  const handleGoToCreateWorkspace = () => navigate(Pages.createWorkspace());

  // Bug fix to unread counter that keeps previous state after redirect
  useEffect(() => {
    setUnreadCounter(0);
    setUnreadCounter(unreadCounter);
  }, []);

  return (
    <Flex
      h={82}
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
        onSelect={handleWorkspaceSelection}
        onCreate={handleGoToCreateWorkspace}
      />

      <SpacedBox cursor="pointer" onClick={() => navigate(Pages.home())}>
        <img width={90} src={logo} alt="" />
      </SpacedBox>

      <HStack spacing={0} height="100%">
        <TopBarItem
          onClick={workspaceDialog.onOpen}
          cursor="pointer"
          w={310}
          px={6}
        >
          <WorkspaceBox currentWorkspace={currentWorkspace} />
        </TopBarItem>

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

        <TopBarItem>
          <UserBox />
        </TopBarItem>
      </HStack>
    </Flex>
  );
};

export { Header };
