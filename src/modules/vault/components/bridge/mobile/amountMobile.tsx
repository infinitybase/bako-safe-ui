import {
  Box,
  Button,
  Card,
  HStack,
  IconButton,
  Image,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { bn } from 'fuels';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { LeftAndRightArrow } from '@/components';
import { Asset } from '@/modules/core';
import { useFormBridge } from '@/modules/vault/hooks/bridge';

import { InputAmount } from '../inputAmount';
import { ErrorBridgeForm } from '../utils';
import { SelectNetworkDrawerBridge } from './selectNetworkDrawer';

export interface AmountBridgeMobileProps {
  assets?: Required<Asset>[];
  errorAmount?: string | null;
  setErrorAmount: React.Dispatch<React.SetStateAction<string | null>>;
}

export function AmountBrigdeMobile({
  assets,
  errorAmount,
  setErrorAmount,
}: AmountBridgeMobileProps) {
  const selectNetworkDrawer = useDisclosure();
  const {
    assetFrom,
    form,
    amount,
    assetFromUSD,
    dataLimits,
    getOperationQuotes,
  } = useFormBridge();
  const fuelImg = 'https://verified-assets.fuel.network/images/fuel.svg';
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null,
  );

  const balance = useMemo(() => {
    const asset = assets?.find((a) => a.assetId === assetFrom?.value);

    if (!asset?.amount) return '0';

    const balance = bn(asset.amount)?.format({
      units: asset.units,
    });

    return balance;
  }, [assets, assetFrom?.value]);

  const debouncedGetQuotes = useMemo(
    () =>
      debounce((value: string) => {
        getOperationQuotes(value);
      }, 700),
    [getOperationQuotes],
  );

  const handleSourceChange = useCallback(
    (value: string) => {
      form.setValue('amount', value);
      setErrorAmount(null);
      const balanceTreated = Number(balance.replace(/,/g, ''));
      const valueTreated = Number(value.replace(/,/g, ''));
      const insufficientBalance = valueTreated > balanceTreated;
      const hasMinAmount = valueTreated >= (dataLimits.minAmount ?? 0);

      if (insufficientBalance) {
        setErrorAmount(ErrorBridgeForm.INSUFFICIENT_BALANCE);
        return;
      }

      if (!hasMinAmount && !insufficientBalance && valueTreated > 0) {
        setErrorAmount(`Amount must be at least ${dataLimits.minAmount}`);
      }

      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      if (valueTreated > 0) {
        const newTimer = setTimeout(() => {
          getOperationQuotes(value);
        }, 700);

        setDebounceTimer(newTimer);
      }
    },
    [
      form,
      debounceTimer,
      balance,
      dataLimits.minAmount,
      setErrorAmount,
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
      return;
    }

    debouncedGetQuotes(dataLimits.minAmount.toString());
  }, [form, balance, dataLimits.minAmount, setErrorAmount, debouncedGetQuotes]);

  const handleMaxAmount = useCallback(() => {
    setErrorAmount(null);

    const balanceTreated = Number(balance.replace(/,/g, ''));

    form.setValue('amount', dataLimits.maxAmount.toString());

    if (dataLimits.maxAmount > balanceTreated) {
      setErrorAmount(ErrorBridgeForm.INSUFFICIENT_BALANCE);
      return;
    }

    debouncedGetQuotes(dataLimits.maxAmount.toString());
  }, [form, balance, dataLimits.maxAmount, setErrorAmount, debouncedGetQuotes]);

  return (
    <Card
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
        <Text color="#868079" fontSize={12} fontWeight={400}>
          From
        </Text>
        <VStack justifyContent="flex-end" gap={0} p={1}>
          <HStack w={'full'} align="center" justifyContent="flex-end">
            <Image src={fuelImg} boxSize={4} />
            <Text color="grey.50" fontSize={12} fontWeight={400}>
              {'Fuel Ignition'}
            </Text>
            <IconButton
              icon={<LeftAndRightArrow />}
              variant="unstyled"
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
            />
          </HStack>
          <Text color="#868079" fontSize={12} fontWeight={400}>
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
        <Text color="#868079" fontSize={12} fontWeight={400}>
          {assetFromUSD}
        </Text>
      </HStack>
      <HStack justifyContent="center" gap={2} align="flex-end" height={'100%'}>
        <Button
          maxH="28px"
          minW="48px"
          isDisabled={!dataLimits.minAmount}
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
          isDisabled={!dataLimits.maxAmount}
          variant="secondary"
          onClick={handleMaxAmount}
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
          base: 14,
        }}
      >
        {!!errorAmount && (
          <Text color="red.500" fontSize={10}>
            {errorAmount}
          </Text>
        )}
      </HStack>
    </Card>
  );
}
