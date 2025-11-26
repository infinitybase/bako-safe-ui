import { AssetId, BN, bn } from 'fuels';
import {
  Asset as AssetMira,
  buildPoolId,
  PoolId,
  ReadonlyMiraAmm,
} from 'mira-dex-ts';

import { Asset, PredicateAndWorkspace, PredicateMember } from '..';
import { IPredicate } from '../core/hooks/bakosafe/utils/types';
import { BridgeStepsForm } from './components/bridge/utils';
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

/**
 * @description Generic function to calculate Y position for carousel vertical effect
 * Keeps the steps stacked vertically, centering the current step
 * @param stepIndex The step to get the Y position for
 * @param currentIndex The current step
 * @param getHeightForStep Function that returns the height for each step
 * @param gap Gap between cards (default: 8px)
 * @returns The Y position for the step
 */
const calculateCarouselYPosition = (
  stepIndex: number,
  currentIndex: number,
  getHeightForStep: (step: number) => number,
  gap = 8,
): number => {
  // If current step, position is 0 (centered)
  if (stepIndex === currentIndex) return 0;

  let yPosition = 0;

  if (stepIndex < currentIndex) {
    // Steps above the current step
    yPosition = -(getHeightForStep(currentIndex) / 2 + gap);

    // Sum heights of cards between step and current (from closest to farthest)
    for (let i = currentIndex - 1; i > stepIndex; i--) {
      yPosition -= getHeightForStep(i) + gap;
    }

    // Subtract half the height of the step itself
    yPosition -= getHeightForStep(stepIndex) / 2;
  } else {
    // Steps below the current step
    yPosition = getHeightForStep(currentIndex) / 2 + gap;

    // Sum heights of cards between current and step (from closest to farthest)
    for (let i = currentIndex + 1; i < stepIndex; i++) {
      yPosition += getHeightForStep(i) + gap;
    }

    // Add half the height of the step itself
    yPosition += getHeightForStep(stepIndex) / 2;
  }

  return yPosition;
};

/**
 * @description Calculates the Y position for each bridge step
 * @param step The bridge step to get the Y position for
 * @param stepForm The current step of the bridge form
 * @returns The Y position for the step
 */
export const getYPositionForBridgeStep = (
  step: BridgeStepsForm,
  stepForm: BridgeStepsForm,
): number => {
  const collapsedHeight = 88;

  const getHeightForStep = (stepNum: BridgeStepsForm): number => {
    if (stepNum === BridgeStepsForm.FROM) return collapsedHeight;
    if (stepNum === BridgeStepsForm.TO) return collapsedHeight;
    if (stepNum === BridgeStepsForm.AMOUNT) {
      return stepForm === BridgeStepsForm.AMOUNT ? 248 : collapsedHeight;
    }
    if (stepNum === BridgeStepsForm.DESTINATION) {
      return stepForm === BridgeStepsForm.DESTINATION ? 246 : collapsedHeight;
    }
    if (stepNum === BridgeStepsForm.RESUME) {
      return stepForm >= BridgeStepsForm.RESUME ? 305 : collapsedHeight;
    }
    return collapsedHeight;
  };

  return calculateCarouselYPosition(step, stepForm, getHeightForStep);
};

/**
 * @description Calculates the Y position for each swap step
 * @param step The swap step to get the Y position for
 * @param currentStep The current step of the swap
 * @returns The Y position for the step
 */
export const getYPositionForSwapStep = (
  step: number,
  currentStep: number,
): number => {
  const collapsedHeight = 88;

  const getHeightForStep = (stepNum: number): number => {
    if (stepNum === 0) {
      // SELECT_SELL - expanded has input
      return currentStep === 0 ? 200 : collapsedHeight;
    }
    if (stepNum === 1) {
      // SELECT_BUY - expanded has input
      return currentStep === 1 ? 200 : collapsedHeight;
    }
    if (stepNum === 2) {
      // RESUME - expanded has review info
      return currentStep === 2 ? 242 : collapsedHeight;
    }
    return collapsedHeight;
  };

  return calculateCarouselYPosition(step, currentStep, getHeightForStep);
};

const CHAR_WIDTH_MAP = {
  '0': 20,
  '1': 12,
  '2': 20,
  '3': 20,
  '4': 20,
  '5': 20,
  '6': 20,
  '7': 20,
  '8': 20,
  '9': 20,
  '.': 10,
  ',': 10,
  ' ': 8,
} as const;

const MIN_WIDTH = 80;
const MIN_WIDTH_WITHOUT_VALUE = 150;
const SYMBOL_PADDING = 60;

export const calculateTextWidth = (text: string): number => {
  // Fallback to '0.000' if text is empty
  const displayText = text || '0.000';

  let width = 0;
  for (let i = 0; i < displayText.length; i++) {
    const char = displayText[i] as keyof typeof CHAR_WIDTH_MAP;
    width += CHAR_WIDTH_MAP[char] || 20;
  }

  const min = text.length === 0 ? MIN_WIDTH_WITHOUT_VALUE : MIN_WIDTH;

  return Math.max(min, width + SYMBOL_PADDING);
};

export const getSignaturesCount = (vault: PredicateAndWorkspace): number => {
  try {
    const { SIGNATURES_COUNT } =
      typeof vault.configurable === 'string'
        ? JSON.parse(vault.configurable)
        : vault.configurable;
    return SIGNATURES_COUNT ?? 1;
  } catch (error) {
    console.error('Failed to parse vault configurable:', error);
    return 0;
  }
};
