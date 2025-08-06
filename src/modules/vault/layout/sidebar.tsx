import { Box, BoxProps, Divider, Icon, VStack } from '@chakra-ui/react';
import AutoPlay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback } from 'react';

import {
  BakoGarageBanner,
  BakoIdIcon,
  Banner,
  Carousel,
  CoinsIcon,
  ExchangeIcon,
  OverviewIcon,
  PendingIcon,
  SettingsIcon,
} from '@/components';
import { SidebarMenu } from '@/layouts/dashboard/menu';
import { Pages, PermissionRoles } from '@/modules/core';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';
import { VaultBox, VaultListModal } from '@/modules/vault/components';
import { useVaultInfosContext } from '@/modules/vault/VaultInfosProvider';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import { getBakoIDURL, getGarageURL } from '@/utils/enviroment';

interface SidebarProps extends BoxProps {
  onDrawer?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ onDrawer, ...rest }: SidebarProps) => {
  const {
    workspaceInfos: {
      handlers: { hasPermission },
    },
    screenSizes: { isLargerThan1210 },
  } = useWorkspaceContext();
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    AutoPlay({ delay: 4000, playOnInit: true }),
  ]);

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

  const handleClick = (navigate: void) => {
    setSelectedTransaction({});
    navigate;
  };

  const handleOpenDrawer = useCallback(() => drawer.onOpen(), [drawer]);

  return (
    <Box
      w="100%"
      maxW={isLargerThan1210 ? '300px' : 'full'}
      bgColor={onDrawer ? 'transparent' : 'dark.950'}
      boxShadow={onDrawer ? 'none' : '8px 0px 6px 0px rgba(0, 0, 0, 0.15)'}
      p="24px 16px 16px 16px"
      {...rest}
    >
      <VStack
        position="fixed"
        width={isLargerThan1210 ? '269px' : 'full'}
        pr={isLargerThan1210 ? 'unset' : 8}
        pb={4}
        pt={isLargerThan1210 ? 6 : 0}
        top={isLargerThan1210 ? '72px' : 14}
        bottom={0}
        overflowY="scroll"
        __css={{
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '&::-webkit-scrollbar-thumb': {
            display: 'none',
          },
        }}
      >
        {/* VAULT Modal LIST */}
        <VaultListModal
          isOpen={drawer.isOpen}
          onClose={drawer.onClose}
          onCloseAll={() => {
            drawer.onClose();
            rest.onClose?.();
          }}
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
          onChangeVault={handleOpenDrawer}
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
        <SidebarMenu.List w="100%" mb={4}>
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
            id={'transactions_tab_sidebar'}
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
            id={'settings_tab_sidebar'}
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

        <Carousel.Root emblaRef={emblaRef} mt="auto">
          <Carousel.Slide>
            <Carousel.SlideItem>
              <Banner
                icon={<Icon as={BakoIdIcon} h={10} w={102.5} />}
                title="Register your Handles"
                onClick={() => window.open(getBakoIDURL(), '_blank')}
              />
            </Carousel.SlideItem>
            <Carousel.SlideItem>
              <BakoGarageBanner
                cursor="pointer"
                onClick={() => window.open(getGarageURL(), '_blank')}
              />
            </Carousel.SlideItem>
          </Carousel.Slide>
        </Carousel.Root>
      </VStack>
    </Box>
  );
};

export { Sidebar };
