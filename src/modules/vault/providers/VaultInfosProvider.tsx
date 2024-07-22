import React, { createContext, useContext } from 'react';
import { UseVaultDetailsReturn, useVaultDetails } from '../hooks';

export type IVaultInfoContext = UseVaultDetailsReturn | null;

const VaultInfosContext = createContext<IVaultInfoContext>(null);

const VaultInfosProvider = ({ children }: { children: React.ReactNode }) => {
  const vaultDetails = useVaultDetails();

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
