import { Box, Text, VStack } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components';
import { AddressUtils, NFT } from '@/modules/core/utils';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import { useGetNftsInfos } from '../../hooks';
import { NftImage } from './nft-image';
import { NftDialog } from './nft-dialog';

const FALLBACK_IMAGE = '/nft-empty.svg';

const NftBalanceCard = ({ nft }: { nft: NFT }) => {
  const {
    nftList,
    screenSizes: { isLitteSmall },
  } = useWorkspaceContext();

  const { nftsInfo, nftImageUrl } = useGetNftsInfos({
    assetId: nft.assetId,
    nftList,
  });

  const [imageSrc, setImageSrc] = useState<string>(
    nftImageUrl || FALLBACK_IMAGE,
  );
  const [imageLoaded, setImageLoaded] = useState(false);
  const [modalImageLoaded, setModalImageLoaded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadImage = (src: string, fallback: string) => {
    setImageLoaded(false);
    const img = new window.Image();
    const onLoad = () => {
      clearTimeout(timeoutRef.current!);
      setImageLoaded(true);
      setImageSrc(src);
    };
    const onError = () => {
      clearTimeout(timeoutRef.current!);
      setImageLoaded(true);
      setImageSrc(fallback);
    };
    timeoutRef.current = setTimeout(onError, 6000);
    img.onload = onLoad;
    img.onerror = onError;
    img.src = src;
    if (img.complete) onLoad();
  };

  useEffect(() => {
    if (nftImageUrl) loadImage(nftImageUrl, FALLBACK_IMAGE);
    else {
      setImageSrc(FALLBACK_IMAGE);
      setImageLoaded(true);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [nftImageUrl]);

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
          loadImage(nftImageUrl || '', FALLBACK_IMAGE);
          setModalImageLoaded(false);
        }}
        cursor="pointer"
      >
        <VStack alignItems="flex-start" gap={isLitteSmall ? 1 : 2}>
          <Box
            w="full"
            aspectRatio={1}
            borderRadius={5}
            position="relative"
            overflow="hidden"
          >
            <NftImage
              loaded={imageLoaded}
              src={imageSrc}
              fallback={FALLBACK_IMAGE}
              setLoaded={setImageLoaded}
              setSrc={setImageSrc}
            />
          </Box>
          <Text
            fontSize={isLitteSmall ? 'xs' : 'sm'}
            color="grey.50"
            maxW="full"
            isTruncated
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
        modalImageLoaded={modalImageLoaded}
        setModalImageLoaded={setModalImageLoaded}
        imageSrc={imageSrc}
        setImageSrc={setImageSrc}
        fallback={FALLBACK_IMAGE}
      />
    </>
  );
};

export { NftBalanceCard };
