import { TypeUser } from 'bakosafe';

import { EFuelConnectorsTypes } from '@/modules/core/hooks/fuel/useListConnectors';

/**
 * Hook to check compatibility between connector type and user type.
 * @returns Object with checkCompatibility function that validates whether the connector is compatible with the user type.
 */
export const useUserConnectorCompatibility = () => {
  const checkCompatibility = (
    connectorType: string,
    userType: TypeUser,
  ): boolean => {
    switch (userType) {
      case TypeUser.SOCIAL:
        return connectorType === EFuelConnectorsTypes.SOCIAL;

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

  return { checkCompatibility };
};
