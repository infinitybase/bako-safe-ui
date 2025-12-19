import { useMemo } from 'react';

const START_DATE = '2025-06-20T00:00:00.000Z';
const DECIMALS = 1e9;
const DAYS_PER_YEAR = 365;
const START_RATE = 1.0;

export function useAPY(rate?: string) {
  const apy = useMemo(() => {
    try {
      const rateNumber = Number(rate);

      if (isNaN(rateNumber)) {
        return 0;
      }

      // This represents how much stFUEL you get per FUEL (should be < 1.0 and decreasing)
      // We need to invert it to get FUEL per stFUEL (redemption rate, should be > 1.0 and increasing)
      const invertedRate = rateNumber / DECIMALS;

      // Check for edge case where rate could be zero from contract
      if (invertedRate <= 0) {
        return 0;
      }

      const currentRate = 1 / invertedRate; // Invert to get FUEL per stFUEL

      // The exchange rate started at 1.0 on June 20, 2025
      const startDate = new Date(START_DATE);
      const currentDate = new Date();
      const daysSinceStart =
        (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

      // If not started or invalid data
      if (daysSinceStart <= 0 || currentRate <= START_RATE) {
        return 0;
      }

      // Calculate the growth from 1.0 to current rate
      const totalGrowth = currentRate - START_RATE;

      // Calculate daily growth rate
      const dailyRate = totalGrowth / daysSinceStart;

      // Annualize the rate
      // APR = (daily rate × days per year) / starting rate × 100
      const apr = ((dailyRate * DAYS_PER_YEAR) / START_RATE) * 100;

      return apr;
    } catch (error) {
      console.error('Error calculating APY: ', error);
      return 0;
    }
  }, [rate]);

  return {
    apyValue: apy.toFixed(2),
  };
}
