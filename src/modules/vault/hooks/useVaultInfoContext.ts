import { useContext } from 'react';

import VaultInfosContext from '../VaultInfosProvider';

export const useVaultInfosContext = () => {
  const context = useContext(VaultInfosContext);
  if (!context) {
    throw new Error(
      'useVaultInfosContext must be used within VaultInfosProvider',
    );
  }

  return context;
};
