import { api } from '@/config/api';

import { GetPredicateByAddress, GetPredicateByAddressResponse } from './types';

export class ExportWallet {
  static async getByAddress(params: GetPredicateByAddress) {
    const { data } = await api.get<GetPredicateByAddressResponse>(
      `/predicate/by-address/${params.address}`,
    );

    const config = data.configurable ? JSON.parse(data.configurable) : {};

    return {
      config,
      name: data.name,
    };
  }
}
