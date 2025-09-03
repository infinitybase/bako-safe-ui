/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import {
  Box,
  Heading,
  Image,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { AssetInfo } from 'fuels';
import { useMemo } from 'react';

import { useScreenSize } from '@/modules/core';
import { NftDialog } from '@/modules/core/components/assetBalance/nft-dialog';
import { NftImage } from '@/modules/core/components/assetBalance/nft-image';
import { parseURI } from '@/modules/core/utils/formatter';
import nftEmpty from '/nft-empty.svg';
import UnknownAssetSymbol from '/tokens/unknown.svg';

import type { Order } from '../types';
import { NftCard } from './card';

interface ListedOrderCardProps {
  order: Order;
  withHandle: boolean;
  openModalOnClick?: boolean;
  ctaButtonVariant?: 'primary' | 'mktPrimary';
  assets: {
    metadata: AssetInfo | null;
    id: string;
    fees: [string, string];
    __typename: 'Asset';
  }[];
}

const ListedOrderCard = ({
  order,
  openModalOnClick = true,
  assets,
}: ListedOrderCardProps) => {
  const { isMobile } = useScreenSize();

  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleOpenDialog = () => {
    onOpen();
  };

  const handleCloseDialog = () => {
    onClose();
  };

  const currency = useMemo(
    () =>
      Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'USD',
      }).format(Number(order.price.usd)),
    [order.price.usd],
  );

  const asset = assets.find((a) => a.id === order.price.assetId);
  const assetSymbolUrl =
    asset?.metadata?.icon || order.price.image || UnknownAssetSymbol;

  const imageUrl = parseURI(order.asset?.image) || nftEmpty;
  const name = order.asset.name || 'Unknown NFT';

  const handleCardClick = () => {
    if (openModalOnClick) {
      handleOpenDialog();
    }
  };

  return (
    <NftCard.Root
      onClick={handleCardClick}
      cursor="pointer"
      minH="240px"
      position="relative"
      pb={0}
    >
      <Box
        w="full"
        aspectRatio={1}
        minW={{
          base: '100px',
          sm: '120px',
          md: '150px',
        }}
        borderRadius={5}
        position="relative"
        overflow="hidden"
      >
        <NftImage src={imageUrl ?? undefined} />
      </Box>
      <NftCard.Content h={isMobile ? 'full' : '70px'}>
        <Text
          fontSize="xs"
          color="text.700"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          overflow="hidden"
          minH="13px"
          lineHeight=".9"
        >
          {name}
        </Text>

        <Heading
          display="flex"
          alignItems="center"
          gap={1}
          fontSize="md"
          color="text.700"
          h="14px"
        >
          <Tooltip label={order.asset?.name}>
            <Image src={assetSymbolUrl} alt="Asset Icon" w={4} height={4} />
          </Tooltip>
          {order.price.amount}
        </Heading>
        {order.price.usd && (
          <Text color="grey.subtitle" fontSize="xs" lineHeight=".9">
            {currency}
          </Text>
        )}
      </NftCard.Content>

      {isOpen && (
        <NftDialog
          order={order}
          isOpen={isOpen}
          onClose={handleCloseDialog}
          imageSrc={imageUrl}
          assets={assets}
        />
      )}
    </NftCard.Root>
  );
};

export default ListedOrderCard;
