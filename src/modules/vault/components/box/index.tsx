import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  SkeletonCircle,
  SkeletonText,
  Text,
} from '@chakra-ui/react';

import { ChartBulletIcon, CustomSkeleton, ReplaceIcon } from '@/components';

interface VaultBoxPropx {
  name: string;
  fullName: string;
  address: string;
  onChangeVault: () => void;
  onCreateTransaction: () => void;
  isLoading?: boolean;
  hasBalance?: boolean;
}

const VaultBoxSkeleton = () => (
  <Box w="100%">
    <HStack width="100%" alignItems="center" spacing={5} mb={5}>
      <SkeletonCircle />
      <Box w="100%" maxW="100%">
        <SkeletonText w="100%" />
      </Box>
    </HStack>
    <Box w="100%">
      <Button
        w="100%"
        variant="primary"
        fontWeight="bold"
        leftIcon={<ChartBulletIcon mr={2} fontSize={22} />}
      >
        Create transaction
      </Button>
    </Box>
  </Box>
);

const VaultBox = (props: VaultBoxPropx) => {
  const {
    name,
    address,
    fullName,
    isLoading,
    hasBalance,
    onChangeVault,
    onCreateTransaction,
  } = props;

  return (
    <Box w="100%">
      <HStack width="100%" alignItems="center" spacing={5} mb={5}>
        <CustomSkeleton w="min-content" isLoaded={!isLoading}>
          <Avatar
            variant="roundedSquare"
            bgColor="dark.150"
            color="white"
            name={fullName}
          />
        </CustomSkeleton>
        <Box w="100%" maxW="100%">
          <Flex alignItems="center" justifyContent="space-between">
            <Box maxW="48%">
              <CustomSkeleton borderRadius={2} isLoaded={!isLoading}>
                <Heading variant="title-md" noOfLines={1}>
                  {name}
                </Heading>
              </CustomSkeleton>
            </Box>
            <Box ml={2}>
              <Button
                size="sm"
                variant="link"
                color="brand.500"
                onClick={onChangeVault}
                leftIcon={<ReplaceIcon color="brand.600" />}
              >
                Change vault
              </Button>
            </Box>
          </Flex>
          <Box mt={1}>
            <CustomSkeleton
              w="full"
              minH="20px"
              borderRadius={2}
              isLoaded={!isLoading}
            >
              <Text variant="description">{address}</Text>
            </CustomSkeleton>
          </Box>
        </Box>
      </HStack>
      <Box w="100%">
        <Button
          w="100%"
          variant="primary"
          fontWeight="bold"
          onClick={onCreateTransaction}
          isDisabled={!hasBalance}
          leftIcon={<ChartBulletIcon mr={2} fontSize={22} />}
        >
          Create transaction
        </Button>
      </Box>
    </Box>
  );
};

export { VaultBox, VaultBoxSkeleton };
