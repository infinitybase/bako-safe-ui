import { PermissionRoles } from '@bako-safe/services';
import {
  CoinsIcon,
  ExchangeIcon,
  OverviewIcon,
  PendingIcon,
  SettingsIcon,
} from '@bako-safe/ui/components';
import { Box, BoxProps, Divider, Icon, VStack } from '@chakra-ui/react';

import { SidebarMenu } from '@/layouts/dashboard/menu';
import { Pages } from '@/modules/core';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';
import { VaultBox, VaultListModal } from '@/modules/vault/components';
import { useVaultDrawer } from '@/modules/vault/components/modal/hook';
import { useVaultInfosContext } from '@/modules/vault/VaultInfosProvider';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

interface SidebarProps extends BoxProps {
  onDrawer?: boolean;
}

const Sidebar = ({ onDrawer, ...rest }: SidebarProps) => {
  const {
    workspaceInfos: {
      handlers: { hasPermission },
    },
    screenSizes: { isMobile },
  } = useWorkspaceContext();

  const {
    assets: { isLoading, hasBalance, isEthBalanceLowerThanReservedAmount },
    vault,
    sideBarDetails: { route, drawer, menuItems },
  } = useVaultInfosContext();

  const {
    vaultTransactions: {
      handlers: { setSelectedTransaction },
    },
    isPendingSigner,
    pendingSignerTransactionsLength,
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
      maxW={isMobile ? 'full' : '300px'}
      bgColor={onDrawer ? 'transparent' : 'dark.950'}
      boxShadow={onDrawer ? 'none' : '8px 0px 6px 0px rgba(0, 0, 0, 0.15)'}
      p="24px 16px 16px 16px"
      {...rest}
    >
      <VStack
        position="fixed"
        width={isMobile ? 'full' : '268px'}
        pr={isMobile ? 8 : 'unset'}
      >
        {/* VAULT Modal LIST */}
        <VaultListModal
          isOpen={drawer.isOpen}
          onClose={drawer.onClose}
          vaultId={route.params.vaultId!}
        />

        {/*/!* VAULT INFOS *!/*/}
        <VaultBox
          isFirstAssetsLoading={isLoading}
          name={vault?.data.name}
          address={vault?.data?.predicateAddress ?? ''}
          isEthBalanceLowerThanReservedAmount={
            isEthBalanceLowerThanReservedAmount
          }
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
            isActive={menuItems.overview}
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
            <SidebarMenu.Icon as={OverviewIcon} isActive={menuItems.overview} />
            <SidebarMenu.Title isActive={menuItems.overview}>
              Overview
            </SidebarMenu.Title>
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
            <SidebarMenu.Icon as={CoinsIcon} isActive={menuItems.balance} />
            <SidebarMenu.Title isActive={menuItems.balance}>
              Balance
            </SidebarMenu.Title>
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
            <SidebarMenu.Icon
              as={ExchangeIcon}
              isActive={menuItems.transactions}
            />
            <SidebarMenu.Title isActive={menuItems.transactions}>
              Transactions
            </SidebarMenu.Title>
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
            <SidebarMenu.Icon as={SettingsIcon} isActive={menuItems.settings} />
            <SidebarMenu.Title isActive={menuItems.settings}>
              Settings
            </SidebarMenu.Title>
          </SidebarMenu.Container>
        </SidebarMenu.List>
      </VStack>
    </Box>
  );
};

export { Sidebar };