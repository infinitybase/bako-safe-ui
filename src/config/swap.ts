import { MiraIcon } from '@/components';

const FEE = import.meta.env.VITE_BAKO_SWAP_FEE;

if (!FEE) {
  throw new Error(
    'VITE_BAKO_SWAP_FEE is not defined in the environment variables',
  );
}

/**
 * Bako fee percentage for swaps.
 * This is a fixed fee applied to all swaps.
 */
export const BAKO_FEE_PERCENTAGE = parseInt(FEE);

export const DEFAULT_SLIPPAGE = 0.01; // 1%

export enum SwapButtonTitle {
  PREVIEW = 'Preview',
  INSUFFICIENT_BALANCE = 'Insufficient Balance',
  SWAP = 'Swap',
}

export const miraData = {
  name: 'Mira on Microchain',
  origin: 'https://mira.ly',
  icon: MiraIcon,
};

export const EthDecimals = 9 as const;
export const MinEthValue = 0.0001 as const;
export const MinEthValueBN = MinEthValue * 10 ** EthDecimals;
