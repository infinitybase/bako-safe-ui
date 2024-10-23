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

import { Card, CustomSkeleton } from '@ui/components';
import { SignersDetailsProps } from '@/modules/core/models/predicate';
import { Pages } from '@/modules/core/routes';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { UseVaultDetailsReturn } from '../hooks';
import { CardMember } from './CardMember';

const SignerCard = chakra(Card, {
  baseStyle: {
    w: 'full',
    h: 'full',
    py: { base: 3, sm: 5 },
    px: { base: 3, sm: 6 },
    bgColor: 'dark.300',
    flex: 1,
  },
});

const SignersList = ({ vault }: SignersDetailsProps) => {
  const navigate = useNavigate();

  const {
    authDetails: { userInfos },
    addressBookInfos: {
      handlers: { contactByAddress },
    },
  } = useWorkspaceContext();

  const isBig = !vault?.data?.members ? 0 : vault?.data?.members.length - 4;

  const owner = vault.data?.members?.find(
    (member) => member.id === vault.data?.owner?.id,
  );
  const notOwners =
    vault.data?.members?.filter(
      (member) => member.id !== vault.data?.owner?.id,
    ) ?? [];

  // Order members with owner in first position
  const members = [owner, ...notOwners];

  return (
    <>
      {members?.map((member, index: number) => {
        const max = 3;

        if (isBig > 0 && index > max) return;

        if (isBig > 0 && index == max) {
          return (
            <CustomSkeleton isLoaded={!vault.isLoading} key={index}>
              <SignerCard
                borderStyle="dashed"
                bg="grey.825"
                borderColor="grey.550"
                backdropFilter="blur(8px)"
                h={{ base: '4.5em', lg: '8em' }}
              >
                <VStack
                  w="100%"
                  h="full"
                  spacing={0}
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

        return (
          <CustomSkeleton isLoaded={!vault.isLoading} key={index}>
            <CardMember
              isOwner={member?.id === owner?.id}
              member={{
                ...member,
                nickname: member?.address
                  ? (contactByAddress(member?.address)?.nickname ?? undefined)
                  : undefined,
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
    screenSizes: { isLarge },
  } = useWorkspaceContext();

  if (!vault) return null;

  return (
    <Box w={isLarge ? 'full' : 'md'} {...rest}>
      <HStack
        alignItems="center"
        justify="flex-start"
        mb={4}
        w="full"
        spacing={3}
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
          variant="gray"
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
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
          }}
          gap={3}
          w="full"
        >
          <SignersList vault={vault} />
        </Grid>
      ) : (
        <VStack spacing={5}>
          <SignersList vault={vault} />
        </VStack>
      )}
    </Box>
  );
};

export { SignersDetails };
