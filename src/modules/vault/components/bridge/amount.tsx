import { Button, Card, HStack, Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { ITransferBridgePayload } from '../../hooks/bridge';
import { InputAmount } from './inputAmount';

export interface AmountBridgeProps {
  stepsForm: number;
  setStepsForm: React.Dispatch<React.SetStateAction<number>>;
}

const MotionBox = motion(VStack);

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

export function AmountBrigde({ stepsForm, setStepsForm }: AmountBridgeProps) {
  const { control } = useFormContext<ITransferBridgePayload>();
  const [valueSource, setValueSource] = useState('0.000');
  const [errorAmount, setErrorAmount] = useState(false);

  const assetFromValue = useWatch({
    control,
    name: 'selectAssetFrom',
  });

  const symbol =
    useMemo(
      () => optionsAssets.find((a) => a.value === assetFromValue)?.symbol,
      [assetFromValue],
    ) ?? '';

  const handleSourceChange = (value: string) => {
    console.log('value', value);
    setValueSource(value);

    const removeStep = (Number(value) === 0 || errorAmount) && stepsForm > 1;

    if (removeStep) {
      setStepsForm(1);
      return;
    }

    const addNewStep = Number(value) > 0 && !errorAmount && stepsForm === 1;
    if (addNewStep) setStepsForm(2);
  };

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
              Balance: {'5.458 ' + symbol}
            </Text>
          </HStack>
        </HStack>

        <InputAmount
          symbol={symbol}
          value={valueSource}
          onChange={handleSourceChange}
          disabled={false} //maxFee === 0 || maxFee == undefined}
        />

        <HStack justifyContent="center" mb={{ base: 2, md: 4 }}>
          <Text color="#868079" fontSize={12} fontWeight={400}>
            {'$ 00,00'}
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
            //onClick={() => handleSetCurrencyAmount(25, balance)}
          >
            <Text color="#868079">MIN</Text>
          </Button>
          <Button
            maxH="28px"
            minW="48px"
            isDisabled={false} //maxFee === 0 || maxFee == undefined}
            variant="secondary"
            onClick={() => {
              setErrorAmount(!errorAmount);
            }} //handleSetCurrencyAmount(50, balance)}
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
              {/* {errorAmount} */}
              Error na quantidde amount, insuficiente, tente outra coisa!
            </Text>
          )}
        </HStack>
      </Card>
    </MotionBox>
  );
}
