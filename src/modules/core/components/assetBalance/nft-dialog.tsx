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
import { useWallet } from '@fuels/react';
import { useCallback, useState } from 'react';

import { Dialog } from '@/components';
import { BTCIcon } from '@/components/icons/btc-icon';
import { ContractIcon } from '@/components/icons/contract-icon';
import type { NFT } from '@/modules/core/utils';
import ListingContent from '@/modules/garage/components/ListingContent';
import { useListAssets } from '@/modules/garage/hooks';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useBakoIDClient } from '../../hooks/bako-id';
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
  const [step, setStep] = useState(0);
  const { providerInstance } = useWorkspaceContext();
  const { wallet } = useWallet();

  const {
    handlers: { getResolverName },
  } = useBakoIDClient(providerInstance);

  const resolverName = getResolverName(
    nftsInfo.owner ?? wallet?.address.b256Address,
  );

  const metadataArray = Object.entries(nftsInfo.metadata || {}).filter(
    ([key]) => !['attributes'].includes(key),
  );

  const handleChangeStepToDetails = useCallback(() => {
    setStep(0);
  }, [setStep]);

  const { assets } = useListAssets();

  const handleCloseListDialog = () => {
    onClose();
    setStep(0);
  };

  return (
    <Dialog.Modal
      size={{
        base: 'full',
        sm: '5xl',
      }}
      onClose={onClose}
      isOpen={isOpen}
      modalContentProps={{
        borderWidth: '1px',
        borderColor: 'gradients.transaction-border',
        px: 6,
        py: 6,
        borderRadius: '6px',
      }}
    >
      <Dialog.Body
        h="full"
        display="flex"
        flexDirection={{ base: 'column', md: 'row' }}
        alignItems={{ base: 'center', md: 'stretch' }}
        justifyContent="space-between"
        gap={4}
        p={0}
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

        {step === 1 ? (
          <ListingContent
            assetId={nftsInfo.assetId}
            name={nftsInfo.name}
            onCancel={handleChangeStepToDetails}
            onClose={handleCloseListDialog}
            userWithHandle={!!resolverName}
            assets={assets}
            nftImage={nftsInfo.metadata?.image ?? ''}
          />
        ) : (
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

              <Button
                variant="primary"
                size="sm"
                mt={3}
                w="100%"
                onClick={() => setStep(1)}
              >
                List
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
                  {metadataArray.map(([key, value]) => (
                    <NftMetadataBlock
                      key={key}
                      value={String(value)}
                      title={key}
                    />
                  ))}

                  {nftsInfo.metadata?.attributes?.map((attr) => (
                    <NFTText
                      key={attr.trait_type}
                      value={attr.trait_type}
                      title={`attributes: ${attr.trait_type}`}
                    />
                  ))}

                  {!nftsInfo.metadata?.attributes?.length &&
                    metadataArray.length === 0 && (
                      <Text fontSize="sm" color="section.500">
                        Empty metadata.
                      </Text>
                    )}
                </Flex>
              </Stack>
            </Box>
          </VStack>
        )}
      </Dialog.Body>
    </Dialog.Modal>
  );
};
