import { MarketplaceContract } from '@garage/sdk';
import { useMemo } from 'react';

import { useBakoSafeVault } from '@/modules/core';
import { useVaultInfosContext } from '@/modules/vault/VaultInfosProvider';

export const useGarage = () => {
  const { vault } = useVaultInfosContext();

  const { vault: vaultSafe } = useBakoSafeVault({
    address: vault?.data?.predicateAddress,
    provider: vault?.data?.provider,
    id: vault?.data?.id,
  });

  const marketplace = useMemo(
    () => MarketplaceContract.create(vaultSafe!),
    [vaultSafe],
  );

  return marketplace;
};
