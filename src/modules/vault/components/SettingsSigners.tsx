import { Badge, Box, Grid, HStack, Text } from 'bako-ui';

import { CustomSkeleton } from '@/components';
import { useScreenSize } from '@/modules/core';
import { useAddressNicknameResolver } from '@/modules/core/hooks/useAddressNicknameResolver';
import { SignersDetailsProps } from '@/modules/core/models/predicate';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { CardMember } from './CardMember';

const SettingsSigners = ({ vault }: SignersDetailsProps) => {
  const { isLargerThan1700, isExtraLarge, isLargerThan680 } = useScreenSize();
  const { resolveAddressContactHandle } = useAddressNicknameResolver();

  const {
    addressBookInfos: {
      requests: { listContactsRequest },
    },
  } = useWorkspaceContext();

  if (!vault) return null;
  const members = vault?.data?.members;

  return (
    <Box w="full">
      <HStack alignItems="center" mb={5} w="full" gap={4}>
        <Text color="grey.50" fontWeight="bold" fontSize="sm">
          Signers
        </Text>
        <Badge
          p={0.1}
          rounded="lg"
          px={3}
          fontWeight="medium"
          colorPalette="gray"
        >
          Required signers {vault.data?.configurable?.SIGNATURES_COUNT ?? 0}/
          {vault.data?.members?.length}
        </Badge>
      </HStack>
      <Grid
        w="full"
        templateColumns={{
          base: 'repeat(1, 1fr)',
          sm: isLargerThan680 ? 'repeat(2, 1fr)' : 'repeat(1, 1fr)',
          md: isExtraLarge ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
          '2xl': isLargerThan1700 ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
        }}
        gap={3}
        mb={16}
      >
        {members?.map((member, index: number) => {
          const handleInfo = listContactsRequest.data?.find(
            (contact) => contact.handle_info?.resolver === member.address,
          )?.handle_info;

          const { contact, handle } = resolveAddressContactHandle(
            member.address,
            handleInfo?.handle,
            handleInfo?.resolver,
          );

          return (
            <CustomSkeleton loading={vault.isLoading} key={index}>
              <CardMember
                hasAdd={false}
                isOwner={vault?.data?.owner?.id === member.id}
                member={{
                  ...member,
                  nickname: contact,
                  handle,
                }}
              />
            </CustomSkeleton>
          );
        })}
      </Grid>
    </Box>
  );
};

export { SettingsSigners };
