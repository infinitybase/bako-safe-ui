import { MiraIcon } from '@/components';

const FEE = import.meta.env.VITE_BAKO_SWAP_FEE;
const ADDRESS = import.meta.env.VITE_BAKO_SWAP_ADDRESS;

if (!FEE) {
  throw new Error(
    'VITE_BAKO_SWAP_FEE is not defined in the environment variables',
  );
}

if (!ADDRESS) {
  throw new Error(
    'VITE_BAKO_SWAP_ADDRESS is not defined in the environment variables',
  );
}

/**
 * Bako fee percentage for swaps.
 * This is a fixed fee applied to all swaps.
 */
export const BAKO_FEE_PERCENTAGE = parseInt(FEE);

/**
 * Bako fee address for swaps.
 * This is the address where the fees are sent.
 */
export const BAKO_FEE_ADDRESS: string = ADDRESS;

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
