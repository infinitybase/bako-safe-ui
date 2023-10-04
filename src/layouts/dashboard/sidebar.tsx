import {
  Badge,
  Box,
  chakra,
  Divider,
  Flex,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
import { HiQrCode } from 'react-icons/hi2';

import { HomeIcon, PendingIcon } from '@/components';
import { useSidebar } from '@/layouts/dashboard/hooks';
import { Pages, VaultBox } from '@/modules';

const MenuList = chakra(VStack);
const MenuItem = chakra(Flex, {
  baseStyle: {
    w: '100%',
    justifyContent: 'flex-start',
    gap: 4,
    alignItems: 'center',
  },
});

// TODO: Move to utils or use one if wxists
const formatAddress = (address?: string) =>
  address
    ? `${String(address).slice(0, 15)}...${String(address).slice(-4)}`
    : '';

const Sidebar = () => {
  const { route, vaultRequest } = useSidebar();

  return (
    <Box
      w="100%"
      maxW="350px"
      bgColor="dark.500"
      borderRightWidth={1}
      borderRightColor="dark.100"
      py={6}
      px={6}
    >
      <VaultBox
        name={String(vaultRequest.predicate?.name)}
        address={formatAddress(vaultRequest.predicate?.predicateAddress)}
        isLoading={vaultRequest.isLoading}
        onChangeVault={() => {
          console.log('Changing vault');
        }}
        onCreateTransaction={() => {
          route.navigate(Pages.createTransaction({ id: route.params.id! }));
        }}
      />

      <Divider borderColor="dark.100" my={8} />

      <MenuList spacing={6} w="100%">
        <MenuItem
          onClick={() => {
            route.navigate(Pages.home());
          }}
        >
          <Icon as={HomeIcon} fontSize="xl" />
          <Text variant="subtitle" fontSize="lg" fontWeight="bold">
            Home
          </Text>
        </MenuItem>
        <MenuItem
          onClick={() => {
            route.navigate('');
          }}
        >
          <Icon as={HiQrCode} fontSize="xl" />
          <Text variant="subtitle" fontSize="lg">
            Transactions
          </Text>
          <Badge variant="warning" fontWeight="normal">
            <Icon as={PendingIcon} /> 1
          </Badge>
        </MenuItem>
        <MenuItem
          onClick={() => {
            route.navigate('');
          }}
        >
          <Icon as={HiQrCode} fontSize="xl" />
          <Text variant="subtitle" fontSize="lg">
            Address book
          </Text>
          <Badge variant="warning" fontWeight="normal">
            Upcoming
          </Badge>
        </MenuItem>
        <MenuItem
          onClick={() => {
            route.navigate('');
          }}
        >
          <Icon as={HiQrCode} fontSize="xl" />
          <Text variant="subtitle" fontSize="lg">
            Settings
          </Text>
        </MenuItem>
      </MenuList>
    </Box>
  );
};

export { Sidebar };
