import { Button, Card, HStack, Image, Text, VStack } from 'bako-ui';
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
      open={isOpen}
      onOpenChange={handleClose}
      closeOnInteractOutside={false}
      size="md"
    >
      <Dialog.Body px={4}>
        <Dialog.Header
          position={{ base: 'static', sm: 'relative' }}
          title="Stake to validator"
          mb={0}
          mt={0}
          titleSxProps={{ fontSize: 16, marginTop: { base: 5, md: 0 } }}
          onClose={handleClose}
        />
        <VStack marginTop={{ base: 5 }} marginBottom={{ base: 10 }} w="full">
          <Card.Root borderColor="bg.muted" padding={3} w="full">
            <HStack>
              <Text color="textSecondary" fontSize={12}>
                Stake amount
              </Text>
              <HStack flex={1} justifyContent="flex-end" marginBottom={2}>
                <FuelIcon borderRadius="full" boxSize="16px" />
                <Text color="textPrimary" fontSize={12}>
                  FUEL
                </Text>
              </HStack>
            </HStack>
            <HStack justifyContent="flex-end">
              <Text color="textSecondary" fontSize={12}>
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
                disabled={maxFee === 0 || maxFee == undefined}
                variant="subtle"
                onClick={() => handleSetCurrencyAmount(25, balance)}
              >
                <Text color="white">25%</Text>
              </Button>
              <Button
                disabled={maxFee === 0 || maxFee == undefined}
                variant="subtle"
                onClick={() => handleSetCurrencyAmount(50, balance)}
              >
                <Text color="white">50%</Text>
              </Button>
              <Button
                disabled={maxFee === 0 || maxFee == undefined}
                variant="subtle"
                onClick={() => handleSetCurrencyAmount(75, balance)}
              >
                <Text color="white">75%</Text>
              </Button>
              <Button
                disabled={maxFee === 0 || maxFee == undefined}
                variant="subtle"
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
          </Card.Root>
          <Card.Root borderColor="bg.muted" padding={3} w="full">
            <HStack>
              <Text color="textSecondary" fontSize={12}>
                You receive
              </Text>
              <HStack flex={1} justifyContent="flex-end" marginBottom={2}>
                <Image
                  src={StFUEL_ASSET.image}
                  boxSize="16px"
                  alt="stFUEL Icon"
                />
                <Text color="textPrimary" fontSize={12}>
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
          </Card.Root>
          <Card.Root borderColor="bg.muted" padding={3} w="full">
            <Text color="textSecondary" fontSize={12} marginBottom={6}>
              Summary
            </Text>
            <VStack p={0} gap={1}>
              <HStack width="full">
                <HStack gap={2} align={'center'}>
                  <Text color="textSecondary" fontSize={12} flex={1}>
                    Conversion Ratio
                  </Text>
                </HStack>
                <Text
                  color="textSecondary"
                  fontSize={12}
                  flex={1}
                  textAlign="right"
                >
                  1 FUEL ~ {price} stFUEL
                </Text>
              </HStack>
              <HStack width="full">
                <Text color="textSecondary" fontSize={12} flex={1}>
                  Reference APY
                </Text>
                <Text
                  color="textSecondary"
                  fontSize={12}
                  flex={1}
                  textAlign="right"
                >
                  {`${apyValue}%`}
                </Text>
              </HStack>
              <HStack width="full">
                <Text color="textSecondary" fontSize={12} flex={1}>
                  Max Transaction cost
                </Text>
                <Text
                  color="textSecondary"
                  fontSize={12}
                  flex={1}
                  textAlign="right"
                >
                  {`${maxFee} ETH`}
                </Text>
              </HStack>
            </VStack>
          </Card.Root>
        </VStack>
        <Dialog.Actions hideDivider={true} onClick={createTxLiquidStake}>
          <Button
            width="full"
            loading={isDepositing}
            disabled={
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
