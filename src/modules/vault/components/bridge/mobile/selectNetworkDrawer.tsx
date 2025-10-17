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

import { useNetworks } from '@/modules/network/hooks';

import { AssetItem } from '../modalSelectAssets';
import { ITransferBridgePayload } from '../providers/FormBridgeProvider';
import { getFuelAssetsByNetwork } from '../utils';

export interface SelectNetworkDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  form: UseFormReturn<ITransferBridgePayload>;
  setErrorAmount: React.Dispatch<React.SetStateAction<string | null>>;
  assetFrom: AssetItem | null;
  children?: React.ReactNode;
}

interface AssetItemBrigdeProps {
  asset: AssetItem;
  form: UseFormReturn<ITransferBridgePayload>;
  setErrorAmount: React.Dispatch<React.SetStateAction<string | null>>;
  assetFrom: AssetItem | null;
  onClose: () => void;
}

const AssetItemMobile = ({
  asset,
  form,
  assetFrom,
  setErrorAmount,
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
        form.setValue('selectAssetFrom', asset.value);
        form.resetField('selectAssetToMobile');
        form.resetField('selectNetworkToMobile');
        if (asset.value !== assetFrom?.value) {
          setErrorAmount(null);
          form.setValue('amount', '0.000');
        }
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
  setErrorAmount,
  assetFrom,
}: SelectNetworkDrawerProps) {
  const { currentNetwork } = useNetworks();

  return (
    <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent padding={4} bg={'dark.950'}>
        <DrawerHeader>
          <VStack fontWeight="normal" align="start">
            <Text fontSize={14} color="grey.50">
              Asset
            </Text>
            <Text fontSize={12} color="grey.425">
              Select the asset of your choice.
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
            {getFuelAssetsByNetwork(currentNetwork).map((asset) => (
              /* eslint-disable react/prop-types */
              <AssetItemMobile
                key={asset.value}
                asset={asset}
                form={form}
                onClose={onClose}
                setErrorAmount={setErrorAmount}
                assetFrom={assetFrom}
              />
            ))}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
