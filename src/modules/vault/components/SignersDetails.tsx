import {
  Badge,
  Box,
  chakra,
  HStack,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { Card, CustomSkeleton } from '@/components';
import { AddressUtils, Pages } from '@/modules/core';

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

const SignersDetails = (props: SignersDetailsProps) => {
  const navigate = useNavigate();
  const { vault } = props;

  const isBig = !vault?.members ? 0 : vault?.members.length - 4;

  if (!vault) return null;

  const owner = vault.members?.find((member) => member.id === vault.owner?.id);
  const notOwners =
    vault.members?.filter((member) => member.id !== vault.owner?.id) ?? [];

  const members = [owner, ...notOwners];

  return (
    <Box>
      <HStack alignItems="flex-start" mb={5} w="full" spacing={2}>
        <Text color="grey.200" fontWeight="semibold" fontSize="20px">
          Signers
        </Text>
        <Badge p={1} variant="warning">
          Required signers {vault?.minSigners}/{vault.members?.length}
        </Badge>
      </HStack>
      <VStack spacing={5}>
        {members?.map((member, index: number) => {
          const hasNickname = member?.nickname;
          const isOwner = member?.id === owner?.id;

          if (isBig > 0 && index > 3) return;

          if (isBig > 0 && index == 3) {
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
                      navigate(Pages.vaultSettings({ vaultId: vault.id! }))
                    }
                  >
                    <Text variant="description" fontSize="lg" fontWeight="bold">
                      +{isBig + 1}
                    </Text>
                    <Text variant="description" fontSize="md">
                      View all
                    </Text>
                  </HStack>
                </SignerCard>
              </CustomSkeleton>
            );
          }

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
      </VStack>
    </Box>
  );
};

export { SignersDetails };
