import {
  Badge,
  chakra,
  Flex,
  HStack,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';

import { Card } from '@/components';
import { AddressUtils } from '@/modules/core';
import { useScreenSize } from '@/modules/core/hooks';

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
    <Badge py={0} ml={[0, 8]} variant="success">
      Owner
    </Badge>
  );
};

const CardMember = ({ member, isOwner }: CardMemberProps) => {
  const { isMobile } = useScreenSize();

  const hasNickname = member?.nickname;

  return (
    <SignerCard w="full" maxW={360} minH={28} borderColor="grey.600">
      <Flex
        flexDirection={{ base: 'column', sm: 'row' }}
        gap={{ base: 2, sm: 4 }}
        w="full"
        alignItems={{ base: 'stretch', sm: 'center' }}
      >
        <HStack
          w={{ base: 'full', sm: 'fit-content' }}
          justifyContent="space-between"
          gap={2}
        >
          <Image
            borderRadius={8}
            src={member?.avatar}
            boxSize={{ base: '32px', sm: '38px' }}
            minW={{ base: '32px', sm: '38px' }}
          />

          {isOwner && isMobile && <CardMemberBagde />}
        </HStack>

        <HStack
          h="full"
          minH={{ base: undefined, sm: 55 }}
          maxW={600}
          w="full"
          spacing={0}
          justifyContent="space-between"
          alignItems="center"
        >
          <VStack align="flex-start" spacing={0} justifyContent="center">
            {hasNickname && (
              <Text
                fontSize={['md', 'lg']}
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
              {/* todo: add nickname on bsafe sdk */}
              {AddressUtils.format(member?.address ?? '')}
            </Text>
          </VStack>

          {isOwner && !isMobile && <CardMemberBagde />}
        </HStack>
      </Flex>
    </SignerCard>
  );
};

export { CardMember };
