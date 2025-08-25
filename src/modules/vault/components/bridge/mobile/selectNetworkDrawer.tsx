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
import { SetStateAction } from 'react';

import { AssetItem } from '../modalSelectAssets';
import { NetworkOptionItem } from '../selectNewtork';

export interface SelectNetworkDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectNetwork: React.Dispatch<SetStateAction<NetworkOptionItem>>;
  children?: React.ReactNode;
}

const optionsNets = [
  {
    value: 'Network ethereum',
    name: 'Ethereum',
    image: 'https://assets.fuel.network/providers/eth.svg',
    symbol: 'ETH',
  },
  {
    value: 'Network Fuel Ignition',
    name: 'Fuel Ignition',
    image: 'https://verified-assets.fuel.network/images/fuel.svg',
    symbol: 'FUEL',
  },
  {
    value: 'Network Base',
    name: 'Base',
    image:
      'https://firebasestorage.googleapis.com/v0/b/pump-555ee.appspot.com/o/images%2Faecb0358-d860-402c-9f3c-c5b579e4eb88.jpeg?alt=media&token=b39c9a29-4b5e-4b2c-8600-62e9afff2448',
    symbol: 'BASE',
  },
];

interface AssetItemBrigdeProps {
  asset: AssetItem;
  selectNetwork: React.Dispatch<SetStateAction<NetworkOptionItem>>;
  onClose: () => void;
}

const AssetItemMobile = ({
  asset,
  selectNetwork,
  onClose,
}: AssetItemBrigdeProps) => {
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
        selectNetwork(asset);
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
  selectNetwork,
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
            {optionsNets.map((asset) => (
              /* eslint-disable react/prop-types */
              <AssetItemMobile
                key={asset.value}
                asset={{ ...asset, balance: '0' }}
                selectNetwork={selectNetwork}
                onClose={onClose}
              />
            ))}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
