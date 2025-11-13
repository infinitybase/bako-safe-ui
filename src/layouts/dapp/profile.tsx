import { Avatar, Box, Button, Flex, HStack, Text, VStack } from 'bako-ui';
import { RiArrowLeftRightLine } from 'react-icons/ri';

import { AddressUtils } from '@/modules/core';

import { useProfile } from './hooks/useProfile';

export const Profile = () => {
  const { userInfos, isWebAuthn, getUserAddress, logout } = useProfile();

  return (
    <Box w="full" px={6} pt={6}>
      <Flex
        w="full"
        alignItems="center"
        justifyContent="space-between"
        bg="gray.600"
        borderRadius={8}
        p={3}
      >
        <HStack gap={3} align="center">
          <Avatar shape="rounded" boxSize="48px" src={userInfos.avatar} />
          <VStack gap={2} align="flex-start">
            <Text
              fontWeight={700}
              truncate
              color="gray.100"
              fontSize="xs"
              lineHeight="12px"
            >
              {getUserAddress() || 'Address not available'}
            </Text>
            {isWebAuthn && (
              <Text
                fontWeight={400}
                truncate
                color="gray.300"
                fontSize="xs"
                lineHeight="12px"
              >
                {AddressUtils.format(
                  AddressUtils.toBech32(userInfos.address),
                  15,
                )}
              </Text>
            )}
          </VStack>
        </HStack>
        <Button
          variant="subtle"
          color="gray.300"
          bgColor="gray.600"
          size="xs"
          gap={3}
          px="12px"
          fontWeight={400}
          onClick={logout}
        >
          Switch user
          <RiArrowLeftRightLine size={12} />
        </Button>
      </Flex>
    </Box>
  );
};
