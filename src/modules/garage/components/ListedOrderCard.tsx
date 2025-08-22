/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import {
  type BoxProps,
  Button,
  Flex,
  Heading,
  Image,
  Skeleton,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { useAccount, useBalance, useConnectUI } from '@fuels/react';
// import { Link, useParams } from '@tanstack/react-router';
import { bn } from 'fuels';
import { type MouseEvent, useCallback, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import nftEmpty from '@/assets/nft-empty.png';
import UnknownAsset from '@/assets/unknown-asset.png';
import { useContactToast } from '@/modules/addressBook';
import { useScreenSize } from '@/modules/core';
import { parseURI } from '@/modules/core/utils/formatter';

// import { useCancelOrder, useExecuteOrder } from '@/hooks/marketplace';
// import { parseURI } from '@/utils/formatter';
import type { Order } from '../types';
import { NftCard } from './card';

// import { ListedOrderCardModal } from './ListedOrderCardModal';

interface ListedOrderCardProps {
  order: Order;
  showDelistButton: boolean;
  isOwner: boolean;
  showBuyButton: boolean;
  withHandle: boolean;
  openModalOnClick?: boolean;
  imageSize?: BoxProps['boxSize'];
  ctaButtonVariant?: 'primary' | 'mktPrimary';
  isProfilePage?: boolean;
}

const ListedOrderCard = ({
  order,
  showDelistButton,
  isOwner,
  showBuyButton,
  openModalOnClick = true,
  withHandle,
  imageSize,
  ctaButtonVariant = 'primary',
  isProfilePage,
}: ListedOrderCardProps) => {
  const { isMobile } = useScreenSize();
  const { successToast, errorToast } = useContactToast();
  //   const { cancelOrderAsync, isPending: isCanceling } = useCancelOrder();
  const { isOpen, onClose, onOpen } = useDisclosure();
  //   const { updatedOrders } = useProcessingOrdersStore();
  const { account } = useAccount();
  const { collectionId } = useParams();
  const { connect, isConnected } = useConnectUI();
  const [displayBuyButton, setDisplayBuyButton] = useState(false);

  //   const { executeOrderAsync, isPending: isExecuting } = useExecuteOrder(
  //     collectionId ?? '',
  //   );

  //   const showDisplayBuyButton = displayBuyButton || isExecuting;

  const showDisplayBuyButton = true;

  const { balance: walletAssetBalance, isLoading: isLoadingWalletBalance } =
    useBalance({
      address: account,
      assetId: order.price.assetId,
    });

  const notEnoughBalance = useMemo(() => {
    if (isLoadingWalletBalance || !walletAssetBalance) return true;

    return walletAssetBalance.lt(bn(order.price.raw));
  }, [walletAssetBalance, isLoadingWalletBalance, order.price.raw]);

  const handleExecuteOrder = useCallback(async () => {
    if (!isConnected) {
      connect();
      return;
    }
    try {
      //   await executeOrderAsync(order.id);
      console.log('executing');
      successToast({ title: 'Order executed successfully!' });
      onClose();
    } catch {
      errorToast({ title: 'Failed to execute order' });
    }
  }, [
    connect,
    // executeOrderAsync,
    order.id,
    onClose,
    successToast,
    errorToast,
    isConnected,
  ]);

  const handleOpenDialog = () => {
    onOpen();
  };

  const handleCloseDialog = () => {
    onClose();
  };
  const delistModal = useDisclosure();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const handleCancelOrder = useCallback(async () => {
    try {
      //   await cancelOrderAsync(order.id);
      console.log('cancelling');
      successToast({
        title: 'Delisted successfully',
        description: 'Your order has been successfully cancelled.',
      });
      handleCloseDialog();
    } catch {
      errorToast({
        title: 'Error delisting order',
        description: 'An error occurred while delisting your order.',
      });
    }
  }, [order.id, successToast, errorToast]);

  const handleDelist = (e: MouseEvent) => {
    e.stopPropagation();
    delistModal.onOpen();
  };

  const handleConfirmDelist = async () => {
    await handleCancelOrder();
    delistModal.onClose();
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

  const assetSymbolUrl = order.price.image || UnknownAsset;

  const imageUrl = parseURI(order.asset?.image) || nftEmpty;
  const name = order.asset.name || 'Unknown NFT';

  const handleCardClick = () => {
    if (openModalOnClick) {
      handleOpenDialog();
    }
  };

  //   const isProcessigNewPrices = useMemo(() => {
  //     const hasOrderUpdated = updatedOrders.find(
  //       (updatedOrder) => updatedOrder.orderId === order.id,
  //     );
  //     return (
  //       hasOrderUpdated &&
  //       (order.price.amount !== hasOrderUpdated?.newAmount ||
  //         order.price.image !== hasOrderUpdated?.assetIcon)
  //     );
  //   }, [updatedOrders, order.id, order.price.amount, order.price.image]);

  return (
    <NftCard.Root
      onClick={handleCardClick}
      cursor="pointer"
      minH="240px"
      onMouseEnter={() =>
        isMobile ? null : setDisplayBuyButton(!isProfilePage)
      }
      onMouseLeave={() => setDisplayBuyButton(false)}
      position="relative"
    >
      {showDelistButton && <NftCard.DelistButton onDelist={handleDelist} />}
      <Flex
        as={Link}
        to={
          isProfilePage
            ? undefined
            : `/collection/${collectionId}/order/${order.id}`
        }
        flexDir="column"
      >
        <NftCard.Image boxSize={imageSize} src={imageUrl} />
        <NftCard.Content h={showBuyButton ? 'full' : '70px'}>
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
          <Skeleton
            // isLoaded={!isProcessigNewPrices}
            isLoaded={true}
            rounded="md"
            minH="30px"
            gap="8px"
            display="flex"
            flexDir="column"
          >
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
            {order.price.usd && !displayBuyButton && (
              <Text color="grey.subtitle" fontSize="xs" lineHeight=".9">
                {currency}
              </Text>
            )}
          </Skeleton>
        </NftCard.Content>
      </Flex>
      {showBuyButton && (
        <Skeleton
          isLoaded={!isLoadingWalletBalance}
          borderRadius="md"
          display="flex"
          alignItems="center"
          transition="transform 0.25s ease, opacity 0.25s ease"
          bgColor="grey.600"
          w="93%"
          mx="auto"
          boxShadow="0 0 10px 4px rgba(39, 39, 39, 0.84)"
          position={isMobile ? 'relative' : 'absolute'}
          mb={isMobile ? 2 : 0}
          bottom={isMobile ? 0 : 2}
          left={0}
          right={0}
          zIndex={10}
          opacity={isMobile ? 1 : showDisplayBuyButton ? 1 : 0}
          transform={
            isMobile
              ? 'translateY(0)'
              : showDisplayBuyButton
                ? 'translateY(0)'
                : 'translateY(12px)'
          }
          pointerEvents={isMobile ? 'auto' : displayBuyButton ? 'auto' : 'none'}
        >
          <Tooltip
            label={notEnoughBalance && isConnected ? 'Not enough balance' : ''}
          >
            <Button
              variant={ctaButtonVariant}
              h={isMobile ? '32px' : '24px'}
              py={1.5}
              //   isLoading={isExecuting}
              //   disabled={(notEnoughBalance && isConnected) || isExecuting}
              onClick={(e) => {
                e.stopPropagation();
                void handleExecuteOrder();
              }}
            >
              Buy Now
            </Button>
          </Tooltip>
        </Skeleton>
      )}
      {/* {delistModal.isOpen && (
        <ConfirmationDialog
          title="Delist NFT"
          isOpen
          onClose={delistModal.onClose}
          onConfirm={handleConfirmDelist}
          isConfirming={isCanceling}
          confirmActionVariant="tertiary"
          confirmActionLabel="Yes, delist NFT"
        >
          <Text fontSize="sm" color="grey.subtitle">
            Are you sure you want to delist this NFT?
          </Text>
        </ConfirmationDialog>
      )}
      {isOpen && (
        <ListedOrderCardModal
          order={order}
          imageUrl={imageUrl}
          isOpen={isOpen}
          onClose={handleCloseDialog}
          onCancelOrder={handleCancelOrder}
          isCanceling={isCanceling}
          value={order.price.amount}
          usdValue={currency}
          isOwner={isOwner}
          withHandle={withHandle}
          ctaButtonVariant={ctaButtonVariant}
        />
      )} */}
    </NftCard.Root>
  );
};

export default ListedOrderCard;
