import { Box, Card, Text } from 'bako-ui';
import { memo, useState } from 'react';

import { AddressUtils, NFT } from '@/modules/core/utils';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { useGetNftsInfos } from '../../hooks';
import { NftDialog } from './nft-dialog';
import { NftImage } from './nft-image';

const NftBalanceCard = memo(function NftBalanceCard({ nft }: { nft: NFT }) {
  const { nftList } = useWorkspaceContext();

  const { nftsInfo, nftImageUrl } = useGetNftsInfos({
    assetId: nft.assetId,
    nftList,
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  if (!nftsInfo) return null;

  return (
    <>
      <Card.Root
        variant="subtle"
        bg="bg.panel"
        transition="background-color 0.3s ease"
        _hover={{
          bg: 'bg.muted',
          '& .nftImage': { transform: 'scale(1.1)' },
        }}
        rounded="16px"
        onClick={() => {
          setDialogOpen(true);
        }}
        cursor="pointer"
        overflow="hidden"
      >
        <Box
          w="full"
          aspectRatio={1}
          minW={{
            base: '100px',
            sm: '120px',
            md: '150px',
          }}
          position="relative"
          overflow="hidden"
        >
          <NftImage src={nftImageUrl ?? undefined} />
        </Box>
        <Card.Body>
          <Text
            fontSize="sm"
            color="gray.50"
            truncate
            textAlign="center"
            letterSpacing="wider"
          >
            {nftsInfo.symbol || nftsInfo.name || nftsInfo.metadata.name
              ? `${nftsInfo.symbol || ''} ${nftsInfo.name || nftsInfo.metadata.name || ''}`.trim()
              : AddressUtils.format(nftsInfo.assetId, 10)}
          </Text>
        </Card.Body>
      </Card.Root>

      <NftDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        nftsInfo={nftsInfo}
        imageSrc={nftImageUrl ?? undefined}
      />
    </>
  );
});

export { NftBalanceCard };
