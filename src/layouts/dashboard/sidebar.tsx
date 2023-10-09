import { Box, Divider, Icon } from '@chakra-ui/react';
import { HiQrCode } from 'react-icons/hi2';

import { HomeIcon, PendingIcon } from '@/components';
import { SidebarMenu } from '@/layouts/dashboard/menu';
import { Pages, VaultBox, VaultDrawer } from '@/modules';

import { useSidebar } from './hook';

// TODO: Move to utils or use one if wxists
const formatAddress = (address?: string) =>
  address
    ? `${String(address).slice(0, 15)}...${String(address).slice(-4)}`
    : '';

const Sidebar = () => {
  const { route, vaultRequest, pendingTransactions, drawer } = useSidebar();

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
      {/* VAULT DRAWER LIST */}
      <VaultDrawer
        isOpen={drawer.isOpen}
        onClose={drawer.onClose}
        vaultId={route.params.vaultId!}
      />

      {/*/!* VAULT INFOS *!/*/}
      <VaultBox
        name={String(`${vaultRequest.predicate?.name.slice(0, 9)}...`)}
        address={formatAddress(vaultRequest.predicate?.predicateAddress)}
        isLoading={vaultRequest.isLoading}
        onChangeVault={drawer.onOpen}
        onCreateTransaction={() => {
          route.navigate(
            Pages.createTransaction({ vaultId: route.params.vaultId! }),
          );
        }}
      />

      <Divider borderColor="dark.100" my={8} />

      {/* MENU */}
      <SidebarMenu.List spacing={6} w="100%">
        <SidebarMenu.Container
          onClick={() => {
            route.navigate(Pages.home());
          }}
        >
          <SidebarMenu.Icon as={HomeIcon} />
          <SidebarMenu.Title isActive>Home</SidebarMenu.Title>
        </SidebarMenu.Container>

        <SidebarMenu.Container
          onClick={() => {
            route.navigate(Pages.home());
          }}
        >
          <SidebarMenu.Icon as={HiQrCode} />
          <SidebarMenu.Title>Transactions</SidebarMenu.Title>
          <SidebarMenu.Badge hidden={!pendingTransactions}>
            <Icon as={PendingIcon} /> {pendingTransactions}
          </SidebarMenu.Badge>
        </SidebarMenu.Container>

        <SidebarMenu.Container
          onClick={() => {
            route.navigate(Pages.home());
          }}
        >
          <SidebarMenu.Icon as={HiQrCode} />
          <SidebarMenu.Title> Address book</SidebarMenu.Title>
          <SidebarMenu.Badge>Upcoming</SidebarMenu.Badge>
        </SidebarMenu.Container>

        <SidebarMenu.Container
          onClick={() => {
            route.navigate(Pages.home());
          }}
        >
          <SidebarMenu.Icon as={HiQrCode} />
          <SidebarMenu.Title>Settings</SidebarMenu.Title>
        </SidebarMenu.Container>
      </SidebarMenu.List>
    </Box>
  );
};

export { Sidebar };
