import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  HStack,
  Icon,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState<'assets' | 'nfts'>('assets');
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

  const hasAssets = assets.hasAssets || assets.nfts?.length;

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
        <Flex borderBottom="1px solid #333" w="full" mb={5}>
          <Flex gap={2}>
            <Box
              px={5}
              py={2}
              fontSize="sm"
              cursor="pointer"
              borderTopLeftRadius="lg"
              borderTopRightRadius="lg"
              bg={activeTab === 'assets' ? 'white' : '#201F1D'}
              color={activeTab === 'assets' ? 'black' : 'white'}
              onClick={() => setActiveTab('assets')}
            >
              Tokens
            </Box>
            <Box
              px={5}
              py={2}
              fontSize="sm"
              cursor="pointer"
              borderTopLeftRadius="lg"
              borderTopRightRadius="lg"
              bg={activeTab === 'nfts' ? 'white' : '#201F1D'}
              color={activeTab === 'nfts' ? 'black' : 'white'}
              onClick={() => setActiveTab('nfts')}
            >
              NFT
            </Box>
          </Flex>
        </Flex>

        <CustomSkeleton
          isLoaded={!userInfos.isLoading && !assets.isLoading}
          flex={1}
        >
          {activeTab === 'assets' ? (
            hasAssets ? (
              <AssetsBalanceList assets={assets.assets!} />
            ) : (
              <EmptyState
                showAction={false}
                title="No Data available"
                subTitle="Currently, there is no available data to display in this section."
                h="full"
              />
            )
          ) : hasAssets ? (
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
      </Flex>
    </Flex>
  );
};

export { VaultBalancePage };
