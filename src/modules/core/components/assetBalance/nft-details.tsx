import {
  Box,
  Button,
  CloseButton,
  Flex,
  Heading,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';

import { BTCIcon } from '@/components/icons/btc-icon';
import { ContractIcon } from '@/components/icons/contract-icon';
import { UpdateOrderStep } from '@/modules/garage/components/UpdateOrderStep';
import { OrderWithMedatada } from '@/modules/garage/types';

import { NFT } from '../../utils';
import { NftMetadataBlock } from './nft-metadata-block';
import { NFTText } from './nft-text';

type NftDetailsProps = {
  nftsInfo?: NFT;
  onClose: () => void;
  handleChangeStepToSell: () => void;
  order?: OrderWithMedatada;
  onEdit?: () => void;
  vaultId: string;
};

export const NftDetails = ({
  nftsInfo,
  onClose,
  handleChangeStepToSell,
  order,
  onEdit,
  vaultId,
}: NftDetailsProps) => {
  const metadataArray = nftsInfo?.metadata
    ? Object.entries(nftsInfo?.metadata)
        .filter(([key]) => !['attributes'].includes(key))
        .map(([key, value]) => ({
          value,
          label: key,
        }))
    : [];

  if (order) {
    return (
      <UpdateOrderStep
        order={order}
        onClose={onClose}
        onEdit={onEdit}
        vaultId={vaultId}
      />
    );
  }

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
      <Flex w="full" alignItems="center" justifyContent="space-between">
        <Heading fontSize="xl" noOfLines={1}>
          {nftsInfo?.metadata?.name || 'NFT Details'}
        </Heading>

        <CloseButton
          onClick={onClose}
          display={{ base: 'none', md: 'block' }}
        />
      </Flex>

      <Box flex={1} mt={6} maxH="calc(100vh - 300px)" pr={3}>
        <Box mb={3}>
          <Heading fontSize="md">Description</Heading>
          <Text mt={3} fontSize="sm" color="section.500">
            {nftsInfo?.metadata?.description || 'Description not provided.'}
          </Text>
        </Box>

        <Box
          w="full"
          flexShrink={0}
          position="relative"
          borderRadius="xl"
          overflow="hidden"
        >
          <Flex
            wrap="wrap"
            gap={3}
            mt={3}
            justifyContent="space-between"
            w="full"
          >
            <NFTText
              value={nftsInfo?.assetId ?? order?.asset?.id ?? ''}
              title="Asset ID"
              isCopy
              icon={<BTCIcon />}
              flex="1"
              minW="200px"
            />
            <NFTText
              value={nftsInfo?.contractId ?? order?.collection.address ?? ''}
              title="Contract Address"
              isCopy
              icon={<ContractIcon />}
              flex="1"
              minW="200px"
            />
          </Flex>
        </Box>

        <Button
          variant="primary"
          size="sm"
          mt={3}
          w="100%"
          onClick={handleChangeStepToSell}
        >
          List NFT
        </Button>

        <Stack spacing={2} mt={6}>
          <Heading fontSize="md">Metadata</Heading>
          <Flex
            maxH={{ base: 'none', md: '294px' }}
            overflowY={{ base: 'hidden', md: 'auto' }}
            direction="row"
            wrap="wrap"
            gap={3}
            pr={2}
            sx={{
              '&::-webkit-scrollbar': {
                width: '5px',
                backgroundColor: 'grey.900',
                borderRadius: '30px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'brand.500',
                borderRadius: '30px',
              },
            }}
          >
            {metadataArray.map(({ label, value }) => (
              <NftMetadataBlock
                key={label}
                value={String(value)}
                title={label}
              />
            ))}

            {nftsInfo?.metadata?.attributes?.map((attr) => (
              <NFTText
                key={attr.trait_type}
                value={attr.trait_type}
                title={`attributes: ${attr.trait_type}`}
              />
            ))}

            {!nftsInfo?.metadata?.attributes?.length &&
              metadataArray.length === 0 && (
                <Text fontSize="sm" color="section.500">
                  Empty metadata.
                </Text>
              )}
          </Flex>
        </Stack>
      </Box>
    </VStack>
  );
};
