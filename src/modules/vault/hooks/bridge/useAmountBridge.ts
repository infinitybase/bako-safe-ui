import { bn } from 'fuels';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import {
  Asset,
  ICreateSwapBridgePayload,
  IGetQuotesResponse,
} from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { ErrorBridgeForm } from '../../components/bridge/utils';
import { useFormBridge } from './useFormBridge';
import { ceilToDecimals, floorToDecimals } from '@/utils';

export interface UseAmountBridgeProps {
  stepsForm: number;
  setStepsForm: React.Dispatch<React.SetStateAction<number>>;
  assets?: Required<Asset>[];
  setErrorAmount: React.Dispatch<React.SetStateAction<string | null>>;
}

const useAmountBridge = ({
  stepsForm,
  setStepsForm,
  assets,
  setErrorAmount,
}: UseAmountBridgeProps) => {
  const debouncedGetQuotesRef = useRef<ReturnType<typeof debounce>>();

  const {
    assetFrom,
    form,
    dataLimits,
    getOperationQuotes,
    setLoadingQuote,
    prepareCreateSwapPayload,
  } = useFormBridge();

  const { assetsMap } = useWorkspaceContext();

  const fuelImg = 'https://verified-assets.fuel.network/images/fuel.svg';

  const balance = useMemo(() => {
    const asset = assets?.find((a) => a.assetId === assetFrom?.value);
    if (!asset?.amount) return '0';

    const assetsInfo = assetsMap?.[asset.assetId] ?? assetsMap?.['UNKNOWN'];

    return bn(asset.amount)?.format({
      units: assetsInfo?.units ?? assetsMap.UNKNOWN.units,
    });
  }, [assets, assetFrom?.value, assetsMap]);

  useEffect(() => {
    debouncedGetQuotesRef.current = debounce(
      async (payload: ICreateSwapBridgePayload, getMaxAmount = false) => {
        const quotes = await getOperationQuotes(
          payload.amount?.toString(),
          payload,
        );

        if (getMaxAmount && quotes) {
          handleMaxAmount(quotes, payload.amount?.toString(), payload);
        }
      },
      700,
    );

    return () => {
      debouncedGetQuotesRef.current?.cancel();
    };
  }, []);

  const handleSourceChange = useCallback(
    (value: string) => {
      form.setValue('amount', value);
      setErrorAmount(null);

      const balanceTreated = Number(balance.replace(/,/g, ''));
      const valueTreated = Number(value.replace(/,/g, ''));
      const insufficientBalance = valueTreated > balanceTreated;
      const hasMinAmount = dataLimits.minAmount
        ? valueTreated >= dataLimits.minAmount
        : !dataLimits.minAmount; // true

      if (insufficientBalance) {
        setErrorAmount(ErrorBridgeForm.INSUFFICIENT_BALANCE);
        return;
      }

      if (!hasMinAmount && !insufficientBalance && valueTreated > 0) {
        setErrorAmount(`Amount must be at least ${dataLimits.minAmount}`);
        return;
      }

      const removeStep =
        (valueTreated === 0 || insufficientBalance) && stepsForm > 1;
      if (removeStep) {
        setStepsForm(1);
        return;
      }

      const addNewStep =
        valueTreated > 0 && !insufficientBalance && stepsForm === 1;
      if (addNewStep) setStepsForm(2);

      if (valueTreated > 0 && !insufficientBalance) {
        const payload = prepareCreateSwapPayload();
        payload.amount = Number(value);
        debouncedGetQuotesRef.current?.(payload);
      }
    },
    [
      form,
      balance,
      dataLimits.minAmount,
      stepsForm,
      setStepsForm,
      setErrorAmount,
      prepareCreateSwapPayload,
    ],
  );

  const handleMinAmount = useCallback(() => {
    setErrorAmount(null);

    const balanceFixed = floorToDecimals(
      Number(balance.replace(/,/g, '')),
      assetFrom?.decimals
    );
    const minAmountFixed = ceilToDecimals(
      dataLimits.minAmount,
      assetFrom?.decimals
    );

    form.setValue('amount', minAmountFixed.toString());

    if (minAmountFixed > balanceFixed) {
      setErrorAmount(ErrorBridgeForm.INSUFFICIENT_BALANCE);
      if (stepsForm > 1) setStepsForm(1);
      return;
    }

    if (stepsForm === 1) setStepsForm(2);

    const payload = prepareCreateSwapPayload();
    payload.amount = minAmountFixed;
    debouncedGetQuotesRef.current?.(payload);
    setLoadingQuote(true);
  }, [
    form,
    balance,
    dataLimits.minAmount,
    stepsForm,
    setStepsForm,
    setErrorAmount,
    prepareCreateSwapPayload,
    debouncedGetQuotesRef,
    setLoadingQuote,
  ]);

  const handleMaxAmount = useCallback(
    (
      quotes: IGetQuotesResponse,
      amount: string | undefined,
      payload: ICreateSwapBridgePayload | undefined,
    ) => {
      setErrorAmount(null);
      const fee = quotes?.quote?.totalFee;
      if (!fee) return;

      let balanceUser = balance;

      if (Number(balanceUser) <= 0) {
        balanceUser = amount ?? '0';
      }

      const balanceTreated = Number(balanceUser.replace(/,/g, ''));

      let maxAmount = Number(balanceUser) - fee * 2;

      if (maxAmount > dataLimits.maxAmount) maxAmount = dataLimits.maxAmount;

      form.setValue('amount', maxAmount.toString());

      if (maxAmount > balanceTreated) {
        setErrorAmount(ErrorBridgeForm.INSUFFICIENT_BALANCE);
        if (stepsForm > 1) setStepsForm(1);
        return;
      }

      const payloadSwap = payload ?? prepareCreateSwapPayload();
      payloadSwap.amount = maxAmount;

      debouncedGetQuotesRef.current?.(payload);
    },
    [
      form,
      balance,
      dataLimits.maxAmount,
      stepsForm,
      setStepsForm,
      setErrorAmount,
      debouncedGetQuotesRef,
      prepareCreateSwapPayload,
    ],
  );

  const handleGetFeeBeforeMaxAmount = useCallback(async () => {
    setLoadingQuote(true);

    const balanceFixed = floorToDecimals(
      Number(balance.replace(/,/g, '')),
      assetFrom?.decimals
    );
    const minAmountFixed = ceilToDecimals(
      dataLimits.minAmount,
      assetFrom?.decimals
    );

    if (minAmountFixed > balanceFixed) {
      setErrorAmount(ErrorBridgeForm.INSUFFICIENT_AMOUNT);
      form.setValue('amount', balanceFixed.toString());
      if (stepsForm > 1) setStepsForm(1);
      return;
    }

    const payload = prepareCreateSwapPayload();
    payload.amount = balanceFixed;

    if (stepsForm === 1) setStepsForm(2);
    const getMaxAmount = true;
    await debouncedGetQuotesRef.current?.(payload, getMaxAmount);
  }, [
    balance,
    debouncedGetQuotesRef,
    form,
    dataLimits.minAmount,
    stepsForm,
    setStepsForm,
    setErrorAmount,
    prepareCreateSwapPayload,
    setLoadingQuote,
  ]);

  return {
    balance,
    fuelImg,
    handleSourceChange,
    handleMinAmount,
    handleMaxAmount,
    handleGetFeeBeforeMaxAmount,
  };
};

export { useAmountBridge };
