import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getWithoutPreflight } from '@/utils/request';

interface StakingPool {
  pool: {
    not_bonded_tokens: string;
    bonded_tokens: string;
  };
}

interface Inflation {
  inflation: string;
}

const TOTAL_FUEL_SUPPLY = 10000000000000000000;

const BASE_SEQUENCER_API = import.meta.env.VITE_SEQUENCER_URL;

export const useAPY = () => {
  const {
    data: data,
    isLoading: isLoadingApy,
    ...rest
  } = useQuery({
    queryKey: ['rig-apy'],
    queryFn: async () => {
      const inflationResponse = await getWithoutPreflight<Inflation>(
        BASE_SEQUENCER_API + 'cosmos/mint/v1beta1/inflation',
      );

      const poolResponse = await getWithoutPreflight<StakingPool>(
        BASE_SEQUENCER_API + 'cosmos/staking/v1beta1/pool',
      );

      if (!inflationResponse) throw new Error('Error on get inflation');
      if (!poolResponse) throw new Error('Error on get pool');

      return {
        inflation: inflationResponse.inflation,
        pool: poolResponse.pool,
      };
    },
  });

  const apyValue = useMemo(() => {
    const inflation = parseFloat(data?.inflation || '0');
    const bondedTokens = parseFloat(data?.pool?.bonded_tokens || '0');

    const bondedRatio = bondedTokens / TOTAL_FUEL_SUPPLY;

    const calculatedApy = (inflation / bondedRatio) * 100;
    const validCalculatedApy = isNaN(calculatedApy) ? 0 : calculatedApy;

    return validCalculatedApy.toFixed(2);
  }, [data?.inflation, data?.pool]);

  return { apyValue, isLoadingApy, ...rest };
};
