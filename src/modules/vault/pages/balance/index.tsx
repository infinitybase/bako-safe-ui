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
  useDisclosure,
} from '@chakra-ui/react';
import { RiMenuUnfoldLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

import { CustomSkeleton, HomeIcon } from '@/components';
import { EmptyState } from '@/components/emptyState';
import { Drawer } from '@/layouts/dashboard/drawer';
import { AssetsBalanceList, NftsBalanceList, Pages } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useVaultInfosContext } from '../../VaultInfosProvider';

const VaultBalancePage = () => {
  const navigate = useNavigate();
  const menuDrawer = useDisclosure();
  const { vault, assets } = useVaultInfosContext();
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
              _hover={{ bg: 'gray.700' }}
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
              _hover={{ bg: 'gray.700' }}
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
                {assets.nfts?.length ? (
                  <NftsBalanceList nfts={assets.nfts!} />
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
          </TabPanels>
        </Tabs>
      </Flex>
    </Flex>
  );
};

export { VaultBalancePage };
