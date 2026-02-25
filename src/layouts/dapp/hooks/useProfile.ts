import { useFuel } from '@fuels/react';
import { AddressUtils as BakoAddressUtils, TypeUser } from 'bakosafe';
import { useCallback, useMemo } from 'react';

import { useWorkspaceContext } from '@/modules';
import { AddressUtils } from '@/modules/core';
import { EConnectors } from '@/modules/core/hooks/fuel/useListConnectors';
import { formatAddressByUserType } from '@/utils';

export const useProfile = () => {
  const {
    authDetails: { userInfos, handlers },
  } = useWorkspaceContext();
  const { fuel } = useFuel();

  const isWebAuthn = useMemo(
    () => userInfos?.type.type === TypeUser.WEB_AUTHN,
    [userInfos?.type.type],
  );

  const getUserAddress = useCallback(() => {
    if (!userInfos?.address) return '';

    if (isWebAuthn) return userInfos?.name;

    if (userInfos?.type.type === TypeUser.SOCIAL) {
      const formattedAddress = formatAddressByUserType(
        userInfos.address,
        userInfos.type.type,
      );
      return AddressUtils.format(formattedAddress, 10);
    }

    if (BakoAddressUtils.isEvm(userInfos.address)) {
      return AddressUtils.format(
        BakoAddressUtils.parseFuelAddressToEth(userInfos.address),
        15,
      );
    }

    return AddressUtils.format(userInfos?.address, 4);
  }, [userInfos?.address, userInfos?.name, userInfos?.type.type, isWebAuthn]);

  const logout = useCallback(async () => {
    try {
      userInfos?.type.type === TypeUser.FUEL &&
        userInfos?.type.name !== EConnectors.FULLET &&
        (await fuel.disconnect());

      // eslint-disable-next-line no-empty
    } catch {
    } finally {
      handlers.logout?.();
    }
  }, [userInfos?.type.type, userInfos?.type.name, fuel, handlers]);

  return { userInfos, isWebAuthn, getUserAddress, logout };
};
