import { Box, HStack, Icon, IconButton, Text } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { UpRightArrow } from '@bako-safe/ui/components';

import { AddressUtils, shakeAnimationY } from '../../utils';

interface DefaultAsset {
  assetId: string;
  amount: string;
  name: string;
  slug: string;
  icon?: string;
}

interface AssetDetailsProps {
  assetName: string;
  assetSlug: string;
  defaultAsset: DefaultAsset;
  isNFT?: boolean;
  handleRedirect?: () => Window | null;
}

const AssetDetails = ({
  assetName,
  assetSlug,
  defaultAsset,
  isNFT = false,
  handleRedirect,
}: AssetDetailsProps) => {
  return (
    <Box maxW={{ base: '70%', lg: 'full' }}>
      <HStack>
        <Text color="grey.100" fontSize={{ base: 'sm', sm: 15 }} isTruncated>
          {isNFT
            ? AddressUtils.format(assetName ?? '', 5)
            : (assetName ?? defaultAsset.name)}
        </Text>

        {isNFT && (
          <IconButton
            icon={
              <Icon
                className="nft-icon-1"
                as={UpRightArrow}
                fontSize="md"
                color="grey.75"
              />
            }
            aria-label="Explorer"
            size="xs"
            minW={2}
            bg="none"
            h={3}
            _hover={{ bg: 'none' }}
            css={css`
              &:hover .nft-icon-1 {
                animation: ${shakeAnimationY} 0.5s ease-in-out;
              }
            `}
            onClick={handleRedirect}
          />
        )}
      </HStack>

      <Text fontWeight="bold" fontSize="xs" color="grey.400">
        {isNFT ? 'NFT' : (assetSlug ?? defaultAsset.slug)}
      </Text>
    </Box>
  );
};

export { AssetDetails };
