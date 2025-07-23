import { useCallback, useEffect, useState } from 'react';

import { Rig } from '@/contracts/rig/mainnet/types';
import { tokensIDS } from '@/modules/core/utils/assets/address';

interface UseGetInfosCardLiquidStakeProps {
  rigContract?: Rig;
}

interface StakingPool {
  pool: {
    not_bonded_tokens: string;
    bonded_tokens: string;
  };
}

interface Inflation {
  inflation: string;
}

const SEQUENCER_URL = import.meta.env.VITE_SEQUENCER_URL!;
const TOTAL_FUEL_SUPPLY = 10000000000000000000;
const ST_FUEL_TOKEN_ID = tokensIDS.stFUEL;
export const DECIMALS = 10 ** 9;

const useGetInfosCardLiquidStake = ({
  rigContract,
}: UseGetInfosCardLiquidStakeProps) => {
  const [apyValue, setApyValue] = useState<string>('0');
  const [isLoadingApy, setIsLoadingApy] = useState<boolean>(false);
  const [totalFuelTokens, setTotalFuelTokens] = useState<string>('-');
  const [isLoadingFuelTokens, setIsLoadingFuelTokens] =
    useState<boolean>(false);

  const fetchAPYData = async () => {
    setIsLoadingApy(true);
    try {
      const inflationResponse = await fetch(
        `${SEQUENCER_URL}/cosmos/mint/v1beta1/inflation`,
      );
      const inflationData: Inflation = await inflationResponse.json();

      const poolResponse = await fetch(
        `${SEQUENCER_URL}/cosmos/staking/v1beta1/pool`,
      );
      const poolData: StakingPool = await poolResponse.json();

      const inflation = parseFloat(inflationData.inflation);
      const bondedTokens = parseFloat(poolData.pool.bonded_tokens);

      const bondedRatio = bondedTokens / TOTAL_FUEL_SUPPLY;

      const calculatedApy = (inflation / bondedRatio) * 100;

      setApyValue(calculatedApy.toFixed(2));
      setIsLoadingApy(false);
    } catch (err) {
      console.error('error on fetchAPYData');
    } finally {
      setIsLoadingApy(false);
    }
  };

  function formatBigNumberLabel(value: number | string): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;

    const TRILLION = 1_000_000_000_000;
    const BILLION = 1_000_000_000;
    const MILLION = 1_000_000;

    if (num >= TRILLION) {
      return `${Math.floor(num / TRILLION)} tri`;
    }

    if (num >= BILLION) {
      return `${Math.floor(num / BILLION)} bi`;
    }

    return `${Math.floor(num / MILLION)} mi`;
  }

  const fetchTotalFuelTokens = useCallback(async () => {
    setIsLoadingFuelTokens(true);
    if (!rigContract) {
      throw new Error('rigContract is not defined');
    }

    try {
      const result = await rigContract.functions
        .total_supply({ bits: ST_FUEL_TOKEN_ID })
        .get();

      const rate = (
        await rigContract.functions.get_sanitized_price().get()
      ).value.toString();
      const totalStFuelToken = Number(result?.value?.toString());

      const price = Number(rate) / DECIMALS;
      const totalFuelTokens = totalStFuelToken / price / DECIMALS;

      const fuelTokens = formatBigNumberLabel(totalFuelTokens);
      setTotalFuelTokens(fuelTokens);
    } catch (error) {
      console.error('error fetchTotalFuelTokens', error);
    } finally {
      setIsLoadingFuelTokens(false);
    }
  }, [rigContract]);

  useEffect(() => {
    fetchAPYData();
  }, []);

  useEffect(() => {
    fetchTotalFuelTokens();
  }, [rigContract, fetchTotalFuelTokens]);

  return { apyValue, isLoadingApy, totalFuelTokens, isLoadingFuelTokens };
};

export { useGetInfosCardLiquidStake };
