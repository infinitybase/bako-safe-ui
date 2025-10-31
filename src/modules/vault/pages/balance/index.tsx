import { Flex, Tabs } from 'bako-ui';

import { CustomSkeleton } from '@/components';
import { EmptyState } from '@/components/emptyState';
import { AssetsBalanceList, NFT, NftsBalanceList } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { NFTsEmptyState } from '../../components/NFTsEmptyState';
import { useVaultInfosContext } from '../../hooks';

const VaultBalancePage = () => {
  const { vault, assets } = useVaultInfosContext();
  const {
    authDetails: { userInfos },
  } = useWorkspaceContext();

  if (!vault) return null;

  return (
    <Flex w="full" direction="column" flex={1}>
      <Flex w="full" direction="column" flex={1}>
        <Tabs.Root variant="subtle" defaultValue="tokens" lazyMount>
          <Tabs.List gap={3}>
            <Tabs.Trigger value="tokens">Tokens</Tabs.Trigger>
            <Tabs.Trigger value="nft">NFTs</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="tokens">
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

          <Tabs.Content value="nft">
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
