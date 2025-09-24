import { Button, Card, HStack, Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { bn } from 'fuels';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Asset } from '@/modules/core';

import { useFormBridge } from '../../hooks/bridge';
import { InputAmount } from './inputAmount';
import { ErrorBridgeForm } from './utils';

export interface AmountBridgeProps {
  symbol: string;
  stepsForm: number;
  setStepsForm: React.Dispatch<React.SetStateAction<number>>;
  assets?: Required<Asset>[];
}

const MotionBox = motion(VStack);

export function AmountBrigde({
  symbol,
  stepsForm,
  setStepsForm,
  assets,
}: AmountBridgeProps) {
  const [errorAmount, setErrorAmount] = useState<string | null>(null);
  const {
    assetFrom,
    form,
    amount,
    assetFromUSD,
    dataLimits,
    getOperationQuotes,
  } = useFormBridge();
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null,
  );

  const debouncedGetQuotes = useMemo(
    () =>
      debounce((value: string) => {
        getOperationQuotes(value);
      }, 700),
    [getOperationQuotes],
  );

  const balance = useMemo(() => {
    const asset = assets?.find((a) => a.assetId === assetFrom?.value);
    if (!asset?.amount) return '0';

    return bn(asset.amount)?.format({
      units: asset.units,
    });
  }, [assets, assetFrom?.value]);

  const handleSourceChange = useCallback(
    (value: string) => {
      form.setValue('amount', value);
      setErrorAmount(null);

      const balanceTreated = Number(balance.replace(/,/g, ''));
      const valueTreated = Number(value.replace(/,/g, ''));
      const insufficientBalance = valueTreated > balanceTreated;
      const hasMinAmount = valueTreated >= dataLimits.minAmount;

      if (insufficientBalance)
        setErrorAmount(ErrorBridgeForm.INSUFFICIENT_BALANCE);
      if (!hasMinAmount && !insufficientBalance && valueTreated > 0) {
        setErrorAmount(`Amount must be at least ${dataLimits.minAmount}`);
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

      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      if (valueTreated > 0 && !insufficientBalance) {
        const newTimer = setTimeout(() => {
          getOperationQuotes(value);
        }, 700);

        setDebounceTimer(newTimer);
      }
    },
    [
      form,
      balance,
      debounceTimer,
      dataLimits.minAmount,
      stepsForm,
      setStepsForm,
      getOperationQuotes,
    ],
  );

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

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
    debouncedGetQuotes(dataLimits.minAmount.toString());
  }, [
    form,
    balance,
    dataLimits.minAmount,
    stepsForm,
    setStepsForm,
    debouncedGetQuotes,
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
    debouncedGetQuotes(dataLimits.maxAmount.toString());
  }, [
    form,
    balance,
    dataLimits.maxAmount,
    stepsForm,
    setStepsForm,
    debouncedGetQuotes,
  ]);

  return (
    <MotionBox
      w={430}
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 50, opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Card
        variant="outline"
        padding={3}
        paddingBottom={1}
        w={'full'}
        overflow="visible"
        position="relative"
      >
        <HStack>
          <Text color="grey.425" fontSize={12} fontWeight={400}>
            Amount
          </Text>
          <HStack flex={1} justifyContent="flex-end">
            <Text color="grey.425" fontSize={12} fontWeight={400}>
              Balance: {balance + ' ' + symbol}
            </Text>
          </HStack>
        </HStack>

        <InputAmount
          symbol={symbol}
          value={amount}
          onChange={handleSourceChange}
          disabled={false}
        />

        <HStack justifyContent="center" mb={{ base: 2, md: 4 }}>
          <Text color="grey.425" fontSize={12} fontWeight={400}>
            {assetFromUSD}
          </Text>
        </HStack>
        <HStack justifyContent="center" gap={2}>
          <Button
            maxH="28px"
            minW="48px"
            isDisabled={false}
            variant="secondary"
            borderRadius={6}
            padding={'4px 6px 4px 6px'}
            fontSize={10}
            fontWeight={500}
            onClick={() => handleMinAmount()}
          >
            <Text color="grey.425">MIN</Text>
          </Button>
          <Button
            maxH="28px"
            minW="48px"
            isDisabled={false}
            variant="secondary"
            onClick={() => handleMaxAmount()}
            borderRadius={6}
            padding={'4px 6px 4px 6px'}
            fontSize={10}
            fontWeight={500}
          >
            <Text color="grey.425">MAX</Text>
          </Button>
        </HStack>
        <HStack
          h={{
            base: 8,
            sm: 6,
          }}
          pt={1}
        >
          {!!errorAmount && (
            <Text color="red.500" fontSize="xs">
              {errorAmount}
            </Text>
          )}
        </HStack>
      </Card>
    </MotionBox>
  );
}
