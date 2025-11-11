import { Network } from 'fuels';

import { availableNetWorks, NetworkType } from '@/modules/network/services';

import { AssetItemBrigdeProps } from './modalSelectNetwork';

export interface AssetFormItem extends AssetItemBrigdeProps {
  tokens?: {
    symbol: string;
    decimals: number;
    logo: string;
  }[];
}

export enum ErrorBridgeForm {
  QUOTE = 'Error on get quotes',
  LIMIT = 'Error on get limits',
  DESTINATION = 'Error on get destinations',
  INSUFFICIENT_BALANCE = 'Insufficient balance for this operation!',
  INSUFFICIENT_AMOUNT = 'Insufficient min amount for this operation!',
}

export enum TitleButtonsForm {
  CONTINUE = 'Continue to resume',
  BRIDGE = 'Bridge',
  PENDING_TX = 'Pending transaction',
  INSUFFICIENT_ETH = 'Bridge more ETH to pay gas',
}

export const optionsAssetsFuel = [
  {
    symbol: 'USDC',
    name: 'USDC',
    description: 'Token',
    image:
      'https://prodlslayerswapbridgesa.blob.core.windows.net/layerswap/currencies/usdc.png',
    value: '0x286c479da40dc953bddc3bb4c453b608bba2e0ac483b077bd475174115395e6b',
    decimals: 6,
  },
  {
    symbol: 'USDT',
    description: 'Token',
    name: 'USDT',
    image:
      'https://prodlslayerswapbridgesa.blob.core.windows.net/layerswap/currencies/usdt.png',
    value: '0xa0265fb5c32f6e8db3197af3c7eb05c48ae373605b8165b6f4a51c5b0ba4812e',
    decimals: 6,
  },
  {
    symbol: 'FUEL',
    description: 'Token',
    name: 'FUEL',
    image:
      'https://prodlslayerswapbridgesa.blob.core.windows.net/layerswap/currencies/fuel.png',
    value: '0x1d5d97005e41cae2187a895fd8eab0506111e0e2f3331cd3912c15c24e3c1d82',
    decimals: 9,
  },
  {
    symbol: 'ETH',
    description: 'Token',
    name: 'Ethereum',
    image:
      'https://prodlslayerswapbridgesa.blob.core.windows.net/layerswap/currencies/eth.png',
    value: '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07',
    decimals: 9,
  },
];

export const optionsNets = [
  {
    value: 'Network ethereum',
    description: 'Network',
    name: 'Ethereum Network',
    image: 'https://assets.fuel.network/providers/eth.svg',
    symbol: null,
  },
  {
    value: 'Network Fuel Ignition',
    description: 'Network',
    name: 'Fuel Ignition',
    image: 'https://verified-assets.fuel.network/images/fuel.svg',
    symbol: null,
  },
  {
    value: 'Network Base',
    description: 'Network',
    name: 'Base',
    image:
      'https://firebasestorage.googleapis.com/v0/b/pump-555ee.appspot.com/o/images%2Faecb0358-d860-402c-9f3c-c5b579e4eb88.jpeg?alt=media&token=b39c9a29-4b5e-4b2c-8600-62e9afff2448',
    symbol: null,
  },
];

export function getFuelAssetsByNetwork(network: Network) {
  const isMainnet = network.url === availableNetWorks[NetworkType.MAINNET].url;

  if (isMainnet) return optionsAssetsFuel;

  return optionsAssetsFuel.filter(
    (a) => a.symbol === 'ETH' || a.name === 'USDC',
  );
}

export function formatEstimativeTime(duration: string): string {
  const [, mm, ssMs] = duration.split(':');
  const [ss, ms] = ssMs.split('.');

  let minutes = parseInt(mm, 10);
  let seconds = parseInt(ss, 10);

  if (parseInt(ms, 10) >= 5000000) {
    seconds += 1;
  }

  if (seconds >= 60) {
    seconds -= 60;
    minutes += 1;
  }

  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} and ${seconds} second${seconds !== 1 ? 's' : ''}`;
  }

  return `${seconds} second${seconds !== 1 ? 's' : ''}`;
}

export enum BridgeStepsForm {
  FROM = 0,
  TO = 1,
  AMOUNT = 2,
  DESTINATION = 3,
  RESUME = 4,
}

export const checkBridgeStep = (
  currentStep: BridgeStepsForm,
  stepToCheck: BridgeStepsForm,
) => {
  return currentStep === stepToCheck;
};

export const isInitialBridgeStep = (currentStep: BridgeStepsForm) => {
  return currentStep === BridgeStepsForm.FROM;
};

export const isToBridgeStep = (currentStep: BridgeStepsForm) => {
  return currentStep === BridgeStepsForm.TO;
};

export const isAmountBridgeStep = (currentStep: BridgeStepsForm) => {
  return currentStep === BridgeStepsForm.AMOUNT;
};

export const isDestinationBridgeStep = (currentStep: BridgeStepsForm) => {
  return currentStep === BridgeStepsForm.DESTINATION;
};

export const isFinalBridgeStep = (currentStep: BridgeStepsForm) => {
  return currentStep === BridgeStepsForm.RESUME;
};
