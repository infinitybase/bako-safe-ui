import { Box, Text, VStack } from 'bako-ui';
import { useState } from 'react';

import { Card } from '@/components';
import { AddressUtils, NFT } from '@/modules/core/utils';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { useGetNftsInfos } from '../../hooks';
import { NftDialog } from './nft-dialog';
import { NftImage } from './nft-image';

const NftBalanceCard = ({ nft }: { nft: NFT }) => {
  const {
    nftList,
    screenSizes: { isLitteSmall },
  } = useWorkspaceContext();

  const { nftsInfo, nftImageUrl } = useGetNftsInfos({
    assetId: nft.assetId,
    nftList,
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  if (!nftsInfo) return null;

  return (
    <>
      <Card
        p={isLitteSmall ? 1 : 2}
        borderRadius={isLitteSmall ? 5 : 8}
        borderWidth="1px"
        borderColor="gradients.transaction-border"
        backgroundColor="dark.50"
        backgroundImage="gradients.transaction-card"
        backdropFilter="blur(6px)"
        boxShadow="lg"
        onClick={() => {
          setDialogOpen(true);
        }}
        cursor="pointer"
      >
        <VStack alignItems="flex-start" gap={isLitteSmall ? 1 : 2}>
          <Box
            w="full"
            aspectRatio={1}
            minW={{
              base: '100px',
              sm: '120px',
              md: '150px',
            }}
            borderRadius={5}
            position="relative"
            overflow="hidden"
          >
            <NftImage src={nftImageUrl ?? undefined} />
          </Box>
          <Text
            fontSize={isLitteSmall ? 'xs' : 'sm'}
            color="grey.50"
            maxW="full"
            truncate
          >
            {nftsInfo.symbol || nftsInfo.name || nftsInfo.metadata.name
              ? `${nftsInfo.symbol || ''} ${nftsInfo.name || nftsInfo.metadata.name || ''}`.trim()
              : AddressUtils.format(nftsInfo.assetId, 10)}
          </Text>
        </VStack>
      </Card>

      <NftDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        nftsInfo={nftsInfo}
        imageSrc={nftImageUrl ?? undefined}
      />
    </>
  );
};

export { NftBalanceCard };
