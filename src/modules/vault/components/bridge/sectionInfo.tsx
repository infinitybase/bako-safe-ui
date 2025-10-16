import {
  Avatar,
  Box,
  Card,
  HStack,
  Image,
  Skeleton,
  Text,
  VStack,
} from 'bako-ui';
import { useMemo, useState } from 'react';

import { AddressUtils } from '@/modules/core';

import { useVaultInfosContext } from '../../hooks';
import { AssetItem } from './modalSelectAssets';

export interface SectionInfoBridgeProps {
  direction: 'From' | 'To';
  network: string;
  asset: AssetItem | null;
  imageNetwork?: string;
  amount?: string | number;
  amountUSD?: string;
}

interface SectionItemBridgeProps {
  title: string;
  description: string;
  image: string;
  imageNetwork?: string;
  avatar?: boolean;
}

const SectionItem = ({
  title,
  description,
  image,
  imageNetwork,
  avatar = false,
}: SectionItemBridgeProps) => {
  const [loadedMainImg, setLoadedMainImg] = useState(false);
  const [loadedSecondImg, setLoadedSecondImg] = useState(false);

  return (
    <HStack w="full" align="center">
      {avatar ? (
        <Avatar
          borderRadius={6}
          bgColor="grey.950"
          color="grey.75"
          boxShadow="0px 1.5px 1.5px 0px rgba(0, 0, 0, 0.4);"
          boxSize="30px"
          css={{
            '& div': { fontSize: '12px' },
          }}
          name={title}
        />
      ) : (
        <Box
          position="relative"
          w={{ base: '42px', md: '38px' }}
          h={{ base: '28.8px', md: '32px' }}
        >
          <Skeleton
            loading={!loadedMainImg}
            boxSize={8}
            border="1px solid"
            borderRadius="full"
          >
            <Image
              src={image}
              boxSize={8}
              borderRadius="full"
              onLoad={() => setLoadedMainImg(true)}
            />
          </Skeleton>
          <Skeleton
            loading={!loadedSecondImg}
            position="absolute"
            bottom={0}
            right={0}
            transform="translate(25%, 25%)"
            boxSize={5}
            borderRadius="full"
          >
            <Image
              src={imageNetwork}
              boxSize={5}
              borderRadius="full"
              border="1px solid"
              onLoad={() => setLoadedSecondImg(true)}
            />
          </Skeleton>
        </Box>
      )}

      <VStack w="full" align="start" gap={0}>
        <Text color="grey.50" fontSize={12} fontWeight={500}>
          {title}
        </Text>
        <Text color="grey.425" fontSize={12} letterSpacing="2%">
          {description}
        </Text>
      </VStack>
    </HStack>
  );
};

export function SectionInfo({
  direction,
  network,
  asset,
  imageNetwork,
  amount,
  amountUSD,
}: SectionInfoBridgeProps) {
  const { vault } = useVaultInfosContext();

  const vaultAddress = useMemo(() => {
    if (!vault) return '';

    return AddressUtils.format(vault.data?.predicateAddress ?? '', 4);
  }, [vault]);

  return (
    <Card.Root variant="outline" paddingX={3} paddingY={2} w="full">
      <VStack p={0} gap={0}>
        <HStack width="full">
          <HStack gap={2} align={'center'}>
            <Text color="grey.250" fontSize={12}>
              {direction}
            </Text>
          </HStack>
        </HStack>

        {direction === 'From' && (
          <HStack w="full" mt={3}>
            <SectionItem
              title={vault?.data?.name ?? ''}
              description={vaultAddress ?? ''}
              image="https://assets.fuel.network/providers/eth.svg"
              avatar={true}
            />
          </HStack>
        )}
        <HStack w="full" mt={3}>
          <SectionItem
            title={asset?.name ?? ''}
            description={network}
            image={asset?.image ?? ''}
            imageNetwork={imageNetwork ?? ''}
          />
          <VStack w="full" align="flex-end" gap={0}>
            <Text color="grey.50" fontSize={14} fontWeight={500}>
              {amount && asset?.symbol ? `${amount} ${asset?.symbol} ` : '-'}
            </Text>

            <Text color="grey.250" fontSize={12}>
              {amountUSD ? amountUSD : '-'}
            </Text>
          </VStack>
        </HStack>
      </VStack>
    </Card.Root>
  );
}
