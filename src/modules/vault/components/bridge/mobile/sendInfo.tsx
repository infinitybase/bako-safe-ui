import { Card, FormControl, HStack, InputGroup, Text } from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';

import { AssetSelect } from '@/components';

import { InputAddressBridge } from '..';
import { ITransferBridgePayload } from '../providers/FormBridgeProvider';

export function SendInfoBridgeMobile() {
  const { control } = useFormContext<ITransferBridgePayload>();

  const optionsAssets = [
    {
      value:
        '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07',
      name: 'ETH',
      image: 'https://assets.fuel.network/providers/eth.svg',
      symbol: null,
    },
    {
      value:
        '0x1d5d97005e41cae2187a895fd8eab0506111e0e2f3331cd3912c15c24e3c1d82',
      name: 'FUEL',
      image: 'https://verified-assets.fuel.network/images/fuel.svg',
      symbol: null,
    },
    {
      value: 'USDC',
      name: 'USDC',
      image:
        'https://firebasestorage.googleapis.com/v0/b/pump-555ee.appspot.com/o/images%2Faecb0358-d860-402c-9f3c-c5b579e4eb88.jpeg?alt=media&token=b39c9a29-4b5e-4b2c-8600-62e9afff2448',
      symbol: null,
    },
  ];

  const optionsNets = [
    {
      value: 'Network ethereum',
      name: 'Ethereum',
      image: 'https://assets.fuel.network/providers/eth.svg',
      symbol: null,
    },
    {
      value: 'Network Fuel Ignition',
      name: 'Fuel Ignition',
      image: 'https://verified-assets.fuel.network/images/fuel.svg',
      symbol: null,
    },
    {
      value: 'Network Base',
      name: 'Base',
      image:
        'https://firebasestorage.googleapis.com/v0/b/pump-555ee.appspot.com/o/images%2Faecb0358-d860-402c-9f3c-c5b579e4eb88.jpeg?alt=media&token=b39c9a29-4b5e-4b2c-8600-62e9afff2448',
      symbol: null,
    },
  ];

  return (
    <Card padding={3} w="full" bgColor="grey.825" gap={4}>
      <Text color="grey.425" fontSize={12}>
        Send to
      </Text>

      <HStack gap={4} w="full">
        <Controller
          control={control}
          name="selectNetworkTo"
          render={({ field }) => (
            <FormControl>
              <InputGroup position="relative" overflow="visible" zIndex={1}>
                <AssetSelect
                  {...field}
                  options={optionsNets}
                  label={'Destination'}
                  boxProps={{ bg: 'grey.925', h: '45px', py: 2 }}
                  textLabelProps={{ left: 2.5 }}
                />
              </InputGroup>
            </FormControl>
          )}
        />

        <Controller
          control={control}
          name="selectAssetToMobile"
          render={({ field }) => (
            <FormControl>
              <InputGroup position="relative" overflow="visible" zIndex={1}>
                <AssetSelect
                  {...field}
                  options={optionsAssets}
                  label={'Asset'}
                  boxProps={{ bg: 'grey.925', h: '45px', py: 2 }}
                  textValueProps={{ color: 'grey.50' }}
                  textLabelProps={{ left: 2.5 }}
                />
              </InputGroup>
            </FormControl>
          )}
        />
      </HStack>

      <InputAddressBridge />
    </Card>
  );
}
