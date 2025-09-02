import {
  Button,
  CloseButton,
  Flex,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';
import { bn } from 'fuels';

import { useCreateOrder } from '../hooks/useCreateOrder';
import type { Asset } from '../types';
import {
  type ListingConfigFormProps,
  ListingConfigSetup,
} from './ListingConfigSetup';

type ListingContentProps = {
  name: React.ReactNode;
  assetId: string;
  onClose: () => void;
  userWithHandle: boolean;
  onCancel: () => void;
  assets: Asset[];
  nftImage: string;
  vaultId: string;
};

export default function ListingContent({
  name,
  assetId,
  onClose,
  onCancel,
  userWithHandle,
  assets,
  nftImage,
  vaultId,
}: ListingContentProps) {
  const { createOrder, isPending, pendingTransactions } = useCreateOrder(
    vaultId,
    onClose,
  );

  const handleCreateOrder = (data: ListingConfigFormProps) => {
    createOrder({
      itemAsset: assetId,
      itemAmount: bn(1),
      sellPrice: bn.parseUnits(
        data.sellPrice.toString(),
        data.sellAsset.decimals,
      ),
      sellAsset: data.sellAsset.id,
      image: nftImage,
    });
  };

  return (
    <Stack w="full" spacing={4} h="480px" maxW="480px">
      <Flex w="full" alignItems="center" justifyContent="space-between">
        <Heading fontSize="xl">{name}</Heading>
        <CloseButton
          onClick={onClose}
          display={{ base: 'none', md: 'block' }}
        />
      </Flex>

      <Text color="section.500">
        Select asset and enter price for your new listing.
      </Text>

      <ListingConfigSetup
        assets={assets}
        onSubmit={handleCreateOrder}
        userWithHandle={userWithHandle}
      />

      <Stack direction="row" justifyContent="space-between" mt="auto">
        <Button
          variant="secondary"
          type="button"
          onClick={onCancel}
          isDisabled={isPending}
          _hover={{
            borderColor: 'garage.100',
            color: 'garage.100',
          }}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          form="nft-sale-form"
          isLoading={isPending}
          isDisabled={pendingTransactions}
        >
          Confirm listing
        </Button>
      </Stack>
    </Stack>
  );
}
