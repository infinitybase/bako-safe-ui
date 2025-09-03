import {
  Box,
  Button,
  CloseButton,
  Flex,
  Heading,
  IconButton,
  Image,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { LuUser2 } from 'react-icons/lu';
import { RiEditLine } from 'react-icons/ri';

import { BTCIcon } from '@/components/icons/btc-icon';
import { ContractIcon } from '@/components/icons/contract-icon';
import { LightIcon } from '@/components/icons/light-bulb-icon';
import { NftMetadataBlock } from '@/modules/core/components/assetBalance/nft-metadata-block';
import { NFTText } from '@/modules/core/components/assetBalance/nft-text';
import { useCancelOrder } from '@/modules/garage/hooks/useCancelOrder';
import UnknownAssetSymbol from '/tokens/unknown.svg';

import { OrderWithMedatada } from '../types';
import { ConfirmationDialog } from './ConfirmationDialog';
import ShareOrder from './ShareOrder';

type UpdateOrderStepProps = {
  onClose: () => void;
  onEdit?: () => void;
  order?: OrderWithMedatada;
  vaultId: string;
};

export const UpdateOrderStep = ({
  onClose,
  order,
  onEdit,
  vaultId,
}: UpdateOrderStepProps) => {
  const metadataWithoutAttributes = Object.entries(
    order?.asset?.metadata ?? {},
  ).filter(([key]) => key !== 'attributes');
  const metadataArray = metadataWithoutAttributes.map(([key, value]) => ({
    value,
    label: key,
  }));
  const delistDialog = useDisclosure();
  const { cancelOrder, isPending: isCanceling } = useCancelOrder(
    vaultId,
    onClose,
  );

  const handleCancelOrder = () => {
    cancelOrder(order?.id ?? '');
  };

  const orderPrice = useMemo(() => {
    return Intl.NumberFormat('en-US').format(Number(order?.price.amount));
  }, [order?.price.amount]);

  const usdValue = useMemo(() => {
    return Intl.NumberFormat('en-US').format(Number(order?.price.usd ?? 0));
  }, [order?.price.usd]);

  const assetSymbolUrl = order?.price.image || UnknownAssetSymbol;

  return (
    <VStack
      flex={1}
      justifyContent="space-between"
      alignItems="flex-start"
      minW={{
        base: 'full',
        sm: '480px',
      }}
      maxH={{ md: '490px' }}
      overflowY={{
        base: 'unset',
        md: 'scroll',
      }}
      style={{ scrollbarWidth: 'none' }}
    >
      <Flex
        w="full"
        alignItems="center"
        justifyContent="space-between"
        position="sticky"
        top={0}
        zIndex={10}
        bg="dark.950"
      >
        <Heading fontSize="xl" noOfLines={1}>
          {order?.asset?.name || 'NFT Details'}
        </Heading>

        <CloseButton
          onClick={onClose}
          display={{ base: 'none', md: 'block' }}
        />
      </Flex>

      <Box flex={1} mt={6} pr={3}>
        <Box mb={3}>
          <Heading fontSize="md">Description</Heading>
          <Text mt={3} fontSize="sm" color="section.500">
            {order?.asset?.metadata?.description || 'Description not provided.'}
          </Text>
        </Box>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Flex alignItems="center" gap={2}>
            <Tooltip label={order?.asset?.name}>
              <Image
                src={assetSymbolUrl}
                alt="Asset icon"
                height={6}
                width={6}
              />
            </Tooltip>

            <Text fontSize="sm" color="grey.title" fontWeight="semibold">
              {orderPrice}
            </Text>
            <Text fontSize="sm" color="grey.subtitle">
              ~ {usdValue}
            </Text>

            <IconButton
              variant="icon"
              aria-label="Edit order"
              icon={<RiEditLine />}
              onClick={onEdit ?? undefined}
              bg="transparent"
            />
          </Flex>

          <ShareOrder
            orderId={order?.id ?? ''}
            nftName={order?.asset?.name ?? 'Unknown NFT'}
            collectionName={order?.collection?.name ?? ''}
          />
        </Stack>

        <Button
          variant="primary"
          size="sm"
          mt={6}
          w="100%"
          onClick={delistDialog.onOpen}
          bg="error.600"
          color="grey.825"
          borderColor="error.600"
          isLoading={isCanceling}
          _hover={{
            bg: 'error.600',
            color: 'grey.825',
          }}
        >
          Delist NFT
        </Button>

        <Flex
          wrap="wrap"
          gap={3}
          mt={6}
          justifyContent="space-between"
          w="full"
        >
          <NFTText
            value={order?.asset?.id ?? ''}
            title="Asset ID"
            isCopy
            icon={<BTCIcon />}
            flex="1"
            minW="200px"
          />
          <NFTText
            value={order?.collection.name ?? ''}
            title="Creator"
            isCopy
            icon={<LightIcon />}
            flex="1"
            minW="200px"
            isNoAddress
          />
          <NFTText
            value={order?.collection.address ?? ''}
            title="Contract Address"
            isCopy
            icon={<ContractIcon />}
            flex="1"
            minW="200px"
          />
          <NFTText
            value={order?.seller ?? ''}
            title="Seller"
            isCopy
            icon={<LuUser2 />}
            flex="1"
            minW="200px"
          />
        </Flex>

        <Stack spacing={2} mt={6}>
          <Heading fontSize="md">Metadata</Heading>
          <Flex direction="row" wrap="wrap" gap={3} pr={2}>
            {metadataArray?.map(({ label, value }) => (
              <NftMetadataBlock
                key={label}
                value={String(value)}
                title={label}
              />
            ))}

            {order?.asset?.metadata?.attributes?.map((attr) => (
              <NFTText
                key={attr.trait_type}
                value={attr.value}
                title={`attributes: ${attr.trait_type}`}
              />
            ))}

            {!order?.asset?.metadata?.attributes?.length &&
              metadataArray.length === 0 && (
                <Text fontSize="sm" color="section.500">
                  Empty metadata.
                </Text>
              )}
          </Flex>
        </Stack>
      </Box>
      <ConfirmationDialog
        isOpen={delistDialog.isOpen}
        onClose={delistDialog.onClose}
        confirmAction={handleCancelOrder}
        confirmText="Yes, delist NFT"
        title="Delist NFT"
        description="Are you sure you want to delist this NFT?"
        isLoading={isCanceling}
      />
    </VStack>
  );
};
