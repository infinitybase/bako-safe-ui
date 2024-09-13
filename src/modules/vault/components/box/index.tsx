import {
  Avatar,
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  SkeletonCircle,
  SkeletonText,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FiPlusSquare } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import {
  AddressWithCopyBtn,
  ChartBulletIcon,
  CustomSkeleton,
  HomeIcon,
  LeftAndRightArrow,
} from '@/components';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

interface VaultBoxPropx {
  name: string;
  address: string;
  onChangeVault: () => void;
  onCreateTransaction: () => void;
  isLoading?: boolean;
  isPending?: boolean;
  hasBalance?: boolean;
  hasPermission?: boolean;
  isFetching: boolean;
  isEthBalanceLowerThanReservedAmount: boolean;
  isFirstAssetsLoading: boolean;
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
  const navigate = useNavigate();
  const {
    name,
    address,
    isLoading,
    isPending,
    hasBalance,
    hasPermission,
    onChangeVault,
    onCreateTransaction,
    isFirstAssetsLoading,
    isEthBalanceLowerThanReservedAmount,
  } = props;

  const {
    screenSizes: { isMobile },
  } = useWorkspaceContext();

  return (
    <Box w="100%">
      {/* Headers BTNS */}
      <HStack>
        <Button w="full" variant="secondaryV2" onClick={() => navigate('/')}>
          <Icon as={HomeIcon} fontSize="lg" mr="auto" />
          <Text mr="auto">Home</Text>
        </Button>
        <Button w="full" variant="secondaryV2" onClick={() => onChangeVault()}>
          <Icon as={LeftAndRightArrow} fontSize="lg" mr="auto" />
          <Text mr="auto">Vault</Text>
        </Button>
      </HStack>
      {/* Vault Avatar and Address */}
      <HStack width="100%" alignItems="center" spacing={4} my={6}>
        <CustomSkeleton w="min-content" isLoaded={!isLoading}>
          <Avatar
            variant="roundedSquare"
            bgColor="dark.150"
            color="grey.75"
            name={name}
            boxShadow="0px 3.5px 3.5px 0px rgba(0, 0, 0, 0.4);"
            boxSize="56px"
          />
        </CustomSkeleton>
        <VStack alignItems="start" spacing={3} justifyContent="center">
          <Heading size="xs" isTruncated textOverflow="ellipsis" maxW="170px">
            {name}
          </Heading>
          <AddressWithCopyBtn
            address={address}
            isSidebarAddress
            h="20px"
            flexDir="row-reverse"
            justifyContent="start"
          />
        </VStack>
      </HStack>
      {/* Create Tx Btn */}
      {hasPermission && (
        <Box w="100%">
          <Button
            w="100%"
            variant="primary"
            fontWeight="bold"
            onClick={onCreateTransaction}
            isDisabled={
              !hasBalance ||
              isPending ||
              isEthBalanceLowerThanReservedAmount ||
              isFirstAssetsLoading
            }
            leftIcon={<FiPlusSquare fontSize={isMobile ? 20 : 22} />}
          >
            Create transaction
          </Button>
          {isPending && (
            <Text variant="description" mt={2} color="error.500">
              This vault has pending transactions.
            </Text>
          )}
          {!isPending &&
            !isFirstAssetsLoading &&
            isEthBalanceLowerThanReservedAmount && (
              <Text variant="description" mt={2} color="error.500">
                Not enough balance.
              </Text>
            )}
        </Box>
      )}
    </Box>
  );
};

export { VaultBox, VaultBoxSkeleton };
