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
import { useCallback, useMemo, useState } from 'react';

import { LeftAndRightArrow } from '@/components';
import { Asset } from '@/modules/core';
import { useFormBridge } from '@/modules/vault/hooks/bridge';

import { InputAmount } from '../inputAmount';
import { SelectNetworkDrawerBridge } from './selectNetworkDrawer';

export interface AmountBridgeMobileProps {
  assets?: Required<Asset>[];
}

export function AmountBrigdeMobile({ assets }: AmountBridgeMobileProps) {
  const [errorAmount, setErrorAmount] = useState(false);
  const selectNetworkDrawer = useDisclosure();
  const { assetFrom, form, amount, assetFromUSD } = useFormBridge();
  const fuelImg = 'https://verified-assets.fuel.network/images/fuel.svg';
  const fee = 0.000003205;

  const balance = useMemo(() => {
    const asset = assets?.find((a) => a.assetId === assetFrom?.value);

    if (!asset?.amount) return '0';

    const balance = bn(asset.amount)?.format({
      units: asset.units,
    });

    return balance;
  }, [assets, assetFrom?.value]);

  const handleSourceChange = useCallback(
    (value: string) => {
      form.setValue('amount', value);
      const balanceTreated = Number(balance.replace(/,/g, ''));
      const valueTreated = Number(value.replace(/,/g, ''));

      if (valueTreated > balanceTreated) setErrorAmount(true);
      else if (errorAmount) setErrorAmount(false);
    },
    [form, errorAmount, balance],
  );

  const handleMinAmount = useCallback(async () => {
    if (!balance || balance === '0') {
      form.setValue('amount', '0');
      return;
    }

    const amount = fee + 0.00000001;
    form.setValue('amount', amount.toString());
  }, [form, balance]);

  const handleMaxAmount = useCallback(() => {
    if (!balance || balance === '0') {
      form.setValue('amount', '0');
      return;
    }

    const balanceTreated = balance.replace(/,/g, '');

    const amount = Number(balanceTreated) - fee;
    form.setValue('amount', amount.toString());
  }, [form, balance]);

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
          disabled={false} //maxFee === 0 || maxFee == undefined}
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
          onClick={handleMaxAmount} //handleSetCurrencyAmount(50, balance)}
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
            {/* {errorAmount} */}
            Error na quantidde amount, insuficiente, tente outra coisa!
          </Text>
        )}
      </HStack>
    </Card>
  );
}
