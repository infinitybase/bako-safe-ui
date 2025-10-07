import { AssetId, BN, bn } from 'fuels';
import {
  Asset as AssetMira,
  buildPoolId,
  PoolId,
  ReadonlyMiraAmm,
} from 'mira-dex-ts';

import { Asset, PredicateMember } from '..';
import { IPredicate } from '../core/hooks/bakosafe/utils/types';
import { SwapMode } from './components/swap/Root';
import { Combination } from './hooks/swap/useAllAssetsCombination';

export const openFaucet = (vaultAddress: string) => {
  window.open(
    `${import.meta.env.VITE_FAUCET}?address=${vaultAddress}`,
    '_BLANK',
  );
};

export const ordinateMembers = (
  members?: PredicateMember[],
  owner?: IPredicate['owner'],
) => {
  if (!members || members.length === 0) return [];

  return members
    .map((member) => ({
      ...member,
      isOwner: member?.address === owner?.address,
    }))
    .sort((a, b) => (a.isOwner === b.isOwner ? 0 : a.isOwner ? -1 : 1));
};

export const valueWithoutCommas = (value: string, locale: string): string => {
  if (!value) return '0';
  if (locale === 'pt-BR') {
    // If the value contains a comma, it is likely a decimal separator in some locales.
    // Replace commas with dots and remove dots.
    return value.replace(/\./g, '').replace(/,/g, '.');
  }

  return value.replace(/,/g, '');
};

export const parseToBN = (value: string, locale: string): BN => {
  try {
    // remove all dots and replace commas with dots
    // Ex: "1.500,50" → "1500.50" or "1,500.00" → "1500.00"
    const normalizedValue = valueWithoutCommas(value, locale);

    if (!normalizedValue || normalizedValue === '.') {
      return bn(0);
    }

    return bn.parseUnits(normalizedValue);
  } catch {
    return bn(0);
  }
};

export const splitToFiat = (value: number, fiatLocale: string) => {
  if (fiatLocale === 'pt-BR') {
    const [integer, decimal] = value.toString().split('.');

    return `${integer},${decimal ?? '00'}`;
  }
  return value.toString();
};

export const BASE_ASSETS: Asset[] = [
  {
    name: 'Ethereum',
    slug: 'ETH',
    units: 9,
    assetId:
      '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07',
  },
  {
    name: 'USDC',
    slug: 'USDC',
    units: 6,
    assetId:
      '0x286c479da40dc953bddc3bb4c453b608bba2e0ac483b077bd475174115395e6b',
  },
];

export type PoolIdCombination = [Asset, Asset, PoolId, boolean];

export const getPoolIdCombinations = (
  pairs: Combination[],
): PoolIdCombination[] => {
  const seen = new Set<string>();
  const combos: PoolIdCombination[] = [];

  for (const [a, b] of pairs) {
    const stableKey = `${a.assetId}-${b.assetId}-true`;
    const volatileKey = `${a.assetId}-${b.assetId}-false`;
    const stableId = buildPoolId(a.assetId, b.assetId, true);
    const volatileId = buildPoolId(a.assetId, b.assetId, false);

    if (!seen.has(stableKey)) {
      seen.add(stableKey);
      combos.push([a, b, stableId, true]);
    }
    if (!seen.has(volatileKey)) {
      seen.add(volatileKey);
      combos.push([a, b, volatileId, false]);
    }
  }
  return combos;
};

// Check if a given pool involves the specified asset
function involvesAssetInPool(pool: PoolsWithReserve, asset: Asset): boolean {
  return (
    pool.assetA.assetId === asset.assetId ||
    pool.assetB.assetId === asset.assetId
  );
}

// Compare two pools by their poolId
function poolEquals(a: PoolsWithReserve, b: PoolsWithReserve): boolean {
  return JSON.stringify(a.poolId) === JSON.stringify(b.poolId);
}

export interface PoolsWithReserve {
  poolId: PoolId;
  reserve0?: BN;
  reserve1?: BN;
  assetA: Asset;
  assetB: Asset;
}

interface Route {
  pools: PoolsWithReserve[];
  assetIn: Asset;
  assetOut: Asset;
}

// Build up to `maxHops` routes from assetIn to assetOut through available pools
export function computeAllRoutes(
  assetIn: Asset,
  assetOut: Asset,
  pools: PoolsWithReserve[],
  maxHops = 2,
): Route[] {
  const results: Route[] = [];

  function recurse(current: Asset, path: PoolsWithReserve[], hopsLeft: number) {
    for (const p of pools) {
      if (
        !involvesAssetInPool(p, current) ||
        path.some((pp) => poolEquals(pp, p))
      ) {
        continue;
      }
      // determine the next token
      const nextToken =
        p.assetA.assetId === current.assetId ? p.assetB : p.assetA;
      const nextPath = [...path, p];

      if (nextToken.assetId === assetOut.assetId) {
        results.push({ pools: nextPath, assetIn, assetOut });
      } else if (hopsLeft > 1) {
        recurse(nextToken, nextPath, hopsLeft - 1);
      }
    }
  }

  recurse(assetIn, [], maxHops);
  return results;
}

export type SwapQuote = {
  route: Route;
  amountIn: BN;
  amountOut: BN;
  assetIdIn: AssetId;
  assetIdOut: AssetId;
  mode: SwapMode;
};

const formatSwapBatchResponse = (
  response: (AssetMira | null)[],
  mode: SwapMode,
  routes: Route[],
  isSell: boolean,
  amount: BN,
) => {
  return response
    .map((asset, i) =>
      asset
        ? {
            mode,
            route: routes[i],
            assetIdIn: { bits: routes[i].assetIn.assetId },
            assetIdOut: { bits: routes[i].assetOut.assetId },
            amountIn: isSell ? amount : asset[1],
            amountOut: isSell ? asset[1] : amount,
          }
        : null,
    )
    .filter((quote): quote is SwapQuote => quote !== null);
};

export const getSwapQuotesBatch = async (
  amount: BN,
  mode: SwapMode,
  routes: Route[],
  amm: ReadonlyMiraAmm,
  assetIn: string,
  assetOut: string,
): Promise<SwapQuote[]> => {
  if (!routes.length) return [];

  const isSell = mode === 'sell';
  const poolPaths = routes.map((r) => r.pools.map((p) => p.poolId));

  if (isSell) {
    const response = await Promise.all(
      poolPaths.map(async (pool) => {
        return amm
          .previewSwapExactInput({ bits: assetIn }, amount, pool)
          .catch(() => {
            return null;
          });
      }),
    );

    return formatSwapBatchResponse(response, mode, routes, isSell, amount);
  }

  const response = await Promise.all(
    poolPaths.map(async (pool) => {
      return amm
        .previewSwapExactOutput({ bits: assetOut }, amount, pool)
        .catch(() => {
          return null;
        });
    }),
  );

  return formatSwapBatchResponse(response, mode, routes, isSell, amount);
};

export const formatMeldEthSlug = (slug: string) => {
  return slug === 'ETH_FUEL' ? 'ETH' : slug;
};
