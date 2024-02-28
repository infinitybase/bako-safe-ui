import {
  Badge,
  Box,
  chakra,
  Grid,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { Card, CustomSkeleton } from '@/components';
import { useAddressBook } from '@/modules/addressBook';
import { useAuth } from '@/modules/auth';
import { useScreenSize } from '@/modules/core/hooks';
import { SignersDetailsProps } from '@/modules/core/models/predicate';
import { Pages } from '@/modules/core/routes';

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
  const { contactByAddress } = useAddressBook();
  const {
    workspaces: { current },
  } = useAuth();

  const isBig = !vault?.members ? 0 : vault?.members.length - 4;

  const owner = vault.members?.find((member) => member.id === vault.owner?.id);
  const notOwners =
    vault.members?.filter((member) => member.id !== vault.owner?.id) ?? [];

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
                    navigate(
                      Pages.vaultSettings({
                        vaultId: vault.id!,
                        workspaceId: current,
                      }),
                    )
                  }
                >
                  <Text
                    variant="description"
                    fontSize={{ base: 'md', sm: 'lg' }}
                    fontWeight="bold"
                  >
                    +{isBig + 1}
                  </Text>
                  <Text
                    variant="description"
                    fontSize={{ base: 'sm', sm: 'md' }}
                  >
                    View all
                  </Text>
                </HStack>
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
                  ? contactByAddress(member?.address)?.nickname ?? undefined
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

const SignersDetails = ({ vault }: SignersDetailsProps) => {
  const { isMobile } = useScreenSize();

  if (!vault) return null;

  return (
    <Box w={{ base: 'full', sm: 'md' }}>
      <HStack alignItems="flex-start" mb={5} w="full" spacing={8}>
        <Text
          color="grey.400"
          fontWeight="semibold"
          fontSize={{ base: 'md', sm: 'xl' }}
        >
          Signers
        </Text>
        <Badge p={1} rounded="xl" px={4} fontWeight="semibold" variant="gray">
          Required signers {vault?.minSigners}/{vault.members?.length}
        </Badge>
      </HStack>
      {isMobile ? (
        <Grid templateColumns="repeat(2, 1fr)" gap={3}>
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
