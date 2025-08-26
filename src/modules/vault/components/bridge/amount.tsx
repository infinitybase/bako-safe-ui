import { Button, Card, HStack, Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

import { InputAmount } from './inputAmount';

export interface AmountBridgeProps {
  symbol: string;
  stepsForm: number;
  setStepsForm: React.Dispatch<React.SetStateAction<number>>;
}

const MotionBox = motion(VStack);

export function AmountBrigde({
  symbol,
  stepsForm,
  setStepsForm,
}: AmountBridgeProps) {
  //const { control } = useFormContext<ITransferBridgePayload>();
  const [valueSource, setValueSource] = useState('0.000');
  const [errorAmount, setErrorAmount] = useState(false);

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
