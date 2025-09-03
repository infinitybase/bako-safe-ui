import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { AssetInfo } from 'fuels';
import { useState } from 'react';

import { Card } from '@/components';
import { AddressUtils, NFT } from '@/modules/core/utils';
import { useTransactionDetails } from '@/modules/transactions/hooks/context/useTransactionDetails';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useGetNftsInfos } from '../../hooks';
import { NftDialog } from './nft-dialog';
import { NftImage } from './nft-image';

const NftBalanceCard = ({
  nft,
  assets,
}: {
  nft: NFT;
  assets: {
    metadata: AssetInfo | null;
    id: string;
    fees: [string, string];
    __typename: 'Asset';
  }[];
}) => {
  const [stepTosell, setStepTosell] = useState(false);

  const {
    nftList,
    screenSizes: { isLitteSmall },
  } = useWorkspaceContext();

  const { isPendingSigner } = useTransactionDetails();

  const { nftsInfo, nftImageUrl } = useGetNftsInfos({
    assetId: nft.assetId,
    nftList,
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleList = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setStepTosell(true);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setStepTosell(false);
  };

  if (!nftsInfo) return null;

  const nftName =
    nftsInfo.symbol || nftsInfo.metadata.name || nftsInfo.name
      ? `${nftsInfo.symbol || ''} ${nftsInfo.metadata.name || nftsInfo.name || ''}`.trim()
      : AddressUtils.format(nftsInfo.assetId, 10);

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
            isTruncated
          >
            {nftName}
          </Text>
          <Button
            variant="primary"
            size="sm"
            w="100%"
            borderRadius="4px"
            h="24px"
            onClick={handleList}
            isDisabled={isPendingSigner}
          >
            List
          </Button>
        </VStack>
      </Card>

      <NftDialog
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        nftsInfo={nftsInfo}
        imageSrc={nftImageUrl ?? undefined}
        setStepToSell={stepTosell}
        assets={assets}
      />
    </>
  );
};

export { NftBalanceCard };
