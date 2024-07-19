import React, { createContext, useContext } from 'react';
import { UseVaultDetailsReturn, useVaultDetails } from '../hooks';

import { useFilterTxType } from '@/modules/transactions/hooks/filter';
import { useGetParams } from '@/modules';

export type IVaultInfoContext = UseVaultDetailsReturn | null;

const VaultInfosContext = createContext<IVaultInfoContext>(null);

const VaultInfosProvider = ({ children }: { children: React.ReactNode }) => {
  const { txFilterType } = useFilterTxType();

  const {
    vaultPageParams: { vaultId, workspaceId },
  } = useGetParams();

  const vaultDetails: IVaultInfoContext = useVaultDetails({
    byMonth: true,
    txFilterType,
    vaultId: vaultId ?? '',
    workspaceId: workspaceId ?? '',
  });

  return (
    <VaultInfosContext.Provider value={vaultDetails}>
      {children}
    </VaultInfosContext.Provider>
  );
};

const useVaultInfosContext = () => {
  const context = useContext(VaultInfosContext);
  if (!context) {
    throw new Error(
      'useVaultInfosContext must be used within VaultInfosProvider',
    );
  }

  return context;
};

export { VaultInfosProvider, useVaultInfosContext };
