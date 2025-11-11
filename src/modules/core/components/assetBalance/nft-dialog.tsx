import { Box, CloseIcon, Flex, Heading, Stack, Text, VStack } from 'bako-ui';

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
      size={{ sm: 'xl', base: 'full' }}
      onOpenChange={onClose}
      open={isOpen}
      trapFocus={false}
    >
      <Dialog.Body
        h="full"
        display="flex"
        flexDirection={{ base: 'column', md: 'row' }}
        alignItems={{ base: 'center', md: 'stretch' }}
        justifyContent="space-between"
        gap={6}
        px={{ sm: 3 }}
        maxH={{ sm: '480px' }}
        overflowY={{
          md: 'hidden',
        }}
        scrollbarWidth="none"
        position="relative"
      >
        <Flex
          w="full"
          alignItems="center"
          justifyContent="space-between"
          mt={300}
          display={{
            base: 'flex',
            sm: 'none',
          }}
        >
          <Heading fontSize="lg" color="textPrimary" lineClamp={1}>
            {nftsInfo.name || nftsInfo.metadata?.name || 'NFT Details'}
          </Heading>

          <CloseIcon onClick={onClose} />
        </Flex>
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
          <NftImage src={imageSrc} rounded="16px" aspectRatio="1/1" />
        </Box>

        <VStack
          flex={1}
          justifyContent="space-between"
          alignItems="flex-start"
          maxH={{ md: '490px' }}
        >
          <Flex
            w="full"
            alignItems="center"
            justifyContent="space-between"
            display={{
              base: 'none',
              sm: 'flex',
            }}
          >
            <Heading fontSize="lg" color="textPrimary" lineClamp={1}>
              {nftsInfo.name || nftsInfo.metadata?.name || 'NFT Details'}
            </Heading>

            <CloseIcon onClick={onClose} />
          </Flex>

          <Box
            flex={1}
            mt={6}
            maxH={{ sm: 'calc(100vh - 300px)' }}
            overflowY={{
              md: 'scroll',
            }}
            scrollbarWidth="none"
          >
            <Box mb={3}>
              <Heading fontSize="md" color="textPrimary">
                Description
              </Heading>
              <Text mt={3} fontSize="xs" color="textSecondary">
                {nftsInfo.description ||
                  nftsInfo.metadata?.description ||
                  'Description not provided.'}
              </Text>
            </Box>
            <Box
              w="full"
              maxW={{ md: '432px' }}
              borderRadius="xl"
              overflow="hidden"
            >
              <Flex
                gap={3}
                mt={3}
                w="full"
                wrap={{ base: 'wrap', sm: 'nowrap' }}
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
              <Heading fontSize="md" color="textPrimary">
                Metadata
              </Heading>
              <Flex
                maxH={{ base: 'none', md: '294px' }}
                direction="row"
                wrap="wrap"
                gap={3}
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
