import { api } from '@/config/api';

import {
  ExportedWalletConfig,
  GetPredicateByAddress,
  GetPredicateByAddressResponse,
} from './types';

export class ExportWallet {
  static async getByAddress(
    params: GetPredicateByAddress,
  ): Promise<ExportedWalletConfig> {
    const { data } = await api.get<GetPredicateByAddressResponse>(
      `/predicate/by-address/${params.address}`,
    );

    const config = data.configurable ? JSON.parse(data.configurable) : {};

    return {
      config,
      version: data.version,
      name: data.name,
    };
  }
}
