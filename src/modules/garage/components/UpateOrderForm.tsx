import { Button, Heading, Stack, Text } from '@chakra-ui/react';
import { bn } from 'fuels';
import { useCallback, useMemo } from 'react';

import { useContactToast } from '@/modules/addressBook';

import { useListAssets } from '../hooks';
import { useUpdateOrder } from '../hooks/useUpdateOrder';
import type { Order } from '../types';
import {
  ListingConfigFormProps,
  ListingConfigSetup,
} from './ListingConfigSetup';

type UpateOrderFormProps = {
  order: Order;
  value: number;
  assetSymbolUrl: string;
  onClose: () => void;
  name: string;
  onCancel: () => void;
  userWithHandle: boolean;
};

export default function UpateOrderForm({
  order,
  value,
  assetSymbolUrl,
  onClose,
  name,
  onCancel,
  userWithHandle,
}: UpateOrderFormProps) {
  const { updateOrderAsync, isPending } = useUpdateOrder();
  const { successToast, errorToast } = useContactToast();
  const { assets } = useListAssets();

  const handleUpdateOrder = useCallback(
    async (
      data: ListingConfigFormProps & { currentReceiveAmountInUsd: number },
    ) => {
      try {
        const sellPrice = bn.parseUnits(
          data.sellPrice.toString(),
          data.sellAsset.decimals,
        );

        const oldAmount = order.price.amount;
        const oldRaw = order.price.raw;
        const newAmount = data.sellPrice;
        const newRaw = sellPrice.toString();

        const oldPrice = {
          oldAmount,
          oldRaw,
        };

        const newPrice = {
          newAmount,
          newRaw,
          usd: data.currentReceiveAmountInUsd,
        };

        await updateOrderAsync({
          oldPrice,
          newPrice,
          sellPrice,
          sellAsset: data.sellAsset.id,
          orderId: order.id,
          assetIcon: data.sellAsset.icon ?? '',
        });
        successToast({ title: 'Order updated successfully!' });
        onClose();
      } catch {
        errorToast({ title: 'Failed to update order' });
      }
    },
    [updateOrderAsync, order, successToast, errorToast, onClose],
  );

  const decimals = useMemo(
    () => assets.find((a) => a.id === order.price.assetId)?.metadata?.decimals,
    [assets, order.price.assetId],
  );

  return (
    <Stack w="full" spacing={4}>
      <Heading>{name}</Heading>
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
            icon: assetSymbolUrl,
            name: order.price.name ?? 'Unknown',
            decimals,
          },
          sellPrice: value,
        }}
      />

      <Stack direction="row" justifyContent="space-between" mt="auto">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          _hover={{
            borderColor: 'garage.100',
            color: 'garage.100',
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          form="nft-sale-form"
          isLoading={isPending}
        >
          Save new price
        </Button>
      </Stack>
    </Stack>
  );
}
