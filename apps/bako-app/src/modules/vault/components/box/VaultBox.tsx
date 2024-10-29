import {
  CustomSkeleton,
  HomeIcon,
  LeftAndRightArrow,
  UpRightArrow,
} from '@bako-safe/ui/components';
import {
  Avatar,
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  IconButton,
  Text,
  VStack,
} from '@chakra-ui/react';

import { AddressWithCopyBtn } from '@/components';
import { NetworkService } from '@/modules/network/services';
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
      `${NetworkService.getExplorer(network.url)}/account/${address}/assets`,
      '_BLANK',
    );

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
              address={address}
              isSidebarAddress
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
            // leftIcon={<FiPlusSquare fontSize={isMobile ? 20 : 22} />}
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

export { VaultBox };
