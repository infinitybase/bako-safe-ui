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
  const members = vault.members;

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
          {members?.map((member, index: number) => {
            const hasNickname = member?.nickname;
            const isOwner = vault.owner?.id === member.id;

            return (
              <CustomSkeleton isLoaded={!vault.isLoading} key={index}>
                <SignerCard key={index}>
                  <HStack spacing={4} w="full">
                    <Image
                      borderRadius={10}
                      src={member?.avatar}
                      boxSize="38px"
                    />
                    <VStack
                      h="full"
                      minH={51}
                      maxW={600}
                      spacing={0}
                      justifyContent="center"
                      alignItems="start"
                    >
                      <HStack>
                        {hasNickname && (
                          <Text
                            fontSize="lg"
                            color="grey.200"
                            fontWeight="semibold"
                            maxW={isOwner ? 100 : 150}
                            isTruncated
                          >
                            {member?.nickname}
                          </Text>
                        )}
                        {isOwner && (
                          <Badge py={0} variant="success">
                            owner
                          </Badge>
                        )}
                      </HStack>

                      <Text
                        maxW={{ md: 200, lg: 250, '2xl': '100%' }}
                        fontSize="md"
                        color={hasNickname ? 'grey.500' : 'grey.200'}
                        fontWeight={hasNickname ? 'regular' : 'bold'}
                        textOverflow="ellipsis"
                        isTruncated
                      >
                        {/* todo: add nickname on bsafe sdk */}
                        {AddressUtils.format(member?.address ?? '')}
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
