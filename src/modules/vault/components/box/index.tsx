import {
  Avatar,
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  IconButton,
  SkeletonCircle,
  SkeletonText,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { FiPlusSquare } from 'react-icons/fi';

import {
  AddressWithCopyBtn,
  ChartBulletIcon,
  CustomSkeleton,
  HomeIcon,
  LeftAndRightArrow,
  TooltipNotEnoughBalance,
  UpRightArrow,
} from '@/components';
import { NetworkService } from '@/modules/network/services';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { TooltipPendingTx } from '../TooltipPendingTx';

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
    authDetails: {
      userInfos: { network },
    },
    workspaceInfos: {
      handlers: { goHome },
    },
  } = useWorkspaceContext();

  const redirectToNetwork = () =>
    window.open(
      `${NetworkService.getExplorer(network?.url)}/account/${address}/assets`,
      '_BLANK',
    );

  const ToolTipComponent = useMemo(() => {
    if (!isFirstAssetsLoading && isPending) {
      return <TooltipPendingTx />;
    }
    if (!isFirstAssetsLoading && isEthBalanceLowerThanReservedAmount) {
      return <TooltipNotEnoughBalance />;
    }
    return null;
  }, [isPending, isFirstAssetsLoading, isEthBalanceLowerThanReservedAmount]);

  return (
    <Box w="100%">
      {/* Headers BTNS */}
      <HStack>
        <Button w="full" variant="secondaryV2" onClick={() => goHome()}>
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
        <VStack
          alignItems="start"
          spacing={3}
          justifyContent="center"
          minW="200px"
          w="full"
        >
          <Heading size="xs" isTruncated textOverflow="ellipsis" w="full">
            {name}
          </Heading>
          <HStack
            alignItems="center"
            justifyContent="center"
            w={isMobile ? 'unset' : 'full'}
          >
            <AddressWithCopyBtn
              value={address}
              isSidebarAddress
              aria-label="Sidebar Vault Address"
              h="20px"
              flexDir="row-reverse"
            />
            <IconButton
              icon={<Icon as={UpRightArrow} fontSize="md" color="grey.75" />}
              aria-label="Explorer"
              size="xs"
              minW={2}
              bg="none"
              h={3}
              _hover={{ bg: 'none' }}
              onClick={redirectToNetwork}
            />
          </HStack>
        </VStack>
      </HStack>
      {/* Create Tx Btn */}
      {hasPermission && (
        <Box w="100%">
          <Tooltip
            label={ToolTipComponent}
            hasArrow
            placement="top"
            bg="dark.700"
            color="white"
          >
            <Box display="inline-block" cursor="not-allowed" w={'100%'}>
              <Button
                aria-label={'Create transaction btn'}
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
            </Box>
          </Tooltip>

          {isPending && isMobile && (
            <Text variant="description" mt={2} color="error.500">
              This vault has pending transactions.
            </Text>
          )}
          {!isPending &&
            !isFirstAssetsLoading &&
            isMobile &&
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
