import { Badge, Box, Grid, HStack, Text, VStack } from '@chakra-ui/react';

import { CustomSkeleton } from '@/components';
import { useAddressBook } from '@/modules/addressBook';
import { SignersDetailsProps } from '@/modules/core/models/predicate';

import { CardMember } from './CardMember';

const SettingsSigners = ({ vault }: SignersDetailsProps) => {
  const { contactByAddress } = useAddressBook();
  if (!vault) return null;
  const signerColumnsAmount = 3;
  const members = vault.members;

  return (
    <Box>
      <HStack alignItems="center" mb={5} w="full" spacing={4}>
        <Text color="grey.200" fontWeight="semibold" fontSize="20px">
          Signers
        </Text>
        <Badge p={1} rounded="xl" px={4} fontWeight="semibold" variant="gray">
          Required signers {vault?.minSigners}/{vault?.members?.length}
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
            return (
              <CustomSkeleton isLoaded={!vault.isLoading} key={index}>
                <CardMember
                  isOwner={vault.owner?.id === member.id}
                  member={{
                    ...member,
                    nickname:
                      contactByAddress(member.address)?.nickname ?? undefined,
                  }}
                />
              </CustomSkeleton>
            );
          })}
        </Grid>
      </VStack>
    </Box>
  );
};

export { SettingsSigners };
