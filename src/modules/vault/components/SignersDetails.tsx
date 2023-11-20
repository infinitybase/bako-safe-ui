import {
  Badge,
  Box,
  chakra,
  HStack,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { Card, CustomSkeleton } from '@/components';
import { Pages } from '@/modules/core';

import { AddressUtils } from '../../core/utils/address';
import { UseVaultDetailsReturn } from '../hooks/details';

export interface SignersDetailsProps {
  vault: UseVaultDetailsReturn['vault'];
}

const SignerCard = chakra(Card, {
  baseStyle: {
    w: 'full',
    py: 5,
    px: 6,
    bgColor: 'dark.300',
    flex: 1,
  },
});

const SignersDetails = (props: SignersDetailsProps) => {
  const navigate = useNavigate();
  const { vault } = props;

  const formatList = (list: { address: string; isOwner: boolean }[]) => {
    return list.length - 4;
  };

  const isBig = formatList(vault?.signers || []);

  if (!vault) return null;

  const signers = vault.completeSigners ?? vault.signers;

  return (
    <Box>
      <HStack alignItems="flex-start" mb={5} w="full" spacing={2}>
        <Text color="grey.200" fontWeight="semibold" fontSize="20px">
          Signers
        </Text>
        <Badge p={1} variant="warning">
          Required signers {vault?.minSigners}/{vault?.signers?.length}
        </Badge>
      </HStack>
      <VStack spacing={5}>
        {signers?.map((signer, index: number) => {
          if (isBig > 0 && index > 3) return;
          if (isBig > 0 && index == 3) {
            return (
              <CustomSkeleton isLoaded={!vault.isLoading} key={index}>
                <SignerCard borderStyle="dashed">
                  <HStack
                    w="100%"
                    spacing={0}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                    cursor="pointer"
                    onClick={() =>
                      navigate(Pages.vaultSettings({ vaultId: vault.id! }))
                    }
                  >
                    <Text variant="description" fontSize="lg" fontWeight="bold">
                      +{isBig + 1}
                    </Text>
                    <Text variant="description" fontSize="md">
                      View all
                    </Text>
                  </HStack>
                </SignerCard>
              </CustomSkeleton>
            );
          }
          return (
            <CustomSkeleton isLoaded={!vault.isLoading} key={index}>
              <SignerCard key={index}>
                <HStack spacing={4} w="full">
                  <Image borderRadius={10} src={signer.avatar} boxSize="38px" />
                  <VStack
                    h="full"
                    minH={51}
                    spacing={1}
                    justifyContent="center"
                    alignItems="start"
                  >
                    {signer?.isOwner && (
                      <Badge py={0} variant="success">
                        owner
                      </Badge>
                    )}
                    <Text
                      color="grey.200"
                      fontWeight="semibold"
                      fontSize="lg"
                      noOfLines={1}
                    >
                      {signer.nickname ?? AddressUtils.format(signer.address)}
                    </Text>
                  </VStack>
                </HStack>
              </SignerCard>
            </CustomSkeleton>
          );
        })}
      </VStack>
    </Box>
  );
};

export { SignersDetails };
