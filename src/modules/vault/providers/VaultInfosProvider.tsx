import React, { createContext, useContext } from 'react';
import { UseVaultDetailsReturn, useVaultDetails } from '../hooks';
import { useCurrentPathname } from '@/modules/core/hooks/useCurrentPathname';
import { useFilterTxType } from '@/modules/transactions/hooks/filter';

export type IVaultInfoContext = UseVaultDetailsReturn | null;

const VaultInfosContext = createContext<IVaultInfoContext>(null);

const VaultInfosProvider = ({ children }: { children: React.ReactNode }) => {
  const { txFilterType } = useFilterTxType();

  // Próximos passos: remover o useVaultState (store)
  // Usar hooks já existentes para pegar vaultId e wkId sem precisar do pathname

  const pathname = useCurrentPathname();
  const pathnameParts = pathname.split('/');
  const vaultId = pathnameParts[pathnameParts.indexOf('vault') + 1];
  const workspaceId = pathnameParts[pathnameParts.indexOf('workspace') + 1];

  const vaultDetails: IVaultInfoContext = useVaultDetails({
    byMonth: true,
    txFilterType,
    vaultId,
    workspaceId,
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
