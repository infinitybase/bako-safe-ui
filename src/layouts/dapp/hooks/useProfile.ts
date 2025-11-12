import { useFuel } from '@fuels/react';
import { usePrivy } from '@privy-io/react-auth';
import { AddressUtils as BakoAddressUtils } from 'bakosafe';
import { useCallback, useMemo } from 'react';

import { TypeUser, useWorkspaceContext } from '@/modules';
import { AddressUtils } from '@/modules/core';
import { EConnectors } from '@/modules/core/hooks/fuel/useListConnectors';

export const useProfile = () => {
  const {
    authDetails: { userInfos, handlers },
  } = useWorkspaceContext();
  const { fuel } = useFuel();
  const { logout: privyLogout } = usePrivy();

  const isWebAuthn = useMemo(
    () => userInfos?.type.type === TypeUser.WEB_AUTHN,
    [userInfos?.type.type],
  );

  const getUserAddress = useCallback(() => {
    if (!userInfos?.address) return '';

    if (BakoAddressUtils.isEvm(userInfos.address)) {
      return AddressUtils.format(
        BakoAddressUtils.parseFuelAddressToEth(userInfos.address),
        15,
      );
    }

    return isWebAuthn
      ? userInfos?.name
      : AddressUtils.format(userInfos?.address, 4);
  }, [userInfos?.address, userInfos?.name, isWebAuthn]);

  const logout = useCallback(async () => {
    try {
      userInfos?.type.type === TypeUser.FUEL &&
        userInfos?.type.name !== EConnectors.FULLET &&
        (await fuel.disconnect());

      userInfos?.type.type === TypeUser.SOCIAL && (await privyLogout());
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      handlers.logout?.();
    }
  }, [userInfos?.type.type, userInfos?.type.name, fuel, handlers]);

  return { userInfos, isWebAuthn, getUserAddress, logout };
};
