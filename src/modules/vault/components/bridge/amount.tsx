import { Button, Card, HStack, Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { bn } from 'fuels';
import { useCallback, useMemo, useState } from 'react';

import { Asset } from '@/modules/core';

import { useFormBridge } from '../../hooks/bridge';
import { InputAmount } from './inputAmount';

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
  const [errorAmount, setErrorAmount] = useState(false);
  const { assetFrom, form, amount, assetFromUSD } = useFormBridge();
  const fee = 0.000003205;

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

      const balanceTreated = Number(balance.replace(/,/g, ''));
      const valueTreated = Number(value.replace(/,/g, ''));
      const insufficientBalance = valueTreated > balanceTreated;
      setErrorAmount(insufficientBalance);

      const removeStep =
        (valueTreated === 0 || insufficientBalance) && stepsForm > 1;

      if (removeStep) {
        setStepsForm(1);
        return;
      }

      const addNewStep =
        valueTreated > 0 && !insufficientBalance && stepsForm === 1;
      if (addNewStep) setStepsForm(2);
    },
    [form, balance, stepsForm, setStepsForm],
  );

  const handleMinAmount = useCallback(() => {
    if (!balance || balance === '0') {
      form.setValue('amount', '0');
      return;
    }

    const amount = fee + 0.00000001;
    form.setValue('amount', amount.toString());

    if (stepsForm === 1) setStepsForm(2);
  }, [form, balance, stepsForm, setStepsForm]);

  const handleMaxAmount = useCallback(() => {
    if (!balance || balance === '0') {
      form.setValue('amount', '0');
      return;
    }

    const balanceTreated = balance.replace(/,/g, '');

    const amount = Number(balanceTreated) - fee;
    form.setValue('amount', amount.toString());

    if (stepsForm === 1) setStepsForm(2);
  }, [form, balance, stepsForm, setStepsForm]);

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
          <Text color="#868079" fontSize={12} fontWeight={400}>
            Amount
          </Text>
          <HStack flex={1} justifyContent="flex-end">
            <Text color="#868079" fontSize={12} fontWeight={400}>
              Balance: {balance + ' ' + symbol}
            </Text>
          </HStack>
        </HStack>

        <InputAmount
          symbol={symbol}
          value={amount}
          onChange={handleSourceChange}
          disabled={false} //maxFee === 0 || maxFee == undefined}
        />

        <HStack justifyContent="center" mb={{ base: 2, md: 4 }}>
          <Text color="#868079" fontSize={12} fontWeight={400}>
            {assetFromUSD}
          </Text>
        </HStack>
        <HStack justifyContent="center" gap={2}>
          <Button
            maxH="28px"
            minW="48px"
            isDisabled={false} //maxFee === 0 || maxFee == undefined}
            variant="secondary"
            borderRadius={6}
            padding={'4px 6px 4px 6px'}
            fontSize={10}
            fontWeight={500}
            onClick={() => handleMinAmount()}
          >
            <Text color="#868079">MIN</Text>
          </Button>
          <Button
            maxH="28px"
            minW="48px"
            isDisabled={false} //maxFee === 0 || maxFee == undefined}
            variant="secondary"
            onClick={() => handleMaxAmount()} //handleSetCurrencyAmount(50, balance)}
            borderRadius={6}
            padding={'4px 6px 4px 6px'}
            fontSize={10}
            fontWeight={500}
          >
            <Text color="#868079">MAX</Text>
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
              Insufficient balance for this operation!
            </Text>
          )}
        </HStack>
      </Card>
    </MotionBox>
  );
}
