import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Grid,
  HStack,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';
import { RiMenuUnfoldLine } from 'react-icons/ri';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

import { CustomSkeleton, HomeIcon } from '@/components';
import { EmptyState } from '@/components/emptyState';
import { Drawer } from '@/layouts/dashboard/drawer';
import { AssetsBalanceList, NFT, NftsBalanceList, Pages } from '@/modules/core';
import ListedOrderCard from '@/modules/garage/components/ListedOrderCard';
import { useListAssets } from '@/modules/garage/hooks';
import { useListInfiniteOrdersByAddress } from '@/modules/garage/hooks/useListInfiniteOrdersByAddress';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { NFTsEmptyState } from '../../components/NFTsEmptyState';
import { useVaultInfosContext } from '../../VaultInfosProvider';

const VaultBalancePage = () => {
  const navigate = useNavigate();
  const menuDrawer = useDisclosure();
  const { vault, assets } = useVaultInfosContext();
  const { assets: tokenList } = useListAssets();
  const { orders, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useListInfiniteOrdersByAddress({
      sellerAddress: vault?.data?.predicateAddress,
    });
  const { ref, inView } = useInView();

  const {
    authDetails: { userInfos },
    workspaceInfos: {
      handlers: {
        // handleWorkspaceSelection,
        goHome,
      },
    },
    screenSizes: { vaultRequiredSizeToColumnLayout },
  } = useWorkspaceContext();
  const workspaceId = userInfos.workspace?.id ?? '';

  const userOrders = useMemo(
    () => orders?.pages?.flatMap((page) => page.data) ?? [],
    [orders],
  );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!vault) return null;

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

            {/* Commented out code to temporarily disable workspaces. */}

            {/* {!userInfos.onSingleWorkspace && (
              <BreadcrumbItem>
                <BreadcrumbLink
                  fontSize="sm"
                  color="grey.200"
                  fontWeight="semibold"
                  onClick={() =>
                    
                  (
                      userInfos.workspace?.id,
                      Pages.workspace({
                        workspaceId: userInfos.workspace?.id,
                      }),
                    )
                  }
                  maxW={40}
                  isTruncated
                >
                  {userInfos.workspace?.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )} */}

            <BreadcrumbItem>
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                onClick={() =>
                  navigate(
                    Pages.userVaults({
                      workspaceId,
                    }),
                  )
                }
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
                Balance
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        )}
      </HStack>

      <Flex w="full" direction="column" flex={1}>
        <Tabs isLazy>
          <TabList borderBottom="1px solid #333" paddingBottom={'2px'}>
            <Tab
              _selected={{
                bg: 'white',
                color: 'black',
              }}
              px={5}
              py={2}
              borderTopLeftRadius="lg"
              borderTopRightRadius="lg"
            >
              Tokens
            </Tab>
            <Tab
              _selected={{
                bg: 'white',
                color: 'black',
              }}
              px={5}
              py={2}
              borderTopLeftRadius="lg"
              borderTopRightRadius="lg"
            >
              NFT
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={-4}>
              <CustomSkeleton
                isLoaded={!userInfos.isLoading && !assets.isLoading}
                flex={1}
              >
                {assets.hasAssets ? (
                  <AssetsBalanceList assets={assets.assets!} />
                ) : (
                  <EmptyState
                    showAction={false}
                    title="No Data available"
                    subTitle="Currently, there is no available data to display in this section."
                    h="full"
                  />
                )}
              </CustomSkeleton>
            </TabPanel>

            <TabPanel px={-4}>
              <CustomSkeleton
                isLoaded={!userInfos.isLoading && !assets.isLoading}
                flex={1}
              >
                {assets.nfts && assets.nfts?.length > 0 && (
                  <NftsBalanceList
                    nfts={assets.nfts as NFT[]}
                    assets={tokenList}
                  />
                )}

                {userOrders.length > 0 && (
                  <Grid
                    mt={6}
                    gap={4}
                    templateColumns={{
                      base: 'repeat(2, 1fr)',
                      xs: 'repeat(3, 1fr)',
                      sm: 'repeat(4, 1fr)',
                      md: 'repeat(5, 1fr)',
                      xl: 'repeat(5, 1fr)',
                      '2xl': 'repeat(6, 1fr)',
                    }}
                  >
                    {userOrders.map((order) => (
                      <ListedOrderCard
                        key={order.id}
                        order={order}
                        withHandle={true}
                        assets={tokenList}
                      />
                    ))}
                  </Grid>
                )}

                <Box ref={ref} h="1px" w="full" />

                {assets.nfts?.length === 0 && userOrders.length === 0 && (
                  <NFTsEmptyState />
                )}
              </CustomSkeleton>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Flex>
  );
};

export { VaultBalancePage };
