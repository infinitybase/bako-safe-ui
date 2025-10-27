import { Container } from 'bako-ui';
import { useMemo } from 'react';

import { useBakoSafeVault } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { RootSwap } from '../../components/swap/Root';
import { useAssetsList, useVaultInfosContext } from '../../hooks';

export const VaultSwapPage = () => {
  const { vault } = useVaultInfosContext();
  const { data: bakoVault, isLoading: isLoadingVault } = useBakoSafeVault({
    id: vault?.data?.id,
    address: vault?.data?.predicateAddress,
  });
  const { assets, isLoading: isLoadingAssets } = useAssetsList({
    vault: bakoVault,
  });

  const {
    authDetails: { userInfos },
  } = useWorkspaceContext();

  const isLoading = useMemo(
    () => isLoadingAssets || isLoadingVault || vault.isLoading,
    [isLoadingAssets, isLoadingVault, vault.isLoading],
  );

  return (
    <Container w="full" px={0}>
      <RootSwap
        vault={bakoVault}
        assets={assets}
        networkUrl={userInfos?.network?.url}
        isLoadingAssets={isLoading}
      />
    </Container>
  );
};
