import type { AssetModel } from '@bako-safe/services';
import { HStack, Image, type StackProps, Text, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';

import { AddressWithCopyBtn } from '@/modules';
import { useGetContactByAddress } from '@/modules/addressBook';
import { useTxAmountToUSD } from '@/modules/assets-tokens/hooks/useTxAmountToUSD';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { AmountUSD } from './transfer-details';

interface AssetBoxInfoProps extends StackProps {
  asset?: AssetModel;
  isDeposit?: boolean;
}

const AssetBoxInfo = ({ asset, isDeposit, ...props }: AssetBoxInfoProps) => {
  const {
    tokensUSD,
    screenSizes: { isMobile, isLowerThanFourHundredAndThirty, isExtraSmall },
    addressBookInfos: {
      requests: {
        listContactsRequest: { data },
      },
    },
    assetsMap,
  } = useWorkspaceContext();

  const { savedContact } = useGetContactByAddress(asset?.to ?? '', data);

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

      {/* <Center
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
      </Center> */}

      {!!asset && (
        <VStack alignItems="end" h={savedContact?.nickname ? '47px' : 'unset'}>
          {savedContact?.nickname && (
            <Text
              isTruncated
              textOverflow="ellipsis"
              maxW={{
                base: isExtraSmall ? '80px' : '100px',
                xs: '130px',
                lg: '130px',
              }}
              fontSize="sm"
            >
              {savedContact.nickname}
            </Text>
          )}
          <AddressWithCopyBtn
            address={asset?.to}
            addressProps={{
              color: savedContact?.nickname ? 'grey.500' : 'white',
            }}
          />
        </VStack>
      )}
    </HStack>
  );
};

export { AssetBoxInfo };
