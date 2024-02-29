import { Box, Divider, Icon } from '@chakra-ui/react';

import {
  ExchangeIcon,
  HomeIcon,
  PendingIcon,
  SettingsIcon,
} from '@/components';
import { SidebarMenu } from '@/layouts/dashboard/menu';
import { Pages, PermissionRoles } from '@/modules/core';
import { AddressUtils } from '@/modules/core/utils';
import { useVaultDetails } from '@/modules/vault';
import { VaultBox, VaultDrawer } from '@/modules/vault/components';
import { useWorkspace } from '@/modules/workspace';

import { useSidebar } from './hook';

const { ADMIN, MANAGER, OWNER } = PermissionRoles;

const Sidebar = () => {
  const {
    route,
    drawer,
    menuItems,
    vaultAssets,
    vaultRequest,
    transactionListRequest: {
      pendingTransactions,
      pendingSignerTransactionsLength,
    },
  } = useSidebar();

  const { vault } = useVaultDetails();

  const { hasPermission } = useWorkspace();

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
        name={String(`${vaultRequest.predicate?.name?.slice(0, 9)}...`)}
        fullName={String(vaultRequest.predicate?.name)}
        address={
          AddressUtils.format(vaultRequest?.predicate?.predicateAddress ?? '')!
        }
        isLoading={vaultRequest.isLoading}
        onChangeVault={drawer.onOpen}
        hasBalance={vaultAssets.hasBalance}
        isPending={vault.transactions.isPendingSigner}
        hasPermission={hasPermission([ADMIN, MANAGER, OWNER])}
        onCreateTransaction={() => {
          route.navigate(
            Pages.createTransaction({
              workspaceId: route.params.workspaceId!,
              vaultId: route.params.vaultId!,
            }),
          );
        }}
      />

      <Divider borderColor="dark.100" mt={8} mb={4} />

      {/* MENU */}
      <SidebarMenu.List w="100%">
        <SidebarMenu.Container
          isActive={menuItems.home}
          onClick={() =>
            route.navigate(
              Pages.detailsVault({
                workspaceId: route.params.workspaceId!,
                vaultId: route.params.vaultId!,
              }),
            )
          }
        >
          <SidebarMenu.Icon as={HomeIcon} />
          <SidebarMenu.Title isActive>Home</SidebarMenu.Title>
        </SidebarMenu.Container>

        <SidebarMenu.Container
          isActive={menuItems.transactions}
          cursor={'pointer'}
          onClick={() =>
            route.navigate(
              Pages.transactions({
                workspaceId: route.params.workspaceId!,
                vaultId: route.params.vaultId!,
              }),
            )
          }
        >
          <SidebarMenu.Icon as={ExchangeIcon} />
          <SidebarMenu.Title>Transactions</SidebarMenu.Title>
          <SidebarMenu.Badge hidden={!pendingTransactions}>
            <Icon as={PendingIcon} />{' '}
            {pendingTransactions && pendingSignerTransactionsLength}
          </SidebarMenu.Badge>
        </SidebarMenu.Container>

        {/*<SidebarMenu.Container onClick={() => {}}>*/}
        {/*  <SidebarMenu.Icon as={HiQrCode} />*/}
        {/*  <SidebarMenu.Title> Address book</SidebarMenu.Title>*/}
        {/*  <SidebarMenu.Badge>Upcoming</SidebarMenu.Badge>*/}
        {/*</SidebarMenu.Container>*/}

        <SidebarMenu.Container
          isActive={menuItems.settings}
          onClick={() =>
            route.navigate(
              Pages.vaultSettings({
                workspaceId: route.params.workspaceId!,
                vaultId: route.params.vaultId!,
              }),
            )
          }
        >
          <SidebarMenu.Icon as={SettingsIcon} />
          <SidebarMenu.Title>Settings</SidebarMenu.Title>
        </SidebarMenu.Container>
      </SidebarMenu.List>
    </Box>
  );
};

export { Sidebar };
