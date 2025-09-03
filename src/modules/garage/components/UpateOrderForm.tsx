import {
  Button,
  CloseButton,
  Flex,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';
import { bn } from 'fuels';
import { useMemo } from 'react';

import UnknownNft from '/tokens/unknown.svg';

import { useListAssets } from '../hooks';
import { useUpdateOrder } from '../hooks/useUpdateOrder';
import type { Order } from '../types';
import {
  ListingConfigFormProps,
  ListingConfigSetup,
} from './ListingConfigSetup';

type UpateOrderFormProps = {
  order: Order;
  onClose: () => void;
  onCancel: () => void;
  userWithHandle: boolean;
  vaultId: string;
};

export default function UpateOrderForm({
  order,
  onClose,
  onCancel,
  userWithHandle,
  vaultId,
}: UpateOrderFormProps) {
  const { updateOrder, isPending, pendingTransactions } = useUpdateOrder(
    vaultId,
    onClose,
  );
  const { assets } = useListAssets();

  const handleUpdateOrder = (
    data: ListingConfigFormProps & { currentReceiveAmountInUsd: number },
  ) => {
    const sellPrice = bn.parseUnits(
      data.sellPrice.toString(),
      data.sellAsset.decimals,
    );

    updateOrder({
      sellPrice,
      sellAsset: data.sellAsset.id,
      orderId: order.id,
    });
  };

  const decimals = useMemo(
    () => assets.find((a) => a.id === order.price.assetId)?.metadata?.decimals,
    [assets, order.price.assetId],
  );

  const assetSymbol =
    assets.find((a) => a.id === order.price.assetId)?.metadata!.icon ||
    UnknownNft;

  return (
    <Stack
      w="full"
      spacing={4}
      flex={1}
      justifyContent="space-between"
      alignItems="flex-start"
      minW={{
        base: 'full',
        sm: '480px',
      }}
      maxW="480px"
      maxH={{ md: '490px' }}
      overflowY={{
        base: 'unset',
        md: 'scroll',
      }}
      style={{ scrollbarWidth: 'none' }}
    >
      <Flex w="full" alignItems="center" justifyContent="space-between">
        <Heading fontSize="xl" noOfLines={1}>
          {order?.asset?.name || 'NFT Details'}
        </Heading>

        <CloseButton
          onClick={onClose}
          display={{ base: 'none', md: 'block' }}
        />
      </Flex>
      <Text color="section.500">
        Select new asset and price for your listing.
      </Text>
      <ListingConfigSetup
        onSubmit={handleUpdateOrder}
        assets={assets}
        userWithHandle={userWithHandle}
        initialValues={{
          sellAsset: {
            id: order.price.assetId,
            icon: assetSymbol,
            name: order.price.name ?? 'Unknown',
            decimals,
          },
          sellPrice: order.price.amount,
        }}
      />

      <Stack direction="row" justifyContent="space-between" mt="auto" w="full">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          form="nft-sale-form"
          isLoading={isPending}
          isDisabled={pendingTransactions}
        >
          Save new price
        </Button>
      </Stack>
    </Stack>
  );
}
