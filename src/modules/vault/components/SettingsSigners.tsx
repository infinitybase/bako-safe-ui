import {
  Badge,
  Box,
  chakra,
  Grid,
  HStack,
  Image,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';

import { Card } from '@/components';
import { User } from '@/modules/core/models/user';

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
      <HStack alignItems="flex-start" mb={5} w="full" spacing={2}>
        <Text color="grey.200" fontWeight="semibold" fontSize="20px">
          Signers
        </Text>
        <Badge p={1} variant="warning">
          Required signers {vault?.minSigners}/{vault?.signers.length}
        </Badge>
      </HStack>
      <VStack spacing={5}>
        <Grid
          w="100%"
          templateColumns={`repeat(${signerColumnsAmount}, 1fr)`}
          gap={6}
          mb={16}
        >
          {Array(signerColumnsAmount)
            .fill('')
            .map((_, index) => (
              <Skeleton
                key={index}
                hidden={!vault.isLoading}
                w="full"
                h={93}
                startColor="dark.100"
                endColor="dark.300"
                borderRadius={10}
              />
            ))}

          {signers.map(
            (asset: { address: User; isOwner: boolean }, index: number) => {
              return (
                <SignerCard key={index}>
                  <HStack spacing={4} w="full">
                    <Image
                      borderRadius={10}
                      src={asset.address.avatar}
                      boxSize="38px"
                    />
                    <VStack
                      h="full"
                      minH={51}
                      spacing={1}
                      justifyContent="center"
                      alignItems="start"
                    >
                      {asset?.isOwner && (
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
                        {AddressUtils.format(asset?.address.address)}
                      </Text>
                    </VStack>
                  </HStack>
                </SignerCard>
              );
            },
          )}
        </Grid>
      </VStack>
    </Box>
  );
};

export { SettingsSigners };
