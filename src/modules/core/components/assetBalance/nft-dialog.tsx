import {
  Box,
  CloseButton,
  Flex,
  Heading,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';

import { Dialog } from '@/components';
import { BTCIcon } from '@/components/icons/btc-icon';
import { ContractIcon } from '@/components/icons/contract-icon';
import type { NFT } from '@/modules/core/utils';

import { NftImage } from './nft-image';
import { NftMetadataBlock } from './nft-metadata-block';
import { NFTText } from './nft-text';

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
}: NftDialogProps) => {
  const metadataArray = Object.entries(nftsInfo.metadata || {}).filter(
    ([key]) => !['attributes'].includes(key),
  );

  return (
    <Dialog.Modal
      size="xl"
      onOpenChange={onClose}
      open={isOpen}
      modalContentProps={{
        borderWidth: '1px',
        borderColor: 'gradients.transaction-border',
      }}
    >
      <Dialog.Body
        h="full"
        display="flex"
        flexDirection={{ base: 'column', md: 'row' }}
        alignItems={{ base: 'center', md: 'stretch' }}
        justifyContent="space-between"
        gap={6}
        pl={3}
        pr={3}
        maxH="480px"
        overflowY={{
          base: 'scroll',
          md: 'hidden',
        }}
        style={{ scrollbarWidth: 'none' }}
        position="relative"
      >
        <Box
          boxSize={{
            base: 'full',
            sm: '330px',
            md: '480px',
          }}
          minH={{
            lg: '480px',
          }}
          mx="auto"
          borderRadius="lg"
        >
          <NftImage src={imageSrc} />
          <CloseButton
            onClick={onClose}
            display={{ base: 'block', md: 'none' }}
            ml="auto"
            position="absolute"
            top={0}
            right={4}
          />
        </Box>

        <VStack
          flex={1}
          justifyContent="space-between"
          alignItems="flex-start"
          maxH={{ md: '490px' }}
          overflowY={{
            base: 'unset',
            md: 'scroll',
          }}
          style={{ scrollbarWidth: 'none' }}
        >
          <Flex w="full" alignItems="center" justifyContent="space-between">
            <Heading fontSize="xl" lineClamp={1}>
              {nftsInfo.name || nftsInfo.metadata?.name || 'NFT Details'}
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
                {nftsInfo.description ||
                  nftsInfo.metadata?.description ||
                  'Description not provided.'}
              </Text>
            </Box>
            <Box
              w="full"
              maxW="432px"
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
                  value={nftsInfo.assetId ?? ''}
                  title="Asset ID"
                  isCopy
                  icon={<BTCIcon />}
                  flex="1"
                  minW="200px"
                  alignSelf="center"
                />
                <NFTText
                  value={nftsInfo.contractId ?? ''}
                  title="Contract Address"
                  isCopy
                  icon={<ContractIcon />}
                  flex="1"
                  minW="200px"
                  alignSelf="center"
                />
              </Flex>
            </Box>

            <Stack gap={2} mt={6}>
              <Heading fontSize="md">Metadata</Heading>
              <Flex
                maxH={{ base: 'none', md: '294px' }}
                overflowY={{ base: 'hidden', md: 'auto' }}
                direction="row"
                wrap="wrap"
                gap={3}
                pr={2}
                css={{
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
                {metadataArray.map(([key, value]) => (
                  <NftMetadataBlock
                    key={key}
                    value={String(value)}
                    title={key}
                  />
                ))}

                {Array.isArray(nftsInfo?.metadata?.attributes)
                  ? nftsInfo.metadata.attributes.map((attr) => (
                      <NFTText
                        key={attr.trait_type}
                        value={attr.trait_type}
                        title={`attributes: ${attr.trait_type}`}
                      />
                    ))
                  : null}

                {Array.isArray(nftsInfo?.metadata?.attributes)
                  ? !nftsInfo.metadata.attributes.length &&
                    metadataArray.length === 0 && (
                      <Text fontSize="sm" color="section.500">
                        Empty metadata.
                      </Text>
                    )
                  : metadataArray.length === 0 && (
                      <Text fontSize="sm" color="section.500">
                        Empty metadata.
                      </Text>
                    )}
              </Flex>
            </Stack>
          </Box>
        </VStack>
      </Dialog.Body>
    </Dialog.Modal>
  );
};
