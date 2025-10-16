import { Breadcrumb, Flex, HStack, Icon, Tabs, Text, Tooltip } from 'bako-ui';
import { RiMenuUnfoldLine } from 'react-icons/ri';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { HomeIcon } from '@/components';
import { Drawer } from '@/layouts/dashboard/drawer';
import { Pages } from '@/modules/core';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { Container } from '../../components/buy-sell';
import { BuyTabPanel } from '../../components/buy-sell/BuyTabPanel';
import { SellTabPanel } from '../../components/buy-sell/SellTabPanel';
import { useVaultInfosContext } from '../../hooks';

export const VaultBuySellPage = () => {
  const navigate = useNavigate();
  const [params, setSearchParams] = useSearchParams();
  const menuDrawer = useDisclosure();
  const { vault } = useVaultInfosContext();
  const {
    authDetails: { userInfos },
    workspaceInfos: {
      handlers: { goHome },
    },
    screenSizes: { vaultRequiredSizeToColumnLayout },
  } = useWorkspaceContext();

  const currentTab = params.get('type') || 'buy';

  const handleTabChange = (i: number) => {
    const tab = i === 0 ? 'buy' : 'sell';
    setSearchParams({ type: tab });
  };

  return (
    <Flex w="full" direction="column">
      <Drawer open={menuDrawer.isOpen} onOpenChange={menuDrawer.onOpenChange} />

      <HStack mb={8} w="full" justifyContent="space-between">
        {vaultRequiredSizeToColumnLayout ? (
          <HStack gap={1.5} onClick={menuDrawer.onOpen}>
            <Icon as={RiMenuUnfoldLine} w={6} color="grey.200" />
            <Text fontSize="sm" fontWeight="normal" color="grey.100">
              Menu
            </Text>
          </HStack>
        ) : (
          <Breadcrumb.Root>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link
                  fontSize="sm"
                  color="grey.200"
                  fontWeight="semibold"
                  onClick={() => goHome()}
                >
                  <Icon mr={2} as={HomeIcon} w={3} color="grey.200" />
                  Home
                </Breadcrumb.Link>
              </Breadcrumb.Item>

              <Breadcrumb.Item>
                <Breadcrumb.Link
                  fontSize="sm"
                  color="grey.200"
                  fontWeight="semibold"
                  href="#"
                >
                  Vaults
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />

              <Breadcrumb.Item>
                <Breadcrumb.Link
                  fontSize="sm"
                  color="grey.200"
                  fontWeight="semibold"
                  onClick={() =>
                    navigate(
                      Pages.detailsVault({
                        vaultId: vault?.data?.id,
                        workspaceId: userInfos.workspace?.id ?? '',
                      }),
                    )
                  }
                  truncate
                  maxW={640}
                >
                  {vault.data?.name}
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Link
                  fontSize="sm"
                  color="grey.200"
                  fontWeight="semibold"
                  href="#"
                >
                  Buy & Sell
                </Breadcrumb.Link>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
        )}
      </HStack>

      <Container>
        <Tabs.Root
          // variant="solid"
          value={currentTab}
          onValueChange={(e) => handleTabChange(Number(e.value))}
          lazyMount
        >
          <Tabs.List>
            <Tabs.Trigger value="buy" w="full">
              Buy
            </Tabs.Trigger>
            <Tabs.Trigger value="sell" w="full" disabled>
              <Tooltip content="Coming soon">Sell</Tooltip>
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="buy">
            <BuyTabPanel vault={vault.data} isLoading={vault.isLoading} />
          </Tabs.Content>
          <Tabs.Content value="sell">
            <SellTabPanel vault={vault.data} isLoading={vault.isLoading} />
          </Tabs.Content>
        </Tabs.Root>
      </Container>
    </Flex>
  );
};
