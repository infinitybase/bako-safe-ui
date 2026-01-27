import { api } from '@/config/api';

import { getPredicateByAddress, getPredicateByAddressResponse } from './types';

export class ExportWallet {
  static async getByAddress(params: getPredicateByAddress) {
    const { data } = await api.get<getPredicateByAddressResponse>(
      `/predicate/by-address/${params.address}`,
    );

    const config = data.configurable ? JSON.parse(data.configurable) : {};

    return {
      ...data,
      config,
      version: data.version,
    };
  }
}
