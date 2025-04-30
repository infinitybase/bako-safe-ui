import {
  Box,
  CloseButton,
  Flex,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Dialog } from '@/components';
import { BTCIcon } from '@/components/icons/btc-icon';
import { ContractIcon } from '@/components/icons/contract-icon';
import { NFT } from '@/modules/core/utils';
import { NFTText } from './nft-text';
import { NftImage } from './nft-image';

type NftDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  nftsInfo: NFT;
  imageSrc?: string;
};

export const NftDialog = ({
  isOpen,
  onClose,
  nftsInfo,
  imageSrc,
}: NftDialogProps) => (
  <Dialog.Modal
    size={{ base: '5xl', md: '4xl' }}
    onClose={onClose}
    isOpen={isOpen}
  >
    <Dialog.Body
      h="full"
      display="flex"
      flexDirection={{ base: 'column-reverse', md: 'row' }}
      alignItems={{ base: 'center', md: 'stretch' }}
      justifyContent="space-between"
      gap={6}
      pt={3}
      pl={3}
      pr={3}
    >
      <Box
        w="full"
        maxW="432px"
        flexShrink={0}
        position="relative"
        borderRadius="xl"
        overflow="hidden"
      >
        <Box w="full" aspectRatio={1} position="relative">
          <NftImage src={imageSrc} />
        </Box>

        <Flex
          wrap="wrap"
          gap={3}
          mt={3}
          justifyContent="space-between"
          w="full"
        >
          <NFTText
            value={nftsInfo.assetId ?? ''}
            title="Asset ID"
            isCopy
            icon={<BTCIcon />}
            flex="1"
            minW="200px"
          />
          <NFTText
            value={nftsInfo.contractId ?? ''}
            title="Contract Address"
            isCopy
            icon={<ContractIcon />}
            flex="1"
            minW="200px"
          />
        </Flex>
      </Box>

      <VStack
        flex={1}
        justifyContent="space-between"
        alignItems="flex-start"
        w="full"
        h="full"
      >
        <Flex w="full" alignItems="center" justifyContent="space-between">
          <Heading fontSize="xl" noOfLines={1}>
            {nftsInfo.name || nftsInfo.metadata?.name || 'NFT Details'}
          </Heading>
          <CloseButton onClick={onClose} />
        </Flex>

        <Box
          flex={1}
          mt={6}
          maxH="calc(100vh - 300px)"
          overflowY="auto"
          pr={3}
          sx={{
            '&::-webkit-scrollbar': {
              width: '8px',
              backgroundColor: 'grey.900',
              borderRadius: '30px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'brand.500',
              borderRadius: '30px',
            },
          }}
        >
          <Box mb={6}>
            <Heading fontSize="md">Description</Heading>
            <Text mt={3} fontSize="sm" color="section.500">
              {nftsInfo.description ||
                nftsInfo.metadata?.description ||
                'Description not provided.'}
            </Text>
          </Box>

          <Box mb={3}>
            <Heading fontSize="md">Metadata</Heading>
            <Flex
              maxH={{ base: 'none', md: '294px' }}
              overflowY={{ base: 'hidden', md: 'auto' }}
              direction="row"
              wrap="wrap"
              gap={3}
              mt={7}
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
              {Object.entries(nftsInfo.metadata || {})
                .filter(
                  ([key]) =>
                    key !== 'name' &&
                    key !== 'description' &&
                    key !== 'attributes',
                )
                .map(([key, value]) => (
                  <NFTText key={key} value={String(value)} title={key} />
                ))}

              {nftsInfo.metadata?.attributes?.map((attr) => (
                <NFTText
                  key={attr.trait_type}
                  value={attr.trait_type}
                  title={`attributes: ${attr.trait_type}`}
                />
              ))}

              {!nftsInfo.metadata?.attributes?.length &&
                Object.entries(nftsInfo.metadata || {}).filter(
                  ([key]) =>
                    key !== 'name' &&
                    key !== 'description' &&
                    key !== 'attributes',
                ).length === 0 && (
                  <Text fontSize="sm" color="section.500">
                    Empty metadata.
                  </Text>
                )}
            </Flex>
          </Box>
        </Box>
      </VStack>
    </Dialog.Body>
  </Dialog.Modal>
);
