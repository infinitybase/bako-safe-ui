import { bn } from 'fuels';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { Asset, ICreateSwapBridgePayload } from '@/modules/core';

import { ErrorBridgeForm } from '../../components/bridge/utils';
import { useFormBridge } from './useFormBridge';

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
  //const [errorAmount, setErrorAmount] = useState<string | null>(null);
  const debouncedGetQuotesRef = useRef<ReturnType<typeof debounce>>();

  const {
    assetFrom,
    form,
    dataLimits,
    getOperationQuotes,
    prepareCreateSwapPayload,
  } = useFormBridge();

  const fuelImg = 'https://verified-assets.fuel.network/images/fuel.svg';

  const balance = useMemo(() => {
    const asset = assets?.find((a) => a.assetId === assetFrom?.value);
    if (!asset?.amount) return '0';

    return bn(asset.amount)?.format({
      units: asset.units,
    });
  }, [assets, assetFrom?.value]);

  useEffect(() => {
    debouncedGetQuotesRef.current = debounce(
      (payload: ICreateSwapBridgePayload) => {
        getOperationQuotes(payload.amount?.toString(), payload);
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

      //if (!isMobile) {
      const removeStep =
        (valueTreated === 0 || insufficientBalance) && stepsForm > 1;
      if (removeStep) {
        setStepsForm(1);
        return;
      }

      const addNewStep =
        valueTreated > 0 && !insufficientBalance && stepsForm === 1;
      if (addNewStep) setStepsForm(2);
      //}

      if (valueTreated > 0 && !insufficientBalance) {
        const payload = prepareCreateSwapPayload();
        payload.amount = Number(value);
        debouncedGetQuotesRef.current?.(payload);
      }
    },
    [
      form,
      balance,
      //isMobile,
      dataLimits.minAmount,
      stepsForm,
      setStepsForm,
      setErrorAmount,
      prepareCreateSwapPayload,
    ],
  );

  const handleMinAmount = useCallback(() => {
    setErrorAmount(null);
    const balanceTreated = Number(balance.replace(/,/g, ''));

    form.setValue('amount', dataLimits.minAmount.toString());

    if (dataLimits.minAmount > balanceTreated) {
      setErrorAmount(ErrorBridgeForm.INSUFFICIENT_BALANCE);
      if (stepsForm > 1) setStepsForm(1);
      return;
    }

    if (stepsForm === 1) setStepsForm(2);

    const payload = prepareCreateSwapPayload();
    payload.amount = dataLimits.minAmount;
    debouncedGetQuotesRef.current?.(payload);
  }, [
    form,
    balance,
    dataLimits.minAmount,
    stepsForm,
    setStepsForm,
    setErrorAmount,
    prepareCreateSwapPayload,
    debouncedGetQuotesRef,
  ]);

  const handleMaxAmount = useCallback(() => {
    setErrorAmount(null);

    const balanceTreated = Number(balance.replace(/,/g, ''));

    form.setValue('amount', dataLimits.maxAmount.toString());

    if (dataLimits.maxAmount > balanceTreated) {
      setErrorAmount(ErrorBridgeForm.INSUFFICIENT_BALANCE);
      if (stepsForm > 1) setStepsForm(1);
      return;
    }

    if (stepsForm === 1) setStepsForm(2);

    const payload = prepareCreateSwapPayload();
    payload.amount = dataLimits.maxAmount;
    debouncedGetQuotesRef.current?.(payload);
  }, [
    form,
    balance,
    dataLimits.maxAmount,
    stepsForm,
    setStepsForm,
    setErrorAmount,
    debouncedGetQuotesRef,
    prepareCreateSwapPayload,
  ]);

  return {
    balance,
    fuelImg,
    handleSourceChange,
    handleMinAmount,
    handleMaxAmount,
  };
};

export { useAmountBridge };
