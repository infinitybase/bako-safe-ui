import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  HStack,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { RiMenuUnfoldLine } from 'react-icons/ri';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { HomeIcon } from '@/components';
import { Drawer } from '@/layouts/dashboard/drawer';
import { Pages } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { Container } from '../../components/buy-sell';
import { BuyTabPanel } from '../../components/buy-sell/BuyTabPanel';
import { SellTabPanel } from '../../components/buy-sell/SellTabPanel';
import { useVaultInfosContext } from '../../VaultInfosProvider';

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

  const currentTabIndex = (params.get('type') || 'buy') === 'buy' ? 0 : 1;

  const handleTabChange = (i: number) => {
    const tab = i === 0 ? 'buy' : 'sell';
    setSearchParams({ type: tab });
  };

  return (
    <Flex w="full" direction="column">
      <Drawer isOpen={menuDrawer.isOpen} onClose={menuDrawer.onClose} />

      <HStack mb={8} w="full" justifyContent="space-between">
        {vaultRequiredSizeToColumnLayout ? (
          <HStack gap={1.5} onClick={menuDrawer.onOpen}>
            <Icon as={RiMenuUnfoldLine} fontSize="xl" color="grey.200" />
            <Text fontSize="sm" fontWeight="normal" color="grey.100">
              Menu
            </Text>
          </HStack>
        ) : (
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                onClick={() => goHome()}
              >
                <Icon mr={2} as={HomeIcon} fontSize="sm" color="grey.200" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                href="#"
              >
                Vaults
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink
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
                isTruncated
                maxW={640}
              >
                {vault.data?.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                href="#"
              >
                Buy & Sell
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        )}
      </HStack>

      <Container>
        <Tabs
          variant="solid"
          index={currentTabIndex}
          onChange={handleTabChange}
          isLazy
        >
          <TabList>
            <Tab w="full">Buy</Tab>
            <Tab w="full" isDisabled>
              <Tooltip label="Coming soon" hasArrow>
                Sell
              </Tooltip>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <BuyTabPanel vault={vault.data} isLoading={vault.isLoading} />
            </TabPanel>
            <TabPanel>
              <SellTabPanel vault={vault.data} isLoading={vault.isLoading} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Flex>
  );
};
