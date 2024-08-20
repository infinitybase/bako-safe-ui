import { Box, Divider, Icon, VStack } from '@chakra-ui/react';

import {
  CoinsIcon,
  ExchangeIcon,
  HomeIcon,
  PendingIcon,
  SettingsIcon,
} from '@/components';
import { SidebarMenu } from '@/layouts/dashboard/menu';
import { Pages, PermissionRoles } from '@/modules/core';
import { AddressUtils } from '@/modules/core/utils';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';
import { VaultBox, VaultDrawer } from '@/modules/vault/components';
import { useVaultDrawer } from '@/modules/vault/components/drawer/hook';
import { useVaultInfosContext } from '@/modules/vault/VaultInfosProvider';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

interface SidebarProps {
  onDrawer?: boolean;
}

const Sidebar = ({ onDrawer }: SidebarProps) => {
  const {
    workspaceInfos: {
      handlers: { hasPermission },
    },
  } = useWorkspaceContext();

  const {
    isPendingSigner,
    pendingSignerTransactionsLength,
    assets: { isLoading, hasBalance },
    vault,
    sideBarDetails: { route, drawer, menuItems },
  } = useVaultInfosContext();

  const {
    vaultTransactions: {
      handlers: { setSelectedTransaction },
    },
  } = useTransactionsContext();

  const {
    request: { refetch },
  } = useVaultDrawer({ onClose: () => {} });

  const handleClick = (navigate: void) => {
    setSelectedTransaction({});
    navigate;
  };

  return (
    <Box
      w="100%"
      maxW="350px"
      bgColor={onDrawer ? 'transparent' : 'dark.500'}
      borderRightWidth={1}
      borderRightColor="dark.100"
      py={6}
      px={6}
    >
      <VStack position="fixed" width="275px">
        {/* VAULT DRAWER LIST */}
        <VaultDrawer
          isOpen={drawer.isOpen}
          onClose={drawer.onClose}
          vaultId={route.params.vaultId!}
        />

        {/*/!* VAULT INFOS *!/*/}
        <VaultBox
          isFirstAssetsLoading={isLoading}
          name={String(`${vault.data?.name?.slice(0, 9)}...`)}
          fullName={String(vault.data?.name)}
          address={AddressUtils.format(vault?.data?.predicateAddress ?? '')!}
          isLoading={vault.isLoading}
          isFetching={vault.isFetching}
          onChangeVault={() => {
            refetch(), drawer.onOpen();
          }}
          hasBalance={hasBalance}
          isPending={isPendingSigner}
          hasPermission={hasPermission([
            PermissionRoles?.OWNER,
            PermissionRoles?.ADMIN,
            PermissionRoles?.MANAGER,
          ])}
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
              handleClick(
                route.navigate(
                  Pages.detailsVault({
                    workspaceId: route.params.workspaceId!,
                    vaultId: route.params.vaultId!,
                  }),
                ),
              )
            }
          >
            <SidebarMenu.Icon as={HomeIcon} />
            <SidebarMenu.Title isActive>Home</SidebarMenu.Title>
          </SidebarMenu.Container>

          <SidebarMenu.Container
            isActive={menuItems.balance}
            onClick={() =>
              handleClick(
                route.navigate(
                  Pages.vaultBalance({
                    workspaceId: route.params.workspaceId!,
                    vaultId: route.params.vaultId!,
                  }),
                ),
              )
            }
          >
            <SidebarMenu.Icon as={CoinsIcon} textColor="#C5C5C5" />
            <SidebarMenu.Title>Balance</SidebarMenu.Title>
          </SidebarMenu.Container>

          <SidebarMenu.Container
            isActive={menuItems.transactions}
            cursor={'pointer'}
            onClick={() =>
              handleClick(
                route.navigate(
                  Pages.transactions({
                    workspaceId: route.params.workspaceId!,
                    vaultId: route.params.vaultId!,
                  }),
                ),
              )
            }
          >
            <SidebarMenu.Icon as={ExchangeIcon} />
            <SidebarMenu.Title>Transactions</SidebarMenu.Title>
            <SidebarMenu.Badge hidden={!isPendingSigner}>
              <Icon as={PendingIcon} />{' '}
              {isPendingSigner && pendingSignerTransactionsLength}
            </SidebarMenu.Badge>
          </SidebarMenu.Container>

          <SidebarMenu.Container
            isActive={menuItems.settings}
            onClick={() =>
              handleClick(
                route.navigate(
                  Pages.vaultSettings({
                    workspaceId: route.params.workspaceId!,
                    vaultId: route.params.vaultId!,
                  }),
                ),
              )
            }
          >
            <SidebarMenu.Icon as={SettingsIcon} />
            <SidebarMenu.Title>Settings</SidebarMenu.Title>
          </SidebarMenu.Container>
        </SidebarMenu.List>
      </VStack>
    </Box>
  );
};

export { Sidebar };
