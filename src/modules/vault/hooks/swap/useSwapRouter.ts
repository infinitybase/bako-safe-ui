import { useQuery } from '@tanstack/react-query';
import { bn } from 'fuels';
import { useMemo } from 'react';

import { Asset } from '@/modules/core';

import { SwapMode } from '../../components/swap/Root';
import { getSwapQuotesBatch } from '../../utils';
import { useMiraReadonly } from './useMiraReadonly';
import { useRoutablePools } from './useRoutablePools';

export enum State {
  NO_ROUTES = 'No routes available',
  LOADING = 'Loading',
  VALID = 'Valid routes found',
  ERROR = 'Error fetching routes',
  IDLE = 'Idle',
}

export const useSwapRouter = (
  mode: SwapMode,
  amount = bn(0),
  assetIn: Asset,
  assetOut: Asset,
) => {
  const amm = useMiraReadonly();

  const shouldFetch = useMemo(
    () => !!assetIn && !!assetOut && amount.gt(0),
    [assetIn, assetOut, amount],
  );

  const {
    routes,
    isLoading: routesLoading,
    isFetching,
  } = useRoutablePools(assetIn, assetOut, shouldFetch);

  const {
    data: quotes = [],
    isLoading: quotesLoading,
    isFetched,
    isFetching: isFetchingQuotes,
  } = useQuery({
    queryKey: [
      'swap-quotes',
      mode,
      amount.toString(),
      assetIn?.assetId,
      assetOut?.assetId,
      routes,
    ],

    queryFn: () =>
      getSwapQuotesBatch(
        amount,
        mode,
        routes,
        amm!,
        assetIn?.assetId,
        assetOut?.assetId,
      ),
    enabled: shouldFetch && routes.length > 0 && !!amm && !routesLoading,
    initialData: shouldFetch ? undefined : [],
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  return useMemo(() => {
    if (routesLoading || quotesLoading || isFetching || isFetchingQuotes) {
      return {
        trade: {
          state: State.LOADING,
          bestRoute: null,
        },
      };
    }

    if (!isFetched) {
      return {
        trade: {
          state: State.IDLE,
          bestRoute: null,
        },
      };
    }

    if (!quotes.length) {
      return {
        trade: {
          state: State.NO_ROUTES,
          bestRoute: null,
          error: 'No valid routes found for the given assets.',
        },
      };
    }

    const best = quotes.reduce((best, current) => {
      if (mode === 'sell') {
        return best.amountOut.gt(current.amountOut) ? best : current;
      }
      return best.amountIn.lt(current.amountIn) ? best : current;
    }, quotes[0]);

    return {
      trade: {
        state: State.VALID,
        bestRoute: best.route,
        assetIn: best.assetIdIn,
        assetOut: best.assetIdOut,
        amountIn: best.amountIn,
        amountOut: best.amountOut,
      },
    };
  }, [
    quotes,
    routesLoading,
    quotesLoading,
    mode,
    isFetched,
    isFetching,
    isFetchingQuotes,
  ]);
};
