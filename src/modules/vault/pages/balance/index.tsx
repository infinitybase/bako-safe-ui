import { Breadcrumb, Flex, HStack, Icon, Tabs, Text } from 'bako-ui';
import { RiMenuUnfoldLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

import { CustomSkeleton, HomeIcon } from '@/components';
import { EmptyState } from '@/components/emptyState';
import { Drawer } from '@/layouts/dashboard/drawer';
import { AssetsBalanceList, NFT, NftsBalanceList, Pages } from '@/modules/core';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { NFTsEmptyState } from '../../components/NFTsEmptyState';
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
  const workspaceId = userInfos.workspace?.id ?? '';

  if (!vault) return null;

  return (
    <Flex w="full" direction="column">
      <Drawer open={menuDrawer.isOpen} onOpenChange={menuDrawer.onOpenChange} />

      <HStack mb={8} w="full" justifyContent="space-between">
        {vaultRequiredSizeToColumnLayout ? (
          <HStack gap={1.5} onClick={menuDrawer.onOpen}>
            <Icon as={RiMenuUnfoldLine} fontSize="xl" color="grey.200" />
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
              <Breadcrumb.Separator />

              {/* Commented out code to temporarily disable workspaces. */}

              {/* {!userInfos.onSingleWorkspace && (
              <Breadcrumb.Item>
                <Breadcrumb.Link
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
                </Breadcrumb.Link>
              </Breadcrumb.Item>
            )} */}

              <Breadcrumb.Item>
                <Breadcrumb.Link
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
                  Balance
                </Breadcrumb.Link>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
        )}
      </HStack>

      <Flex w="full" direction="column" flex={1}>
        <Tabs.Root defaultValue="tokens" lazyMount>
          <Tabs.List borderBottom="1px solid #333" paddingBottom={'2px'}>
            <Tabs.Trigger
              value="tokens"
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
            </Tabs.Trigger>
            <Tabs.Trigger
              value="nft"
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
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="tokens" px={-4}>
            <CustomSkeleton
              loading={userInfos.isLoading && assets.isLoading}
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
          </Tabs.Content>

          <Tabs.Content value="nft" px={-4}>
            <CustomSkeleton
              loading={userInfos.isLoading && assets.isLoading}
              flex={1}
            >
              {assets.nfts?.length ? (
                <NftsBalanceList nfts={assets.nfts as NFT[]} />
              ) : (
                <NFTsEmptyState />
              )}
            </CustomSkeleton>
          </Tabs.Content>
        </Tabs.Root>
      </Flex>
    </Flex>
  );
};

export { VaultBalancePage };
