import { Icon } from '@chakra-ui/icons';
import {
  Center,
  HStack,
  Image,
  StackProps,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { FaPlay } from 'react-icons/fa';

import { Address, DoubleArrowIcon, Handle } from '@/components';
import { DeployIcon } from '@/components/icons/tx-deploy';
import { useTxAmountToUSD } from '@/modules/assets-tokens/hooks/useTxAmountToUSD';
import { AssetModel } from '@/modules/core';
import { useAddressNicknameResolver } from '@/modules/core/hooks/useAddressNicknameResolver';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { AmountUSD } from './transfer-details';
import { AddressActions } from './transfer-details/address-actions';

interface AssetBoxInfoProps extends StackProps {
  asset?: AssetModel;
  isDeposit?: boolean;
  isDeploy?: boolean;
  isContract?: boolean;
  handle?: string;
  resolver?: string;
}

const AssetBoxInfo = ({
  asset,
  isDeposit,
  isDeploy,
  isContract,
  handle,
  resolver,
  ...props
}: AssetBoxInfoProps) => {
  const {
    tokensUSD,
    screenSizes: {
      isMobile,
      isLowerThanFourHundredAndThirty,
      isExtraSmall,
      isLitteSmall,
    },

    assetsMap,
  } = useWorkspaceContext();

  const { resolveAddressContactHandle } = useAddressNicknameResolver();
  const assetAddressInfo = asset?.to
    ? resolveAddressContactHandle(asset.to, handle, resolver)
    : undefined;

  const assetInfo = useMemo(
    () =>
      asset?.assetId && assetsMap?.[asset?.assetId]
        ? assetsMap?.[asset?.assetId]
        : assetsMap?.['UNKNOWN'],
    [asset?.assetId],
  );

  const txUSDAmount = useTxAmountToUSD(
    [
      asset
        ? asset
        : {
            amount: '',
            assetId: '',
          },
    ],
    tokensUSD?.isLoading,
    tokensUSD?.data,
    tokensUSD?.isUnknownToken,
  );

  return (
    <HStack
      py={2}
      justifyContent={{ base: 'space-between' }}
      w="full"
      borderTopWidth={1}
      {...props}
    >
      {assetInfo && (
        <VStack alignItems="start" minW="40px">
          <Image
            w={6}
            h={6}
            src={assetInfo?.icon ?? ''}
            borderRadius={100}
            alt="Asset Icon"
            objectFit="cover"
          />

          <Text fontSize="sm" color="grey.500">
            {assetInfo.slug}
          </Text>
        </VStack>
      )}

      <VStack mt={0.5} minW={isLitteSmall ? '75px' : '105px'}>
        <Text
          textAlign="center"
          variant={isMobile ? 'title-sm' : 'title-md'}
          color="grey.75"
          fontSize={isLowerThanFourHundredAndThirty ? 'xs' : 'sm'}
        >
          {isDeposit ? null : '-'}
          {asset?.amount}
        </Text>
        <Text
          textAlign="center"
          variant="description"
          fontSize="xs"
          color="grey.500"
        >
          <AmountUSD amount={txUSDAmount} />
        </Text>
      </VStack>

      <Center
        p={{ base: 1.5, sm: 3 }}
        borderRadius={5}
        bgColor="grey.825"
        borderWidth={1}
        borderColor="grey.925"
        boxSize="30px"
      >
        <Icon
          color="grey.250"
          fontSize={isDeploy ? '12.8px' : !isContract ? '18px' : '12.8px'}
          as={isDeploy ? DeployIcon : !isContract ? DoubleArrowIcon : FaPlay}
        />
      </Center>

      {asset?.to && (
        <HStack
          alignItems="center"
          justifyContent="flex-end"
          spacing={{ base: isLitteSmall ? 0.5 : 1, xs: 2 }}
          minW={{
            base: isExtraSmall ? '100px' : isLitteSmall ? '125px' : '135px',
            xs: '160px',
            md: '170px',
          }}
        >
          <VStack alignItems="end" spacing={1}>
            {assetAddressInfo?.contact && (
              <Text
                isTruncated
                textOverflow="ellipsis"
                maxW={{
                  base: isExtraSmall
                    ? '75px'
                    : isLitteSmall
                      ? '100px'
                      : '110px',
                  xs: '130px',
                  lg: '130px',
                }}
                color="grey.75"
                fontSize={isLowerThanFourHundredAndThirty ? 'xs' : 'sm'}
              >
                {assetAddressInfo?.contact}
              </Text>
            )}

            {!assetAddressInfo?.contact && !assetAddressInfo?.handle && (
              <Address
                value={asset?.to}
                color={assetAddressInfo?.contact ? 'grey.500' : 'grey.75'}
              />
            )}

            {assetAddressInfo?.handle && (
              <Handle
                value={assetAddressInfo.handle}
                isTruncated
                textOverflow="ellipsis"
                maxW={{
                  base: isExtraSmall ? '50px' : isLitteSmall ? '75px' : '85px',
                  xs: '105px',
                  lg: '105px',
                }}
              />
            )}
          </VStack>

          <AddressActions
            address={asset.to}
            handle={assetAddressInfo?.handle}
            hasContact={!!assetAddressInfo?.contact}
          />
        </HStack>
      )}
    </HStack>
  );
};

export { AssetBoxInfo };
