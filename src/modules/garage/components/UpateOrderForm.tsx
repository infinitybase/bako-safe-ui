import { Button, Heading, Stack, Text } from '@chakra-ui/react';
import { bn } from 'fuels';
import { useCallback, useMemo } from 'react';

import { useListAssets } from '@/hooks/marketplace/useListAssets';
import { useUpdateOrder } from '@/hooks/marketplace/useUpdateOrder';
import { useContactToast } from '@/modules/addressBook';

import { NftCardSaleForm, type NftSaleCardForm } from '../NftCardSaleForm';
import type { Order } from '../types';

export default function UpateOrderForm({
  assetSymbolUrl,
  order,
  value,
  onClose,
  name,
  onCancel,
  userWithHandle,
}: {
  order: Order;
  value: number;
  assetSymbolUrl: string;
  onClose: () => void;
  name: string;
  onCancel: () => void;
  userWithHandle: boolean;
}) {
  const { updateOrderAsync, isPending } = useUpdateOrder();
  const { successToast, errorToast } = useContactToast();
  const { assets } = useListAssets();

  const handleUpdateOrder = useCallback(
    async (data: NftSaleCardForm & { currentReceiveAmountInUsd: number }) => {
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
      <NftCardSaleForm
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
