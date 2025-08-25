import {
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Dialog, SearchIcon } from '@/components';

import { ITransferBridgePayload } from '../../pages';

export interface AssetItem {
  value: string;
  image: string;
  name: string;
  symbol: string;
  balance: string;
}

export interface AssetItemBrigdeProps {
  asset: AssetItem;
}

export interface ModalSelectAssetsProps {
  title: string;
  isOpen?: boolean;
  onClose: () => void;
  onSelect: (asset: AssetItem) => void;
}

const optionsAssets = [
  {
    value: '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07',
    balance: '0.00057891',
    name: 'Etherium',
    image: 'https://assets.fuel.network/providers/eth.svg',
    symbol: 'ETH',
  },
  {
    value: '0x1d5d97005e41cae2187a895fd8eab0506111e0e2f3331cd3912c15c24e3c1d82',
    balance: '12.00',
    name: 'Fuel tokens muitos tokens',
    image: 'https://verified-assets.fuel.network/images/fuel.svg',
    symbol: 'FUEL',
  },
  {
    balance: '0.00',
    value: 'USDC',
    name: 'USDC',
    image:
      'https://firebasestorage.googleapis.com/v0/b/pump-555ee.appspot.com/o/images%2Faecb0358-d860-402c-9f3c-c5b579e4eb88.jpeg?alt=media&token=b39c9a29-4b5e-4b2c-8600-62e9afff2448',
    symbol: 'USDC',
  },
  {
    balance: '10.9',
    value: 'USDT',
    name: 'USDT',
    image:
      'https://firebasestorage.googleapis.com/v0/b/pump-555ee.appspot.com/o/images%2Faecb0358-d860-402c-9f3c-c5b579e4eb88.jpeg?alt=media&token=b39c9a29-4b5e-4b2c-8600-62e9afff2448',
    symbol: 'USDT',
  },
  {
    balance: '10.9',
    value: 'USDT2',
    name: 'USDT',
    image:
      'https://firebasestorage.googleapis.com/v0/b/pump-555ee.appspot.com/o/images%2Faecb0358-d860-402c-9f3c-c5b579e4eb88.jpeg?alt=media&token=b39c9a29-4b5e-4b2c-8600-62e9afff2448',
    symbol: 'USDT',
  },
  {
    balance: '10.9',
    value: 'USDT1',
    name: 'USDT',
    image:
      'https://firebasestorage.googleapis.com/v0/b/pump-555ee.appspot.com/o/images%2Faecb0358-d860-402c-9f3c-c5b579e4eb88.jpeg?alt=media&token=b39c9a29-4b5e-4b2c-8600-62e9afff2448',
    symbol: 'USDT',
  },
  {
    balance: '10.9',
    value: 'USDT4',
    name: 'USDT',
    image:
      'https://firebasestorage.googleapis.com/v0/b/pump-555ee.appspot.com/o/images%2Faecb0358-d860-402c-9f3c-c5b579e4eb88.jpeg?alt=media&token=b39c9a29-4b5e-4b2c-8600-62e9afff2448',
    symbol: 'USDT',
  },
  {
    balance: '10.9',
    value: 'USDT5',
    name: 'USDT',
    image:
      'https://firebasestorage.googleapis.com/v0/b/pump-555ee.appspot.com/o/images%2Faecb0358-d860-402c-9f3c-c5b579e4eb88.jpeg?alt=media&token=b39c9a29-4b5e-4b2c-8600-62e9afff2448',
    symbol: 'USDT',
  },
  {
    balance: '10.9',
    value: 'USDT6',
    name: 'USDT',
    image:
      'https://firebasestorage.googleapis.com/v0/b/pump-555ee.appspot.com/o/images%2Faecb0358-d860-402c-9f3c-c5b579e4eb88.jpeg?alt=media&token=b39c9a29-4b5e-4b2c-8600-62e9afff2448',
    symbol: 'USDT',
  },
  {
    balance: '10.9',
    value: 'USDT7',
    name: 'USDT',
    image:
      'https://firebasestorage.googleapis.com/v0/b/pump-555ee.appspot.com/o/images%2Faecb0358-d860-402c-9f3c-c5b579e4eb88.jpeg?alt=media&token=b39c9a29-4b5e-4b2c-8600-62e9afff2448',
    symbol: 'USDT',
  },
  {
    balance: '10.9',
    value: 'USDT8',
    name: 'USDT',
    image:
      'https://firebasestorage.googleapis.com/v0/b/pump-555ee.appspot.com/o/images%2Faecb0358-d860-402c-9f3c-c5b579e4eb88.jpeg?alt=media&token=b39c9a29-4b5e-4b2c-8600-62e9afff2448',
    symbol: 'USDT',
  },
];

export function ModalSelectAssetsBridge({
  title,
  isOpen = false,
  onClose,
  onSelect,
}: ModalSelectAssetsProps) {
  const { control } = useFormContext<ITransferBridgePayload>();

  const [filteredAssets, setFilteredAssets] =
    useState<AssetItem[]>(optionsAssets);

  const handleClose = () => {
    onClose();
  };

  const handleSearch = (searchValue: string) => {
    if (!searchValue.trim()) {
      setFilteredAssets(optionsAssets);
      return;
    }

    const filtered = optionsAssets
      .filter((asset) =>
        asset.name.toLowerCase().includes(searchValue.toLowerCase()),
      )
      .sort((a, b) => Number(b.balance) - Number(a.balance));

    setFilteredAssets(filtered);
  };

  const handleSelectAsset = (asset: AssetItem) => {
    onSelect(asset);
    onClose();
  };

  const AssetItem = ({ asset }: AssetItemBrigdeProps) => {
    const { image, name, symbol, balance } = asset;

    return (
      <HStack
        border="1px solid"
        borderColor="grey.950"
        padding={4}
        borderRadius={8}
        cursor="pointer"
        _hover={{ bgColor: 'grey.925' }}
        w="100%"
        onClick={() => handleSelectAsset(asset)}
      >
        <Image src={image} boxSize={6} />
        <Text fontSize={12} fontWeight={500} color="grey.50">
          {name}
        </Text>
        <Text ml="auto" fontSize={12} fontWeight={400}>
          {balance} {symbol}
        </Text>
      </HStack>
    );
  };

  return (
    <Dialog.Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnOverlayClick={false}
      size={'md'}
    >
      <Dialog.Body minH={650} maxH={650} flex={1}>
        <Dialog.Header
          position={{ base: 'static', sm: 'relative' }}
          title={title}
          description={`Select the ${title.toLowerCase()} of your choice.`}
          mb={0}
          mt={0}
          titleSxProps={{
            fontSize: 16,
            fontWeight: 700,
            color: 'grey.50',
            marginTop: { base: 5, md: 0 },
          }}
          descriptionFontSize="12px"
          onClose={handleClose}
        />
        <Controller
          name="searchAsset"
          control={control}
          render={({ field, fieldState }) => {
            return (
              <FormControl isInvalid={fieldState.invalid} marginY={4}>
                <InputGroup>
                  <InputRightElement pr={3} top="35%">
                    <SearchIcon color="grey.75" fontSize={'16px'} />
                  </InputRightElement>

                  <Input
                    placeholder=""
                    bgColor="dark.950"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      handleSearch(e.target.value);
                    }}
                  />

                  <FormLabel>Search asset</FormLabel>
                </InputGroup>
              </FormControl>
            );
          }}
        />
        <Divider marginTop={6} borderColor="grey.950" />
        <VStack
          maxH={523}
          overflowY="auto"
          m={0}
          p={0}
          pt={6}
          sx={{
            '&::-webkit-scrollbar': {
              display: 'none',
              width: '5px',
              maxHeight: '330px',
              backgroundColor: 'transparent',
              borderRadius: '30px',
            },
          }}
        >
          {filteredAssets.map((asset) => (
            /* eslint-disable react/prop-types */
            <AssetItem key={asset.value} asset={asset} />
          ))}
        </VStack>
      </Dialog.Body>
    </Dialog.Modal>
  );
}
