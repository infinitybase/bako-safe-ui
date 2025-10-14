import {
  Box,
  Button,
  Card,
  HStack,
  IconButton,
  Image,
  Text,
  VStack,
} from 'bako-ui';

import { LeftAndRightArrow } from '@/components';
import { Asset } from '@/modules/core';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';
import { useAmountBridge, useFormBridge } from '@/modules/vault/hooks/bridge';

import { InputAmount } from '../inputAmount';
import { SelectNetworkDrawerBridge } from './selectNetworkDrawer';

export interface AmountBridgeMobileProps {
  assets?: Required<Asset>[];
  errorAmount?: string | null;
  setErrorAmount: React.Dispatch<React.SetStateAction<string | null>>;
  stepsForm: number;
  setStepsForm: React.Dispatch<React.SetStateAction<number>>;
}

export function AmountBrigdeMobile({
  assets,
  errorAmount,
  setErrorAmount,
  stepsForm,
  setStepsForm,
}: AmountBridgeMobileProps) {
  const selectNetworkDrawer = useDisclosure();
  const { assetFrom, form, amount, assetFromUSD, dataLimits } = useFormBridge();

  const {
    balance,
    fuelImg,
    handleSourceChange,
    handleMaxAmount,
    handleMinAmount,
  } = useAmountBridge({ stepsForm, setStepsForm, assets, setErrorAmount });

  return (
    <Card.Root
      variant="outline"
      padding={3}
      paddingBottom={1}
      w={'full'}
      overflow="visible"
      position="relative"
    >
      <SelectNetworkDrawerBridge
        isOpen={selectNetworkDrawer.isOpen}
        onClose={selectNetworkDrawer.onClose}
        form={form}
      />
      <HStack w="full" justifyContent={'space-between'} align="start">
        <Text color="grey.425" fontSize={12} fontWeight={400}>
          From
        </Text>
        <VStack justifyContent="flex-end" gap={0} p={1}>
          <HStack w={'full'} align="center" justifyContent="flex-end">
            <Image src={fuelImg} boxSize={4} />
            <Text color="grey.50" fontSize={12} fontWeight={400}>
              {'Fuel Ignition'}
            </Text>
            <IconButton
              variant="plain"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="grey.50"
              boxSize="14px"
              minW="10px"
              fontSize={14}
              px={0}
              aria-label="Bridge"
              onClick={() => selectNetworkDrawer.onOpen()}
            >
              <LeftAndRightArrow />
            </IconButton>
          </HStack>
          <Text color="grey.425" fontSize={12} fontWeight={400}>
            Balance:{' '}
            {balance + ' ' + (assetFrom?.symbol ? assetFrom.symbol : 'ETH')}
          </Text>
        </VStack>
      </HStack>

      <Box maxW={{ base: '300px', md: '350px' }} alignSelf={'center'}>
        <InputAmount
          symbol={assetFrom?.symbol ?? ''}
          value={amount}
          onChange={handleSourceChange}
          disabled={false}
        />
      </Box>

      <HStack justifyContent="center">
        <Text color="grey.425" fontSize={12} fontWeight={400}>
          {assetFromUSD}
        </Text>
      </HStack>
      <HStack justifyContent="center" gap={2} align="flex-end" height={'100%'}>
        <Button
          maxH="28px"
          minW="48px"
          disabled={!dataLimits.minAmount}
          variant="outline"
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
          disabled={!dataLimits.maxAmount}
          variant="outline"
          onClick={handleMaxAmount}
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
          base: 14,
        }}
      >
        {!!errorAmount && (
          <Text color="red.500" fontSize={10}>
            {errorAmount}
          </Text>
        )}
      </HStack>
    </Card.Root>
  );
}
