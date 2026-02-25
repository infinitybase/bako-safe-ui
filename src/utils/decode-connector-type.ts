import { EFuelConnectorsTypes } from '@/modules/core/hooks';

const decodeConnectorType = (connectorType: string): EFuelConnectorsTypes => {
  try {
    return decodeURIComponent(connectorType) as EFuelConnectorsTypes;
  } catch (e) {
    console.error('Failed to decode connector type: ', e);
    return '' as EFuelConnectorsTypes;
  }
};

export { decodeConnectorType };
