import { Box, chakra, Flex, Image, useDisclosure } from '@chakra-ui/react';

import logo from '@/assets/bakoLogoWhite.svg';
import { UserBox } from '@/modules';
import { NotificationsDrawer } from '@/modules/notifications/components';
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

const Header = () => {
  const notificationDrawerState = useDisclosure();
  const {
    workspaceInfos: {
      handlers: { goHome },
    },
  } = useWorkspaceContext();

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

      <Box
        cursor="pointer"
        onClick={() => {
          goHome();
        }}
      >
        <Image width={{ base: 90, sm: 140 }} src={logo} alt="" p={0} />
      </Box>

      <TopBarItem>
        <UserBox />
      </TopBarItem>
    </Flex>
  );
};

export { Header };
