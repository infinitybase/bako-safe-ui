import { TypeUser } from 'bakosafe';
import { useState } from 'react';

import { EFuelConnectorsTypes } from '@/modules/core/hooks';

export enum UserConnectorCompatibilityState {
  CHECKING = 'checking',
  COMPATIBLE = 'compatible',
  INCOMPATIBLE = 'incompatible',
}

/**
 * Hook to check compatibility between connector type and user type.
 */
export const useUserConnectorCompatibility = () => {
  const [compatibilityState, setCompatibilityState] =
    useState<UserConnectorCompatibilityState>(
      UserConnectorCompatibilityState.CHECKING,
    );

  const checkCompatibility = (
    connectorType: string,
    userType: TypeUser,
  ): boolean => {
    switch (userType) {
      case TypeUser.SOCIAL:
        return (
          connectorType === EFuelConnectorsTypes.BAKO ||
          connectorType === EFuelConnectorsTypes.SOCIAL
        );

      case TypeUser.EVM:
        return (
          connectorType === EFuelConnectorsTypes.BAKO ||
          connectorType === EFuelConnectorsTypes.EVM
        );

      case TypeUser.FUEL:
      case TypeUser.WEB_AUTHN:
        return connectorType === EFuelConnectorsTypes.BAKO;

      default:
        return false;
    }
  };

  return { compatibilityState, setCompatibilityState, checkCompatibility };
};
