import {
  Badge,
  Box,
  BoxProps,
  chakra,
  Grid,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { Card, CustomSkeleton } from '@/components';
import { useAddressNicknameResolver } from '@/modules/core/hooks/useAddressNicknameResolver';
import { SignersDetailsProps } from '@/modules/core/models/predicate';
import { Pages } from '@/modules/core/routes';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { UseVaultDetailsReturn } from '../hooks';
import { CardMember } from './CardMember';

interface SignersListProps extends SignersDetailsProps {
  isGrid?: boolean;
}

const SignerCard = chakra(Card, {
  base: {
    w: 'full',
    h: 'full',
    p: 3,
    bgColor: 'dark.300',
    flex: 1,
  },
});

const SignersList = ({ vault, isGrid }: SignersListProps) => {
  const navigate = useNavigate();

  const {
    authDetails: { userInfos },
    screenSizes: { isLarge },
    addressBookInfos: {
      requests: { listContactsRequest },
    },
  } = useWorkspaceContext();

  const maxItems = 4;

  const isBig = !vault?.data?.members
    ? 0
    : vault?.data?.members.length - (maxItems + 1);

  const owner = vault.data?.members?.find(
    (member) => member.id === vault.data?.owner?.id,
  );
  const notOwners =
    vault.data?.members?.filter(
      (member) => member.id !== vault.data?.owner?.id,
    ) ?? [];

  // Order members with owner in first position
  const members = [owner, ...notOwners];

  const { resolveAddressContactHandle, isLoading } = useAddressNicknameResolver(
    members.filter((m) => !!m).map((m) => m!.address),
  );

  return (
    <>
      {members?.map((member, index: number) => {
        if (isBig > 0 && index > maxItems) return;

        if (isBig > 0 && index == maxItems) {
          return (
            <CustomSkeleton loading={vault.isLoading && isLoading} key={index}>
              <SignerCard
                borderStyle="dashed"
                bg="gradients.transaction-card"
                borderColor="gradients.transaction-border"
                backdropFilter="blur(6px)"
                h={isLarge ? 68 : 86}
              >
                <VStack
                  w="100%"
                  h="full"
                  gap={0}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  cursor="pointer"
                  onClick={() =>
                    navigate(
                      Pages.vaultSettings({
                        vaultId: vault.data?.id ?? '',
                        workspaceId: userInfos.workspace?.id,
                      }),
                    )
                  }
                >
                  <Text fontSize={{ base: 'md', sm: 'lg' }} fontWeight="bold">
                    +{isBig + 1}
                  </Text>
                  <Text fontSize={{ base: 'sm', sm: 'md' }}>View all</Text>
                </VStack>
              </SignerCard>
            </CustomSkeleton>
          );
        }
        const handleInfo = listContactsRequest.data?.find(
          (contact) => contact.handle_info?.resolver === member?.address,
        )?.handle_info;

        const _member = member?.address
          ? resolveAddressContactHandle(
              member.address,
              handleInfo?.handle,
              handleInfo?.resolver,
            )
          : undefined;

        return (
          <CustomSkeleton loading={vault.isLoading && isLoading} key={index}>
            <CardMember
              hasAdd={false}
              isOwner={member?.id === owner?.id}
              isGrid={isGrid}
              member={{
                ...member,
                nickname: _member?.contact,
                handle: _member?.handle,
                avatar: member?.avatar ?? '',
                address: member?.address ?? '',
              }}
            />
          </CustomSkeleton>
        );
      })}
    </>
  );
};

export interface ISignersDetailsExtendedProps extends BoxProps {
  vault: UseVaultDetailsReturn['vault'];
}

const SignersDetails = ({ vault, ...rest }: ISignersDetailsExtendedProps) => {
  const {
    screenSizes: { isLarge, isLargerThan680, isExtraLarge },
  } = useWorkspaceContext();

  if (!vault) return null;

  return (
    <Box w={isLarge ? 'full' : 'md'} {...rest}>
      <HStack
        alignItems="center"
        justify="flex-start"
        mb={4}
        w="full"
        gap={3}
        // h="20px"
      >
        <Text
          color="grey.50"
          fontWeight={700}
          fontSize="sm"
          lineHeight="16.94px"
        >
          Signers
        </Text>
        <Badge
          rounded="xl"
          px={'6px'}
          py={'4px'}
          fontWeight="medium"
          lineHeight="12.1px"
          fontSize="xs"
          color="grey.75"
          colorPalette="gray"
          border="1px solid #F5F5F540"
        >
          Required signers {vault.data?.configurable?.SIGNATURES_COUNT ?? 0}/
          {vault.data?.members?.length}
        </Badge>
      </HStack>

      {isLarge ? (
        <Grid
          templateColumns={{
            base: 'repeat(1, 1fr)',
            sm: isLargerThan680 ? 'repeat(2, 1fr)' : 'repeat(1, 1fr)',
            md: isExtraLarge ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
          }}
          gap={3}
          w="full"
        >
          <SignersList vault={vault} />
        </Grid>
      ) : (
        <VStack gap={3}>
          <SignersList vault={vault} isGrid={false} />
        </VStack>
      )}
    </Box>
  );
};

export { SignersDetails };
