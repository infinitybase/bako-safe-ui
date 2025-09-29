import { Button, Card, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';

import { Dialog, FuelIcon } from '@/components';
import { tokensIDS } from '@/modules/core/utils/assets/address';

import { useOperationLiquidStakeModal } from '../../hooks';
import { InputField } from './InputField';

interface ModalLiquidStakeProps {
  isOpen?: boolean;
  balance: string;
  apyValue: string;
  price: number;
  notEnoughBalanceETH: boolean;
  onClose: () => void;
}

export function ModalLiquidStake({
  isOpen = false,
  balance,
  apyValue,
  price,
  notEnoughBalanceETH,
  onClose,
}: ModalLiquidStakeProps) {
  const balanceTreated = Number(balance.replace(/,/g, ''));
  const {
    errorAmount,
    valueSource,
    valueDestination,
    isDepositing,
    maxFee,
    handleClose,
    handleSourceChange,
    handleDestinationChange,
    handleSetCurrencyAmount,
    createTxLiquidStake,
    calculateFee,
  } = useOperationLiquidStakeModal({ balance: balanceTreated, onClose });

  useEffect(() => {
    if (maxFee === 0 && balanceTreated > 0) {
      calculateFee();
    }
  }, [calculateFee, maxFee, balanceTreated]);

  const StFUEL_ASSET = {
    name: 'stFuel',
    slug: 'stFUEL',
    image: 'https://verified-assets.fuel.network/images/stFUEL.png',
    assetId: tokensIDS.stFUEL,
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
          titleSxProps={{ fontSize: 16, marginTop: { base: 5, md: 0 } }}
          onClose={handleClose}
        />
        <VStack marginTop={{ base: 5 }} marginBottom={{ base: 10 }}>
          <Card variant="outline" padding={3}>
            <HStack>
              <Text color="grey.250" fontSize={12}>
                Stake amount
              </Text>
              <HStack flex={1} justifyContent="flex-end" marginBottom={2}>
                <FuelIcon borderRadius="full" fontSize={16} />
                <Text color="white" fontSize={12}>
                  FUEL
                </Text>
              </HStack>
            </HStack>
            <HStack justifyContent="flex-end">
              <Text color="grey.425" fontSize={12}>
                Balance: {balance}
              </Text>
            </HStack>
            <InputField
              symbol="FUEL"
              value={valueSource}
              onChange={handleSourceChange}
              disabled={maxFee === 0 || maxFee == undefined}
            />
            <HStack justifyContent="center">
              <Button
                isDisabled={maxFee === 0 || maxFee == undefined}
                variant="secondary"
                onClick={() => handleSetCurrencyAmount(25, balance)}
              >
                <Text color="white">25%</Text>
              </Button>
              <Button
                isDisabled={maxFee === 0 || maxFee == undefined}
                variant="secondary"
                onClick={() => handleSetCurrencyAmount(50, balance)}
              >
                <Text color="white">50%</Text>
              </Button>
              <Button
                isDisabled={maxFee === 0 || maxFee == undefined}
                variant="secondary"
                onClick={() => handleSetCurrencyAmount(75, balance)}
              >
                <Text color="white">75%</Text>
              </Button>
              <Button
                isDisabled={maxFee === 0 || maxFee == undefined}
                variant="secondary"
                onClick={() => handleSetCurrencyAmount(100, balance)}
              >
                <Text color="white">Stake Max</Text>
              </Button>
            </HStack>
            <HStack
              h={{
                base: 8,
                sm: 6,
              }}
              pt={2}
            >
              {!!errorAmount && (
                <Text color="red.500" fontSize="xs">
                  {errorAmount}
                </Text>
              )}
            </HStack>
          </Card>
          <Card variant="outline" padding={3}>
            <HStack>
              <Text color="grey.250" fontSize={12}>
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
              value={valueDestination}
              onChange={handleDestinationChange}
              disabled={maxFee === 0 || maxFee == undefined}
            />
          </Card>
          <Card variant="outline" padding={3}>
            <Text color="grey.250" fontSize={12} marginBottom={6}>
              Summary
            </Text>
            <VStack p={0} gap={1}>
              <HStack width="full">
                <HStack gap={2} align={'center'}>
                  <Text color="grey.250" fontSize={12} flex={1}>
                    Conversion Ratio
                  </Text>
                </HStack>
                <Text color="grey.250" fontSize={12} flex={1} align="right">
                  1 FUEL ~ {price} stFUEL
                </Text>
              </HStack>
              <HStack width="full">
                <Text color="grey.250" fontSize={12} flex={1}>
                  Reference APY
                </Text>
                <Text color="grey.250" fontSize={12} flex={1} align="right">
                  {`${apyValue}%`}
                </Text>
              </HStack>
              <HStack width="full">
                <Text color="grey.250" fontSize={12} flex={1}>
                  Max Transaction cost
                </Text>
                <Text color="grey.250" fontSize={12} flex={1} align="right">
                  {`${maxFee} ETH`}
                </Text>
              </HStack>
            </VStack>
          </Card>
        </VStack>
        <Dialog.Actions hideDivider={true} onClick={createTxLiquidStake}>
          <Button
            variant="primary"
            width="full"
            isLoading={isDepositing}
            isDisabled={
              isDepositing ||
              !!errorAmount ||
              Number(valueSource) <= 0 ||
              notEnoughBalanceETH
            }
          >
            Stake
          </Button>
        </Dialog.Actions>
      </Dialog.Body>
    </Dialog.Modal>
  );
}
