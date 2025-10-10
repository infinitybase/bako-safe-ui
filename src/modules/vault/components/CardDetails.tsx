import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Separator,
  Text,
  TextProps,
  VStack,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { bn } from 'fuels';
import { useMemo, useRef } from 'react';
import { FiPlusSquare as PlusSquareIcon } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import {
  Card,
  CustomSkeleton,
  ErrorTooltip,
  SquarePlusIcon,
  TooltipNotEnoughBalance,
} from '@/components';
import { EyeCloseIcon } from '@/components/icons/eye-close';
import { EyeOpenIcon } from '@/components/icons/eye-open';
import { RefreshIcon } from '@/components/icons/refresh-icon';
import { Tooltip } from '@/components/ui/tooltip';
import { Pages, PermissionRoles } from '@/modules/core';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';
import { useNetworks } from '@/modules/network/hooks';
import { NetworkType } from '@/modules/network/services';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { UseVaultDetailsReturn } from '../hooks/details';
import { openFaucet } from '../utils';
import { AssetsDetails } from './AssetsDetails';
import BalanceHelperDrawer from './BalanceHelperDrawer';
import BalanceHelperDialog from './dialog/BalanceHelper';
import { TooltipPendingTx } from './TooltipPendingTx';

export interface CardDetailsProps {
  vault: UseVaultDetailsReturn['vault'];
  assets: UseVaultDetailsReturn['assets'];
  isPendingSigner: boolean;
  setAddAssetsDialogState: (value: boolean) => void;
}

const Update = (props: TextProps & { isLoading: boolean }) => {
  const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

  return (
    <Text
      w={20}
      display="flex"
      alignItems="center"
      justifyContent="space-around"
      // variant="description"
      fontSize={{ base: 'small', sm: 'md' }}
      fontWeight="semibold"
      _hover={{
        cursor: 'pointer',
        color: 'grey.200',
      }}
      {...props}
    >
      Update
      <RefreshIcon
        _hover={{
          cursor: 'pointer',
          color: 'grey.200',
        }}
        w={{ base: 4, sm: 5 }}
        h={{ base: 4, sm: 5 }}
        animation={props.isLoading ? `${spin} 1s linear infinite` : undefined}
      />
    </Text>
  );
};

const CardDetails = (props: CardDetailsProps): JSX.Element | null => {
  const assetsContainerRef = useRef(null);
  const navigate = useNavigate();
  const { isOpen, setOpen, onOpen } = useDisclosure();

  const { vault, assets, setAddAssetsDialogState } = props;
  const {
    balanceUSD,
    visibleBalance,
    setVisibleBalance,
    isLoading,
    isUpdating,
    hasBalance,
    ethBalance,
    isEthBalanceLowerThanReservedAmount,
    handleManualRefetch,
  } = assets;

  const showAssets = hasBalance || assets?.nfts?.length;

  const {
    authDetails: { userInfos },
    workspaceInfos: {
      handlers: { hasPermission },
    },
    screenSizes: { isMobile },
    tokensUSD,
  } = useWorkspaceContext();
  const { checkNetwork } = useNetworks();
  const isTestnet = checkNetwork(NetworkType.TESTNET);

  const balanceFormatted = bn(bn.parseUnits(ethBalance ?? '0.000'))?.format({
    precision: 4,
  });

  const workspaceId = userInfos.workspace?.id ?? '';

  const reqPerm = [
    PermissionRoles.ADMIN,
    PermissionRoles.OWNER,
    PermissionRoles.MANAGER,
    PermissionRoles.SIGNER,
  ];

  const makeTransactionsPerm = useMemo(() => {
    const as = hasPermission(reqPerm);
    return as;
  }, [vault.data?.id, balanceFormatted]);

  const ToolTipComponent = useMemo(() => {
    if (props.isPendingSigner) {
      return <TooltipPendingTx />;
    }
    if (isEthBalanceLowerThanReservedAmount) {
      return <TooltipNotEnoughBalance />;
    }
    return null;
  }, [props.isPendingSigner, isEthBalanceLowerThanReservedAmount]);

  if (!vault) return null;

  return (
    <Box w="full">
      {isMobile ? (
        <BalanceHelperDrawer
          onOpenChange={(e) => setOpen(e.open)}
          open={isOpen}
        />
      ) : (
        <BalanceHelperDialog
          onOpenChange={(e) => setOpen(e.open)}
          open={isOpen}
        />
      )}
      <Box mb="22px" w="full">
        <Text
          color="grey.50"
          fontWeight={700}
          fontSize="sm"
          lineHeight="16.94px"
        >
          Overview
        </Text>
      </Box>

      <CustomSkeleton loading={vault.isLoading}>
        <Card
          p={{ base: 4, sm: 8 }}
          borderColor="gradients.transaction-border"
          bg="gradients.transaction-card"
          borderWidth={1}
          backdropFilter="blur(16px)"
          dropShadow="0px 8px 6px 0px #00000026"
        >
          <VStack gap={4} w="full">
            <Flex
              w="full"
              flexDir={{ base: 'column', md: 'row' }}
              alignItems="flex-start"
              justify="space-between"
              gap={6}
            >
              {/* VAULTNAME BOX */}
              <HStack
                gap={{ base: 4, sm: 6 }}
                alignItems="flex-start"
                display="flex"
                flex={1}
              >
                <Avatar.Root
                  position="relative"
                  size={{ base: 'md', sm: 'lg' }}
                  p={{ base: 8, sm: 14 }}
                  bgColor="grey.950"
                  color="grey.450"
                  fontWeight="bold"
                  shape="rounded"
                  boxShadow="0px 6.5px 6.5px 0px rgba(0, 0, 0, 0.4);"
                >
                  <Avatar.Fallback name={vault.data?.name} />
                </Avatar.Root>
                <Box alignItems="center" justifyContent="center" w="full">
                  <HStack justifyContent="space-between" gap={2} maxW="full">
                    <Heading
                      alignSelf="flex-start"
                      // variant={{ base: 'title-md', sm: 'title-xl' }}
                      lineClamp={1}
                      wordBreak="break-all"
                    >
                      {vault?.data.name}
                    </Heading>
                    {isMobile && (
                      <Update
                        isLoading={isUpdating}
                        onClick={handleManualRefetch}
                      />
                    )}
                  </HStack>

                  {/* Commented out code to temporarily disable workspaces. */}

                  {/* {!userInfos.onSingleWorkspace && (
                    <HStack
                      w="full"
                      alignItems="center"
                      justifyContent="flex-start"
                      gap={2}
                      mb={2}
                    >
                      <HandbagIcon
                        w={{ base: 3, sm: 4 }}
                        h={{ base: 3, sm: 4 }}
                        color="grey.500"
                      />
                      <Text
                        variant="description"
                        maxW={{ base: '35vw', sm: '70%', md: '80%' }}
                        isTruncated
                        fontSize={{ base: 'small', sm: 'sm' }}
                      >
                        {userInfos.workspace?.name}
                      </Text>
                    </HStack>
                  )} */}

                  <Text
                    // variant="description"
                    lineClamp={4}
                    wordBreak="break-all"
                  >
                    {vault?.data?.description}
                  </Text>
                </Box>
              </HStack>

              {/* BALANCE BOX */}
              <Flex
                minW="140px"
                w={{ base: 'full', md: 'fit-content' }}
                gap={4}
                flexDirection={{ base: 'row', md: 'column' }}
                alignItems={{ base: 'center', sm: 'flex-end' }}
                justifyContent="space-between"
              >
                <Box>
                  <HStack
                    minW={20}
                    display="flex"
                    flexDirection="column"
                    alignItems="end"
                  >
                    <HStack
                      w="full"
                      display="flex"
                      alignItems="center"
                      mb={props.isPendingSigner && isMobile ? 5 : 0}
                      justifyContent="space-around"
                      gap={2}
                    >
                      <CustomSkeleton
                        loading={isLoading}
                        customStartColor="grey.75"
                        customEndColor="dark.100"
                      >
                        <Heading>
                          {visibleBalance ? `${balanceUSD} USD` : '-----'}
                        </Heading>
                      </CustomSkeleton>
                      <Box
                        w="auto"
                        _hover={{
                          cursor: 'pointer',
                          opacity: 0.8,
                        }}
                        minH={7}
                        display="flex"
                        alignItems="center"
                        justifyContent={'center'}
                        onClick={() => setVisibleBalance(!visibleBalance)}
                      >
                        {visibleBalance ? (
                          <EyeOpenIcon boxSize={7} />
                        ) : (
                          <EyeCloseIcon boxSize={5} />
                        )}
                      </Box>
                    </HStack>
                    {!isMobile && (
                      <Update
                        isLoading={isUpdating}
                        onClick={handleManualRefetch}
                      />
                    )}
                  </HStack>
                </Box>

                <CustomSkeleton
                  loading={isLoading}
                  customStartColor="grey.75"
                  customEndColor="dark.100"
                  w="fit-content"
                >
                  <Button
                    hidden={hasBalance}
                    colorScheme="primary"
                    onClick={() =>
                      isTestnet
                        ? openFaucet(vault.data?.predicateAddress)
                        : setAddAssetsDialogState(true)
                    }
                  >
                    <PlusSquareIcon />
                    {isTestnet ? 'Faucet' : 'Add Assets'}
                  </Button>

                  <VStack
                    gap={2}
                    hidden={!hasBalance}
                    alignItems={{ base: 'flex-end', sm: 'flex-start' }}
                  >
                    <Tooltip
                      content={ToolTipComponent}
                      showArrow
                      positioning={{ placement: 'top' }}
                    >
                      <Box
                        display="flex"
                        justifyContent="end"
                        cursor="not-allowed"
                        w={'100%'}
                      >
                        <Button
                          alignSelf="end"
                          onClick={() =>
                            navigate(
                              Pages.createTransaction({
                                vaultId: vault.data?.id,
                                workspaceId,
                              }),
                            )
                          }
                          disabled={
                            !hasBalance ||
                            !makeTransactionsPerm ||
                            props.isPendingSigner ||
                            isEthBalanceLowerThanReservedAmount
                          }
                          colorPalette="primary"
                          fontWeight="bold"
                        >
                          <SquarePlusIcon />
                          Send
                        </Button>
                      </Box>
                    </Tooltip>
                    {isEthBalanceLowerThanReservedAmount &&
                      !props.isPendingSigner &&
                      isMobile && (
                        <Text
                          // variant="description"
                          textAlign={{ base: 'end', sm: 'left' }}
                          fontWeight={400}
                          fontSize="xs"
                          color="error.650"
                          onClick={onOpen}
                          cursor="pointer"
                        >
                          Not enough balance{' '}
                          <IconButton
                            bg="none"
                            _hover={{ bg: 'none' }}
                            aria-label="Open helper modal"
                            size="xs"
                            minW={4}
                            maxH={4}
                          >
                            <ErrorTooltip />
                          </IconButton>
                        </Text>
                      )}
                    {props.isPendingSigner && isMobile ? (
                      <Text
                        // variant="description"
                        textAlign={{ base: 'end', sm: 'left' }}
                        fontSize="xs"
                        color="error.500"
                      >
                        This vault has pending transactions.
                      </Text>
                    ) : !makeTransactionsPerm ? (
                      <Text
                        fontSize="xs"
                        hidden={isMobile}
                        // variant="description"
                        color="error.500"
                      >
                        You dont have permission to send transactions.
                      </Text>
                    ) : (
                      <Text hidden={true} fontSize="xs">
                        Send single or batch <br /> payments with multi assets.
                      </Text>
                    )}
                  </VStack>
                </CustomSkeleton>
              </Flex>
            </Flex>

            <Separator w="full" borderColor="grey.400" />

            <VStack w="full" alignItems="flex-start" gap={4}>
              <Text fontWeight="semibold" color="grey.450">
                Vault balance breakdown
              </Text>
              <CustomSkeleton
                loading={userInfos.isLoading && isLoading}
                w="full"
                h="full"
              >
                {!showAssets ? (
                  <Card
                    w="full"
                    h={{ base: 98, sm: 102.5, lg: 150 }}
                    p={{ base: 4, sm: 16 }}
                    bg={'transparent'}
                    borderColor="grey.925"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <VStack flex={1} h="full" gap={1} justifyContent="center">
                      <Text fontWeight="bold" color="white">
                        First things first...
                      </Text>
                      <Text color="grey.200" maxW={340} textAlign="center">
                        {`You don't have any assets yet.`}
                      </Text>
                    </VStack>
                  </Card>
                ) : (
                  <HStack
                    ref={assetsContainerRef}
                    w="full"
                    h="full"
                    maxH={150}
                    gap={{ base: 2, sm: 4 }}
                    justifyContent="flex-start"
                  >
                    <AssetsDetails
                      containerRef={assetsContainerRef}
                      assets={assets.assets!}
                      nfts={assets.nfts!}
                      tokensUSD={tokensUSD.data}
                      visibleBalance={visibleBalance}
                      viewAllRedirect={Pages.vaultBalance({
                        vaultId: vault.data?.id,
                        workspaceId,
                      })}
                    />
                  </HStack>
                )}
              </CustomSkeleton>
            </VStack>
          </VStack>
        </Card>
      </CustomSkeleton>
    </Box>
  );
};

export { CardDetails };
