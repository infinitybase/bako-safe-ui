import { Box, CloseButton, Flex, Heading } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { Dialog } from '@/components';
import type { NFT } from '@/modules/core/utils';
import ListingContent from '@/modules/garage/components/ListingContent';
import UpateOrderForm from '@/modules/garage/components/UpateOrderForm';
import { useListAssets } from '@/modules/garage/hooks';
import { useGetOrder } from '@/modules/garage/hooks/useGetOrder';
import { Order } from '@/modules/garage/types';
import { useVaultInfosContext } from '@/modules/vault/VaultInfosProvider';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useBakoIDClient } from '../../hooks/bako-id';
import { NftDetails } from './nft-details';
import { NftImage } from './nft-image';

type NftDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  nftsInfo?: NFT;
  imageSrc?: string;
  order?: Order;
  setStepToSell?: boolean;
};

export const NftDialog = ({
  isOpen,
  onClose,
  nftsInfo,
  imageSrc,
  order,
  setStepToSell,
}: NftDialogProps) => {
  const [step, setStep] = useState(0);

  const {
    screenSizes: { isMobile },
  } = useWorkspaceContext();

  useEffect(() => {
    setStep(setStepToSell ? 1 : 0);
  }, [setStepToSell]);

  const { vault } = useVaultInfosContext();
  const { providerInstance } = useWorkspaceContext();

  const {
    handlers: { getResolverName },
  } = useBakoIDClient(providerInstance);

  const resolverName = getResolverName(
    nftsInfo?.owner ?? vault?.data?.predicateAddress,
  );

  const { order: orderData } = useGetOrder({
    id: order?.id ?? '',
  });

  const handleChangeStepToDetails = () => {
    setStep(0);
  };

  const handleChangeStepToSell = () => {
    setStep(1);
  };

  const handleChangeStepToEdit = () => {
    setStep(2);
  };

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
          {isMobile && (
            <Flex
              w="full"
              alignItems="center"
              justifyContent="space-between"
              mb={3}
            >
              <Heading fontSize="xl" noOfLines={1}>
                {nftsInfo?.metadata?.name || 'NFT Details'}
              </Heading>

              <CloseButton onClick={onClose} />
            </Flex>
          )}
          <NftImage src={imageSrc} />
        </Box>

        {step === 0 && (
          <NftDetails
            nftsInfo={nftsInfo}
            onClose={handleCloseListDialog}
            handleChangeStepToSell={handleChangeStepToSell}
            order={orderData}
            onEdit={handleChangeStepToEdit}
            vaultId={vault?.data?.id ?? ''}
            isMobile={isMobile}
          />
        )}

        {step === 1 && (
          <ListingContent
            assetId={nftsInfo?.assetId ?? ''}
            name={nftsInfo?.metadata?.name ?? ''}
            onCancel={handleChangeStepToDetails}
            onClose={handleCloseListDialog}
            userWithHandle={!!resolverName}
            assets={assets}
            nftImage={nftsInfo?.metadata?.image ?? ''}
            vaultId={vault?.data?.id ?? ''}
          />
        )}

        {step === 2 && order && (
          <UpateOrderForm
            order={order}
            userWithHandle={!!resolverName}
            onClose={handleCloseListDialog}
            onCancel={handleChangeStepToDetails}
            vaultId={vault?.data?.id ?? ''}
          />
        )}
      </Dialog.Body>
    </Dialog.Modal>
  );
};
