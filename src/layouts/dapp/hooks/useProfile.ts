import { AddressUtils as BakoAddressUtils } from "bakosafe";
import { AddressUtils } from "@/modules/core";
import { EConnectors } from "@/modules/core/hooks/fuel/useListConnectors";
import { useFuel } from "@fuels/react";
import { TypeUser, useWorkspaceContext } from "@/modules";

export const useProfile = () => {
  const {
    authDetails: { userInfos, handlers },
  } = useWorkspaceContext();
  const { fuel } = useFuel();

  const isWebAuthn = userInfos?.type.type === TypeUser.WEB_AUTHN;

  const getUserAddress = () => {
    if (BakoAddressUtils.isEvm(userInfos?.address)) {
      return AddressUtils.format(
        BakoAddressUtils.parseFuelAddressToEth(userInfos?.address),
        15
      );
    }
    return isWebAuthn
      ? userInfos?.name
      : AddressUtils.format(userInfos?.address, 4);
  };

  const logout = async () => {
    try {
      if (
        userInfos?.type.type === TypeUser.FUEL &&
        userInfos?.type.name !== EConnectors.FULLET
      ) {
        await fuel.disconnect();
      }
    } catch {
      // eslint-disable-next-line no-empty
    } finally {
      handlers.logout?.();
    }
  };

  return { userInfos, isWebAuthn, getUserAddress, logout };
}
