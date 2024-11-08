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

import { AddressWithCopyBtn, DoubleArrowIcon } from '@/components';
import { DeployIcon } from '@/components/icons/tx-deploy';
import { useTxAmountToUSD } from '@/modules/assets-tokens/hooks/useTxAmountToUSD';
import { AssetModel } from '@/modules/core';
import { useResolveNickname } from '@/modules/core/hooks/useResolveNickname';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { AmountUSD } from './transfer-details';

interface AssetBoxInfoProps extends StackProps {
  asset?: AssetModel;
  isDeposit?: boolean;
  isDeploy?: boolean;
  isContract?: boolean;
}

const AssetBoxInfo = ({
  asset,
  isDeposit,
  isDeploy,
  isContract,
  ...props
}: AssetBoxInfoProps) => {
  const {
    tokensUSD,
    screenSizes: { isMobile, isLowerThanFourHundredAndThirty, isExtraSmall },
    assetsMap,
  } = useWorkspaceContext();

  const { resolveNickname } = useResolveNickname();
  const nickname = asset?.to ? resolveNickname(asset.to) : undefined;

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
            w={6} // Largura responsiva
            h={6} // Altura responsiva
            src={assetInfo?.icon ?? ''} // URL da imagem com fallback
            alt="Asset Icon" // Texto alternativo para acessibilidade
            objectFit="cover" // Ajuste da imagem
          />

          <Text fontSize="sm" color="grey.500">
            {assetInfo.slug}
          </Text>
        </VStack>
      )}

      <VStack mt={0.5} minW={isExtraSmall ? '80px' : '105px'}>
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

      {!!asset && (
        <VStack alignItems="end" h={nickname ? '47px' : 'unset'}>
          {nickname && (
            <Text
              isTruncated
              textOverflow="ellipsis"
              maxW={{
                base: isExtraSmall ? '80px' : '100px',
                xs: '130px',
                lg: '130px',
              }}
              fontSize="sm"
              pb={0.5}
            >
              {nickname}
            </Text>
          )}
          <AddressWithCopyBtn
            address={asset?.to}
            addressProps={{
              color: nickname ? 'grey.500' : 'white',
            }}
          />
        </VStack>
      )}
    </HStack>
  );
};

export { AssetBoxInfo };
