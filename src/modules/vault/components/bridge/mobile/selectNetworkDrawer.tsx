import { Drawer, HStack, Image, Text, VStack } from 'bako-ui';
import { UseFormReturn } from 'react-hook-form';

import { useNetworks } from '@/modules/network/hooks';

import { AssetItem } from '../modalSelectAssets';
import { ITransferBridgePayload } from '../providers/FormBridgeProvider';
import { getFuelAssetsByNetwork } from '../utils';

export interface SelectNetworkDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  form: UseFormReturn<ITransferBridgePayload>;
  children?: React.ReactNode;
}

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
        form.resetField('selectAssetToMobile');
        form.resetField('selectNetworkToMobile');
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
  const { currentNetwork } = useNetworks();

  return (
    <Drawer.Root placement="bottom" onClose={onClose} open={isOpen}>
      <Drawer.Backdrop />
      <Drawer.Content padding={4} bg={'dark.950'}>
        <Drawer.Header>
          <VStack fontWeight="normal" align="start">
            <Text fontSize={14} color="grey.50">
              Asset
            </Text>
            <Text fontSize={12} color="grey.425">
              Select the asset of your choice.
            </Text>
          </VStack>
        </Drawer.Header>
        <Drawer.Body>
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
              />
            ))}
          </VStack>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
}
