import { Box, BoxProps, Flex, Icon, Image, Text, VStack } from 'bako-ui';
import AutoPlay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { memo, useCallback, useMemo } from 'react';
import { NavigateOptions, To } from 'react-router-dom';

import logo from '@/assets/svg/bako-symbol-white.svg';
import {
  BakoGarageBanner,
  BakoIcon,
  Banner,
  BridgeIcon,
  Carousel,
  CoinsIcon,
  Exchange2Icon,
  ExchangeIcon,
  OverviewIcon,
  PendingIcon,
  SettingsIcon,
  SwapIcon,
} from '@/components';
import { SidebarMenu } from '@/layouts/dashboard/menu';
import { Pages } from '@/modules/core';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';
import { VaultBox, VaultListModal } from '@/modules/vault/components';
import { useVaultInfosContext } from '@/modules/vault/hooks';
import { useWorkspaceContext } from '@/modules/workspace/hooks';
import { getBakoIDURL, getGarageURL } from '@/utils/enviroment';

interface SidebarProps extends BoxProps {
  onDrawer?: boolean;
  onClose?: () => void;
}

const Sidebar = memo(({ onDrawer, ...rest }: SidebarProps) => {
  const {
    screenSizes: { isLargerThan1210 },
  } = useWorkspaceContext();
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    AutoPlay({ delay: 4000, playOnInit: true }),
  ]);

  const {
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

  const handleNavigate = (to: To, options?: NavigateOptions) => {
    setSelectedTransaction({});
    route.navigate(to, options);
  };

  const handleOpenDrawer = useCallback(() => drawer.onOpen(), [drawer]);

  const bakoUrl = useMemo(() => getBakoIDURL(), []);

  return (
    <Box
      w="full"
      maxW={isLargerThan1210 ? '220px' : 'full'}
      bgColor={onDrawer ? 'transparent' : 'bg.panel'}
      position="sticky"
      top={0}
      h="dvh"
      {...rest}
    >
      <VStack p={4} h="full" gap={4}>
        <Flex>
          <Image src={logo} alt="Bako" w="75px" h="75px" />
        </Flex>

        {/* VAULT Modal LIST */}
        <VaultListModal
          open={drawer.isOpen}
          onOpenChange={drawer.onOpenChange}
          onCloseAll={() => {
            drawer.onClose();
            rest.onClose?.();
          }}
          vaultId={route.params.vaultId!}
        />

        {/*/!* VAULT INFOS *!/*/}
        <VaultBox
          name={vault?.data.name}
          address={vault?.data?.predicateAddress ?? ''}
          onChangeVault={handleOpenDrawer}
        />

        {/* MENU */}
        <SidebarMenu.List w="100%" gap={4}>
          <SidebarMenu.Container
            isActive={menuItems.overview}
            onClick={() =>
              handleNavigate(
                Pages.detailsVault({
                  workspaceId: route.params.workspaceId!,
                  vaultId: route.params.vaultId!,
                }),
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
              handleNavigate(
                Pages.vaultBalance({
                  workspaceId: route.params.workspaceId!,
                  vaultId: route.params.vaultId!,
                }),
              )
            }
          >
            <SidebarMenu.Icon as={CoinsIcon} isActive={menuItems.balance} />
            <SidebarMenu.Title isActive={menuItems.balance}>
              Assets
            </SidebarMenu.Title>
          </SidebarMenu.Container>

          <SidebarMenu.Container
            isActive={menuItems.bridge}
            onClick={() =>
              handleNavigate(
                Pages.bridge({
                  workspaceId: route.params.workspaceId!,
                  vaultId: route.params.vaultId!,
                }),
              )
            }
          >
            <SidebarMenu.Icon as={BridgeIcon} isActive={false} />
            <SidebarMenu.Title isActive={menuItems.bridge}>
              Bridge
            </SidebarMenu.Title>
          </SidebarMenu.Container>

          <SidebarMenu.Container
            isActive={menuItems.buySell}
            id={'buy-sell_tab_sidebar'}
            onClick={() =>
              handleNavigate(
                Pages.vaultBuySell({
                  workspaceId: route.params.workspaceId!,
                  vaultId: route.params.vaultId!,
                }),
              )
            }
          >
            <SidebarMenu.Icon as={Exchange2Icon} isActive={menuItems.buySell} />
            <SidebarMenu.Title isActive={menuItems.buySell}>
              Buy / Sell Crypto
            </SidebarMenu.Title>
          </SidebarMenu.Container>

          <SidebarMenu.Container
            isActive={menuItems.swap}
            id={'swap_tab_sidebar'}
            onClick={() =>
              handleNavigate(
                Pages.vaultSwap({
                  workspaceId: route.params.workspaceId!,
                  vaultId: route.params.vaultId!,
                }),
              )
            }
          >
            <SidebarMenu.Icon as={SwapIcon} isActive={menuItems.swap} />
            <SidebarMenu.Title isActive={menuItems.swap}>
              Swap
            </SidebarMenu.Title>
          </SidebarMenu.Container>

          <SidebarMenu.Container
            isActive={menuItems.transactions}
            id={'transactions_tab_sidebar'}
            cursor={'pointer'}
            onClick={() =>
              handleNavigate(
                Pages.transactions({
                  workspaceId: route.params.workspaceId!,
                  vaultId: route.params.vaultId!,
                }),
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
              <Icon as={PendingIcon} w={3} />{' '}
              {isPendingSigner && pendingSignerTransactionsLength}
            </SidebarMenu.Badge>
          </SidebarMenu.Container>

          <SidebarMenu.Container
            isActive={menuItems.settings}
            id={'settings_tab_sidebar'}
            onClick={() =>
              handleNavigate(
                Pages.vaultSettings({
                  workspaceId: route.params.workspaceId!,
                  vaultId: route.params.vaultId!,
                }),
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
                icon={<Icon as={BakoIcon} boxSize="20px" />}
                title="Get your Handle"
                description={
                  <>
                    Use{' '}
                    <Text color="primary.main" as="span">
                      @myusername
                    </Text>{' '}
                    as your address.
                  </>
                }
                href={bakoUrl}
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
});

Sidebar.displayName = 'Sidebar';

export { Sidebar };
