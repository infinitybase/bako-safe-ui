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

  const {
    workspaces: { current },
    isSingleWorkspace,
  } = useAuth();

  const { contactByAddress } = useAddressBook(!isSingleWorkspace);

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
                        vaultId: vault.id!,
                        workspaceId: current,
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
  const { vaultRequiredSizeToColumnLayout } = useScreenSize();

  if (!vault) return null;

  return (
    <Box w={{ base: 'full', lg: 'md' }} mb={4}>
      <HStack
        alignItems="center"
        justify="flex-start"
        mb={5}
        w="full"
        spacing={3}
      >
        <Text
          color="grey.400"
          fontWeight="medium"
          fontSize={{ base: 'md', sm: 'xl' }}
        >
          Signers
        </Text>
        <Badge p={0} rounded="lg" px={3} fontWeight="medium" variant="gray">
          Required signers {vault?.minSigners}/{vault.members?.length}
        </Badge>
      </HStack>

      {vaultRequiredSizeToColumnLayout ? (
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
