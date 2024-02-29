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
import { FiPlusSquare } from 'react-icons/fi';

import { ChartBulletIcon, CustomSkeleton, ReplaceIcon } from '@/components';
import { useScreenSize } from '@/modules/core/hooks';

interface VaultBoxPropx {
  name: string;
  fullName: string;
  address: string;
  onChangeVault: () => void;
  onCreateTransaction: () => void;
  isLoading?: boolean;
  isPending?: boolean;
  hasBalance?: boolean;
  hasPermission?: boolean;
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
    isPending,
    hasBalance,
    hasPermission,
    onChangeVault,
    onCreateTransaction,
  } = props;

  const { isMobile } = useScreenSize();

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
                leftIcon={
                  !isMobile ? <ReplaceIcon color="brand.500" /> : undefined
                }
                rightIcon={
                  isMobile ? <ReplaceIcon color="brand.500" /> : undefined
                }
              >
                Change {!isMobile && 'vault'}
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
      {hasPermission && (
        <Box w="100%">
          <Button
            w="100%"
            variant="primary"
            fontWeight="bold"
            onClick={onCreateTransaction}
            isDisabled={!hasBalance || isPending}
            leftIcon={<FiPlusSquare fontSize={isMobile ? 20 : 22} />}
          >
            Create transaction
          </Button>
          {isPending && (
            <Text variant="description" mt={2} color="error.500">
              This vault has pending transactions.
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
};

export { VaultBox, VaultBoxSkeleton };
