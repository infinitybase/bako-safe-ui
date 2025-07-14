import {
  Box,
  Button,
  Card,
  HStack,
  Icon,
  InputGroup,
  InputRightAddon,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';

import {
  CurrencyField,
  Dialog,
  FuelIcon,
  LeftAndRightArrow,
} from '@/components';

const InputField = ({
  symbol,
  ref,
  value,
  onChange,
  autoFocus = false,
}: {
  symbol: string;
  ref: React.RefObject<HTMLInputElement>;
  value: string;
  onChange?: (value: string) => void;
  autoFocus?: boolean;
}) => (
  <Box marginY={6} display="flex" justifyContent="center" alignItems="center">
    <InputGroup
      alignItems="center"
      justifyContent="center"
      borderBottom="1px solid"
      borderColor="grey.950"
      _hover={{
        borderColor: 'grey.200',
      }}
      px={0}
      minW="150px"
      w="fit-content"
    >
      <CurrencyField
        width="80%"
        currency="ETH_FUEL"
        textAlign="center"
        borderBottomWidth="0"
        minW={0}
        px={0}
        fontSize="3xl"
        ref={ref}
        value={value}
        onChange={(e) => onChange?.(e)}
        autoFocus={autoFocus}
      />
      <InputRightAddon alignSelf="end" color="section.200">
        {symbol}
      </InputRightAddon>
    </InputGroup>
  </Box>
);

interface ModalLiquidStakeProps {
  isOpen?: boolean;
  balance: string;
  onClose: () => void;
}

export function ModalLiquidStake({
  isOpen = false,
  balance,
  onClose,
}: ModalLiquidStakeProps) {
  const inputSourceRef = useRef<HTMLInputElement>(null);
  const inputDestinationRef = useRef<HTMLInputElement>(null);
  const [valueSource, setValueSource] = useState('0.000');
  const [valueDestination, setValueDestination] = useState('0.000');

  const handleSetCurrencyAmount = (percentage: number, balance: string) => {
    const valuePercent = (Number(balance) * percentage) / 100;

    let formattedValue = valuePercent.toFixed(9);

    const [integerPart, decimalPart = ''] = formattedValue.split('.');

    let trimmedDecimal = decimalPart;
    if (decimalPart.length > 3) {
      trimmedDecimal = decimalPart.replace(/0+$/, '');
    }

    const finalDecimal = trimmedDecimal
      .padEnd(3, '0')
      .slice(0, Math.max(3, trimmedDecimal.length));

    formattedValue = finalDecimal
      ? `${integerPart}.${finalDecimal}`
      : integerPart;

    setValueSource(formattedValue);
    handleSourceChange(formattedValue);
  };

  const handleClose = () => {
    setValueDestination('0.00');
    setValueSource('0.00');
    onClose();
  };

  // Função que converte o valor de origem e atualiza o destino
  const handleSourceChange = (newValue: string) => {
    const rate = 0.995670147;
    setValueSource(newValue);

    // Converte o valor (valor * rate)
    const sourceNumber = parseFloat(newValue) || 0;
    const destinationValue = (sourceNumber * rate).toString();

    // Remove zeros não significativos, mas garante pelo menos 3 casas
    const formattedDestination = formatMinDecimals(destinationValue, 3);
    setValueDestination(formattedDestination);
  };

  // Função que mantém o valor original, mas garante mínimo de casas decimais
  const formatMinDecimals = (value: string, minDecimals: number) => {
    if (!value.includes('.')) {
      // Se não tem parte decimal, adiciona .000
      return `${value}.${'0'.repeat(minDecimals)}`;
    }

    const [integerPart, decimalPart] = value.split('.');

    if (decimalPart.length >= minDecimals) {
      // Se já tem mais casas que o mínimo, retorna o valor original
      return value;
    } else {
      // Se tem menos, completa com zeros
      const paddedDecimal = decimalPart.padEnd(minDecimals, '0');
      return `${integerPart}.${paddedDecimal}`;
    }
  };

  return (
    <Dialog.Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnOverlayClick={false}
    >
      <Dialog.Body>
        <Dialog.Header
          position={{ base: 'static', sm: 'relative' }}
          title="Stake to validator"
          mb={0}
          mt={0}
          titleSxProps={{ fontSize: 16, marginTop: { base: 6, md: 0 } }}
          onClose={handleClose}
        />
        <VStack marginY={{ base: 10 }}>
          <Card variant="outline" padding={3}>
            <HStack>
              <Text color="#868079" fontSize={12}>
                Stake amount
              </Text>
              <HStack flex={1} justifyContent="flex-end" marginBottom={2}>
                <FuelIcon borderRadius="full" fontSize={16} />
                <Text color="white" fontSize={12}>
                  FUEL
                </Text>
                <Icon as={LeftAndRightArrow} color="grey.75" />
              </HStack>
            </HStack>
            <HStack justifyContent="flex-end">
              <Text color="#868079" fontSize={12}>
                Balance: {balance}
              </Text>
            </HStack>
            <InputField
              symbol="FUEL"
              autoFocus={true}
              ref={inputSourceRef}
              value={valueSource}
              onChange={handleSourceChange}
            />
            <HStack justifyContent="center">
              <Button
                variant="secondary"
                onClick={() => handleSetCurrencyAmount(25, balance)}
              >
                <Text color="white">25%</Text>
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleSetCurrencyAmount(50, balance)}
              >
                <Text color="white">50%</Text>
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleSetCurrencyAmount(75, balance)}
              >
                <Text color="white">75%</Text>
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleSetCurrencyAmount(100, balance)}
              >
                <Text color="white">Stake Max</Text>
              </Button>
            </HStack>
          </Card>
          <Card variant="outline" padding={3}>
            <HStack>
              <Text color="#868079" fontSize={12}>
                You receive
              </Text>
              <HStack flex={1} justifyContent="flex-end" marginBottom={2}>
                <FuelIcon borderRadius="full" fontSize={16} />
                <Text color="white" fontSize={12}>
                  stFUEL
                </Text>
              </HStack>
            </HStack>
            <InputField
              symbol="stFUEL"
              ref={inputDestinationRef}
              value={valueDestination}
            />
          </Card>
          <Card variant="outline" padding={3}>
            <Text color="#868079" fontSize={12} marginBottom={6}>
              Summary
            </Text>
            <VStack>
              <HStack width="full" marginBottom={1}>
                <Text color="#868079" fontSize={12} flex={1}>
                  Conversion Ratio
                </Text>
                <Text color="#868079" fontSize={12} flex={1} align="right">
                  1 FUEL ~ 0.99985458 stFUEL
                </Text>
              </HStack>
              <HStack width="full" marginBottom={1}>
                <Text color="#868079" fontSize={12} flex={1}>
                  Reference APY
                </Text>
                <Text color="#868079" fontSize={12} flex={1} align="right">
                  2.47%
                </Text>
              </HStack>
              <HStack width="full" marginBottom={1}>
                <Text color="#868079" fontSize={12} flex={1}>
                  Max Transaction cost
                </Text>
                <Text color="#868079" fontSize={12} flex={1} align="right">
                  $2.89
                </Text>
              </HStack>
            </VStack>
          </Card>
        </VStack>
        <Dialog.Actions hideDivider={true}>
          <Button variant="primary" width="full">
            Stake
          </Button>
        </Dialog.Actions>
      </Dialog.Body>
    </Dialog.Modal>
  );
}
