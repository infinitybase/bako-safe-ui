import { useEffect, useMemo } from 'react';

import { useScreenSize } from '@/modules/core';
import { tokensIDS } from '@/modules/core/utils/assets/address';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useFormBridgeContext } from '../../components/bridge/providers/FormBridgeProvider';

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

const optionsNets = [
  {
    value: 'Network ethereum',
    name: 'Ethereum Network',
    image: 'https://assets.fuel.network/providers/eth.svg',
    symbol: null,
  },
  {
    value: 'Network Fuel Ignition',
    name: 'Fuel Ignition',
    image: 'https://verified-assets.fuel.network/images/fuel.svg',
    symbol: null,
  },
  {
    value: 'Network Base',
    name: 'Base',
    image:
      'https://firebasestorage.googleapis.com/v0/b/pump-555ee.appspot.com/o/images%2Faecb0358-d860-402c-9f3c-c5b579e4eb88.jpeg?alt=media&token=b39c9a29-4b5e-4b2c-8600-62e9afff2448',
    symbol: null,
  },
];

const useFormBridge = () => {
  const { form } = useFormBridgeContext();
  const { tokensUSD } = useWorkspaceContext();
  const { isMobile } = useScreenSize();

  const { watch } = form;

  const assetFromValue = watch('selectAssetFrom');
  const assetToValue = watch('selectAssetTo');
  const assetToMobile = watch('selectAssetToMobile');
  const networkToValue = watch('selectNetworkTo');
  const destinationAddress = watch('destinationAddress');
  const amount = watch('amount');

  useEffect(() => {
    if ((!assetFromValue || assetFromValue === '') && isMobile) {
      form.setValue('selectAssetFrom', tokensIDS.ETH);
    }
  }, [assetFromValue, isMobile, form]);

  const assetFrom =
    useMemo(
      () => optionsAssets.find((a) => a.value === assetFromValue),
      [assetFromValue],
    ) ?? null;

  const networkTo = useMemo(
    () => optionsNets.find((a) => a.value === networkToValue),
    [networkToValue],
  );

  const assetFromUSD = useMemo(() => {
    if (!amount || amount === '0') return '$0';

    if (!assetFrom) return '$0';

    const usdData = tokensUSD.data[assetFrom.value];
    const usdAmount = usdData?.usdAmount ?? null;

    const txAmount = Number(amount.replace(/,/g, '')) * (usdAmount ?? 0);

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(txAmount);
  }, [amount, assetFrom, tokensUSD.data]);

  const assetTo =
    useMemo(() => {
      if (!isMobile) return assetToValue;
      return optionsAssets.find((a) => a.value === assetToMobile);
    }, [assetToMobile, assetToValue, isMobile]) ?? null;

  const isFormComplete = useMemo(() => {
    const amountTreated = Number(amount.replace(/,/g, ''));

    return (
      !!assetFromValue &&
      !!networkToValue &&
      !!destinationAddress &&
      (!!assetToValue || !!assetToMobile) &&
      amountTreated > 0
    );
  }, [
    assetFromValue,
    assetToValue,
    assetToMobile,
    amount,
    networkToValue,
    destinationAddress,
  ]);

  const onSubmit = form.handleSubmit((data) => {
    console.log('>>> Form data', data);
  });

  return {
    form,
    amount,
    assetFrom,
    assetTo,
    networkTo,
    destinationAddress,
    assetFromUSD,
    isFormComplete,
    onSubmit,
  };
};

export { useFormBridge };
