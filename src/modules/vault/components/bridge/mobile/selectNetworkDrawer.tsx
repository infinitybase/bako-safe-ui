import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { UseFormReturn } from 'react-hook-form';

import { AssetItem } from '../modalSelectAssets';
import { ITransferBridgePayload } from '../providers/FormBridgeProvider';

export interface SelectNetworkDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  form: UseFormReturn<ITransferBridgePayload>;
  children?: React.ReactNode;
}

const optionsAssets = [
  {
    value: '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07',
    name: 'ETH',
    image: 'https://assets.fuel.network/providers/eth.svg',
    symbol: 'ETH',
  },
  {
    value: '0x1d5d97005e41cae2187a895fd8eab0506111e0e2f3331cd3912c15c24e3c1d82',
    name: 'FUEL',
    image: 'https://verified-assets.fuel.network/images/fuel.svg',
    symbol: 'FUEL',
  },
  {
    value: 'USDC',
    name: 'USDC',
    image:
      'https://firebasestorage.googleapis.com/v0/b/pump-555ee.appspot.com/o/images%2Faecb0358-d860-402c-9f3c-c5b579e4eb88.jpeg?alt=media&token=b39c9a29-4b5e-4b2c-8600-62e9afff2448',
    symbol: 'USC',
  },
];

interface AssetItemBrigdeProps {
  asset: AssetItem;
  form: UseFormReturn<ITransferBridgePayload>;
  onClose: () => void;
}

const AssetItemMobile = ({ asset, form, onClose }: AssetItemBrigdeProps) => {
  const { image, name } = asset;

  return (
    <HStack
      border="1px solid"
      borderColor="grey.950"
      padding={4}
      borderRadius={8}
      cursor="pointer"
      _hover={{ bgColor: 'grey.925' }}
      w="full"
      onClick={() => {
        form.setValue('selectAssetFrom', asset.value);
        onClose();
      }}
    >
      <Image src={image} boxSize={6} />
      <Text fontSize={12} fontWeight={500} color="grey.50">
        {name}
      </Text>
    </HStack>
  );
};

export function SelectNetworkDrawerBridge({
  isOpen,
  onClose,
  form,
}: SelectNetworkDrawerProps) {
  return (
    <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent padding={4} bg={'dark.950'}>
        <DrawerHeader>
          <VStack fontWeight="normal" align="start">
            <Text fontSize={14} color="grey.50">
              Network
            </Text>
            <Text fontSize={12} color="grey.425">
              Select the network of your choice.
            </Text>
          </VStack>
        </DrawerHeader>
        <DrawerBody>
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
            {optionsAssets.map((asset) => (
              /* eslint-disable react/prop-types */
              <AssetItemMobile
                key={asset.value}
                asset={asset}
                form={form}
                onClose={onClose}
              />
            ))}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
