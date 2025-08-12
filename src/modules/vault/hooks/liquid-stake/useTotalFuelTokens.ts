import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { Rig } from '@/contracts/rig/mainnet/types';
import { tokensIDS } from '@/modules/core/utils/assets/address';
import { abbreviationNumber } from '@/utils/abbreviation-number';

export const DECIMALS = 10 ** 9;

export const useTotalFuelTokens = (rig?: Rig) => {
  const { data, isLoading, isFetched, ...rest } = useQuery({
    queryKey: ['rig-total-fuel-tokens', rig],
    queryFn: async () => {
      if (rig) {
        const result = await rig?.functions
          .total_supply({ bits: tokensIDS.stFUEL })
          .get();

        const rate = (
          await rig?.functions.get_sanitized_price().get()
        )?.value.toString();

        return { total: result, rate };
      }
    },
    enabled: !!rig,
  });

  const totalFuelTokens = useMemo(() => {
    const price = Number(data?.rate || '0') / DECIMALS;
    const totalStFuelToken = Number(data?.total?.value?.toString() || '0');
    const totalFuelTokens = totalStFuelToken / price / DECIMALS;

    return abbreviationNumber(totalFuelTokens);
  }, [data]);

  const isLoadingFuelTokens = isLoading || !isFetched;

  return { data, totalFuelTokens, isLoadingFuelTokens, ...rest };
};
