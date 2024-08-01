import { Badge, Box, Grid, HStack, Text, VStack } from '@chakra-ui/react';

import { CustomSkeleton } from '@/components';
import { SignersDetailsProps } from '@/modules/core/models/predicate';

import { CardMember } from './CardMember';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const SettingsSigners = ({ vault }: SignersDetailsProps) => {
  const {
    addressBookInfos: { contactByAddress },
  } = useWorkspaceContext();
  if (!vault) return null;
  const members = vault?.data?.members;

  return (
    <Box w={{ base: 'full', sm: 'auto' }}>
      <HStack alignItems="center" mb={5} w="full" spacing={4}>
        <Text color="grey.200" fontWeight="semibold" fontSize="20px">
          Signers
        </Text>
        <Badge p={0.1} rounded="lg" px={3} fontWeight="medium" variant="gray">
          Required signers {vault?.data?.minSigners}/
          {vault?.data?.members?.length}
        </Badge>
      </HStack>
      <VStack spacing={5}>
        <Grid
          w="100%"
          templateColumns={{
            base: 'repeat(1, 1fr)',
            xs: 'repeat(3, 1fr)',
          }}
          gap={6}
          mb={16}
        >
          {members?.map((member, index: number) => {
            return (
              <CustomSkeleton isLoaded={!vault.isLoading} key={index}>
                <CardMember
                  isOwner={vault?.data?.owner?.id === member.id}
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
