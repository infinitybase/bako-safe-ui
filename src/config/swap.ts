import { MiraIcon } from '@/components';

const FEE = import.meta.env.VITE_BAKO_SWAP_FEE || 1;

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

export const DEFAULT_SLIPPAGE = 1 * 100; // 1%

export enum SwapButtonTitle {
  INSUFFICIENT_BALANCE = 'Insufficient Balance',
  INSUFFICIENT_ETH_BALANCE = 'Bridge more ETH to pay for Gas',
  PENDING_TRANSACTION = 'Pending Transaction',
  SWAP = 'Swap',
}

export const miraData = {
  name: 'Mira on Microchain',
  origin: 'https://microchain.systems',
  icon: MiraIcon,
};

export const EthDecimals = 9 as const;
export const MinEthValue = 0.00015 as const;
export const MinEthValueBN = MinEthValue * 10 ** EthDecimals;
export const ETH_SLUG = 'ETH';
