import { createContext } from 'react';

import { useVaultDetails, UseVaultDetailsReturn } from './hooks';

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

export { VaultInfosProvider };

export default VaultInfosContext;
