import { useFuel } from '@fuels/react';
import { TypeUser } from 'bakosafe';

import { useContactToast } from '@/modules/addressBook';
import { localStorageKeys, useQueryParams } from '@/modules/auth';
import { EConnectors } from '@/modules/core/hooks/fuel/useListConnectors';
import { PredicateAndWorkspace } from '@/modules/vault';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useGetCurrentVaultInDappTxRequest } from './useGetCurrentVaultRequest';

const useVerifyConnections = () => {
  const {
    authDetails: {
      userInfos: { type },
      handlers,
    },
  } = useWorkspaceContext();

  const { sessionId, name } = useQueryParams();
  const { warningToast } = useContactToast();
  const { fuel } = useFuel();
  const requestVault = useGetCurrentVaultInDappTxRequest();

  const logout = async () => {
    try {
      type.type === TypeUser.FUEL &&
        type.name !== EConnectors.FULLET &&
        (await fuel.disconnect());
    } catch (error) {
      // eslint-disable-next-line no-empty
    } finally {
      await handlers.logout?.();

      const dappName = name?.includes('MIRA') ? 'MIRA' : name;

      warningToast({
        title: 'Check account failed',
        description: `Please use the same account you are logged in dapp ${dappName}!`,
      });
    }
  };

  const handleForceLogout = (
    vaultDapp: string,
    vaults: PredicateAndWorkspace[],
  ) => {
    const findVault = vaults.find(
      (vault) => vault.predicateAddress === vaultDapp,
    );

    if (!findVault) {
      logout();
      localStorage.removeItem(localStorageKeys.SELECTED_NETWORK);
      return;
    }
  };

  const verifyisSameConnections = (vaults: PredicateAndWorkspace[]) => {
    requestVault.mutate(sessionId!, {
      onSuccess: (data) => {
        handleForceLogout(data, vaults);
      },
    });
  };

  return {
    verifyisSameConnections,
  };
};

export { useVerifyConnections };
