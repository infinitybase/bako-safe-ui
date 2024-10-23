import {
  Avatar,
  Badge,
  chakra,
  Flex,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Card } from '@ui/components';

import { AddressUtils } from '@/modules/core';

interface CardMemberProps {
  member: {
    nickname?: string;
    avatar: string;
    address: string;
  };
  isOwner: boolean;
}

const SignerCard = chakra(Card, {
  baseStyle: {
    w: 'full',
    py: { base: 3, sm: 5 },
    px: { base: 3, sm: 6 },
    bg: 'dark.600',
    flex: 1,
  },
});

const CardMemberBagde = () => {
  return (
    <Badge py={0} ml={{ base: 0, sm: 8 }} variant="success">
      Owner
    </Badge>
  );
};

const CardMember = ({ member, isOwner }: CardMemberProps) => {
  const hasNickname = member?.nickname;

  return (
    <SignerCard
      w="full"
      h="4.49em"
      bg="grey.825"
      borderColor="grey.550"
      alignItems="center"
      display="flex"
    >
      <Flex flexDir="row" gap={{ base: 2, xs: 4 }} w="full">
        <HStack justifyContent="space-between" gap={2}>
          <Avatar
            borderRadius={8}
            src={member?.avatar}
            boxSize={{ base: '32px', xs: '40px' }}
            border="1px solid"
            borderColor="grey.75"
          />
        </HStack>

        <HStack
          h="full"
          minH={55}
          maxW={600}
          w="full"
          spacing={0}
          justifyContent="space-between"
          alignItems="center"
        >
          <VStack align="flex-start" spacing={0} justifyContent="center">
            {hasNickname && (
              <Text
                fontSize="md"
                color="grey.200"
                fontWeight="semibold"
                maxW={isOwner ? 100 : 150}
                isTruncated
              >
                {member?.nickname}
              </Text>
            )}

            <Text
              maxW={{ md: 200, lg: 250, '2xl': '100%' }}
              color={hasNickname ? 'grey.500' : 'grey.200'}
              fontWeight={hasNickname ? 'regular' : 'bold'}
              textOverflow="ellipsis"
              isTruncated
            >
              {/* todo: add nickname on bakosafe sdk */}
              {AddressUtils.format(member?.address ?? '')}
            </Text>
          </VStack>

          {isOwner && <CardMemberBagde />}
        </HStack>
      </Flex>
    </SignerCard>
  );
};

export { CardMember };
