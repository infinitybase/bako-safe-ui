import {
  Badge,
  Box,
  chakra,
  Grid,
  HStack,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';

import { Card, CustomSkeleton } from '@/components';

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

const SettingsSigners = ({ vault }: SignersDetailsProps) => {
  if (!vault) return null;

  const signerColumnsAmount = 3;
  const signers = vault.completeSigners ?? vault.signers;

  return (
    <Box>
      <HStack alignItems="center" mb={5} w="full" spacing={3}>
        <Text color="grey.200" fontWeight="semibold" fontSize="20px">
          Signers
        </Text>
        <Badge p={2} variant="warning" h={5}>
          Required signers {vault?.minSigners}/{vault?.signers?.length}
        </Badge>
      </HStack>
      <VStack spacing={5}>
        <Grid
          w="100%"
          templateColumns={`repeat(${signerColumnsAmount}, 1fr)`}
          gap={6}
          mb={16}
        >
          {signers?.map((signer, index: number) => {
            return (
              <CustomSkeleton isLoaded={!vault.isFetching} key={index}>
                <SignerCard>
                  <HStack spacing={4} w="full">
                    <Image
                      borderRadius={10}
                      src={signer.avatar}
                      boxSize="38px"
                    />
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
                        {AddressUtils.format(signer.address)}
                      </Text>
                    </VStack>
                  </HStack>
                </SignerCard>
              </CustomSkeleton>
            );
          })}
        </Grid>
      </VStack>
    </Box>
  );
};

export { SettingsSigners };
