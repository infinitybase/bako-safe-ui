import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { AssetItem } from '../../components/bridge';

export interface ITransferBridgePayload {
  selectNetworkFrom: string;
  selectAssetFrom: string;
  selectNetworkTo: string;
  selectAssetTo: AssetItem | null;
  selectAssetToMobile: string;
  destinationAddress: string;
  amount: string;
  searchAsset: string;
}

const optionsAssets = [
  {
    value: '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07',
    name: 'ETH',
    image: 'https://assets.fuel.network/providers/eth.svg',
    symbol: 'ETH',
  },
  {
    value: '0x1d5d97005e41cae2187a895fd8eab0506111e0e2f3331cd3912c15c24e3c1d82',
    name: 'FUEL',
    image: 'https://verified-assets.fuel.network/images/fuel.svg',
    symbol: 'FUEL',
  },
  {
    value: 'USDC',
    name: 'USDC',
    image:
      'https://firebasestorage.googleapis.com/v0/b/pump-555ee.appspot.com/o/images%2Faecb0358-d860-402c-9f3c-c5b579e4eb88.jpeg?alt=media&token=b39c9a29-4b5e-4b2c-8600-62e9afff2448',
    symbol: 'USDC',
  },
];

const useFormBridge = () => {
  const form = useForm<ITransferBridgePayload>({
    defaultValues: {
      selectNetworkFrom: '',
      selectAssetFrom: '',
      selectNetworkTo: '',
      selectAssetTo: null,
      searchAsset: '',
    },
  });

  const { watch } = form;

  const assetFromValue = watch('selectAssetFrom');
  const assetTo = watch('selectAssetTo');
  const networkToValue = watch('selectNetworkTo');

  const assetFrom =
    useMemo(
      () => optionsAssets.find((a) => a.value === assetFromValue),
      [assetFromValue],
    ) ?? null;

  const networkTo = useMemo(
    () => optionsAssets.find((a) => a.value === networkToValue),
    [networkToValue],
  );

  const onSubmit = form.handleSubmit((data) => {
    console.log('Form data', data);
  });

  return {
    form,
    assetFrom,
    assetTo,
    networkTo,
    onSubmit,
  };
};

export { useFormBridge };
