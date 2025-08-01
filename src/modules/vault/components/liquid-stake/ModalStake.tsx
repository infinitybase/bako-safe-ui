import {
  Box,
  Button,
  Card,
  HStack,
  Icon,
  Image,
  InputGroup,
  InputRightAddon,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useRef } from 'react';

import {
  CurrencyField,
  Dialog,
  FuelIcon,
  LeftAndRightArrow,
} from '@/components';
import { DoubtIcon } from '@/components/icons/doubt';
import { tokensIDS } from '@/modules/core/utils/assets/address';

import { useOperationLiquidStakeModal } from '../../hooks';

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
  const {
    errorNoBalance,
    valueSource,
    valueDestination,
    handleClose,
    handleSourceChange,
    handleDestinationChange,
    handleSetCurrencyAmount,
  } = useOperationLiquidStakeModal({ balance, onClose });

  // TODO: Remove this mock data and get the real data from the API
  const StFUEL_ASSET = {
    name: 'stFuel',
    slug: 'stFUEL',
    image: 'https://verified-assets.fuel.network/images/stFUEL.png',
    assetId: tokensIDS.stFUEL,
  };

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
            {errorNoBalance && (
              <Text color="red.500" fontSize="xs" mt={2}>
                {
                  'Your current Fuel tokens balance is insufficient for this operation.'
                }
              </Text>
            )}
          </Card>
          <Card variant="outline" padding={3}>
            <HStack>
              <Text color="#868079" fontSize={12}>
                You receive
              </Text>
              <HStack flex={1} justifyContent="flex-end" marginBottom={2}>
                <Image
                  src={StFUEL_ASSET.image}
                  boxSize="16px"
                  alt="stFUEL Icon"
                />
                <Text color="white" fontSize={12}>
                  stFUEL
                </Text>
              </HStack>
            </HStack>
            <InputField
              symbol="stFUEL"
              ref={inputDestinationRef}
              value={valueDestination}
              onChange={handleDestinationChange}
            />
          </Card>
          <Card variant="outline" padding={3}>
            <Text color="#868079" fontSize={12} marginBottom={6}>
              Summary
            </Text>
            <VStack>
              <HStack width="full" marginBottom={1}>
                <HStack gap={2} align={'center'}>
                  <Text color="#868079" fontSize={12} flex={1}>
                    Conversion Ratio
                  </Text>
                  <DoubtIcon fontSize={16} />
                </HStack>
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
