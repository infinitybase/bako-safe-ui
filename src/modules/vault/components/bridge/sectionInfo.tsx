import {
  Avatar,
  Box,
  Card,
  HStack,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useMemo } from 'react';

import { AddressUtils } from '@/modules/core';

import { useVaultInfosContext } from '../../VaultInfosProvider';
import { AssetItem } from './modalSelectAssets';

export interface SectionInfoBridgeProps {
  direction: 'From' | 'To';
  network: string;
  asset: AssetItem | null;
  imageNetwork?: string;
  amount?: string;
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
  return (
    <HStack w="full" align="center">
      {avatar ? (
        <Avatar
          borderRadius={6}
          bgColor="grey.950"
          color="grey.75"
          name={title}
          boxShadow="0px 1.5px 1.5px 0px rgba(0, 0, 0, 0.4);"
          boxSize="30px"
          sx={{
            '& div': { fontSize: '12px' },
          }}
        />
      ) : (
        <Box position="relative" w="32px" h="32px">
          <Image src={image} boxSize={8} />
          <Image
            src={imageNetwork}
            boxSize={4}
            position="absolute"
            bottom={0}
            right={0}
            transform="translate(25%, 25%)"
            borderRadius="full"
            border="1px solid"
          />
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
    <Card variant="outline" paddingX={3} paddingY={2} w="full">
      <VStack p={0} gap={0}>
        <HStack width="full">
          <HStack gap={2} align={'center'}>
            <Text color="#AAA6A1" fontSize={12}>
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
              {`${amount} ${asset?.symbol} `}
            </Text>

            <Text color="grey.250" fontSize={12}>
              {amountUSD}
            </Text>
          </VStack>
        </HStack>
      </VStack>
    </Card>
  );
}
