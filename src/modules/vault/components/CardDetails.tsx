import { PlusSquareIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { bn } from 'fuels';
import { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, CustomSkeleton, SquarePlusIcon } from '@/components';
import { EyeCloseIcon } from '@/components/icons/eye-close';
import { EyeOpenIcon } from '@/components/icons/eye-open';
import { HandbagIcon } from '@/components/icons/handbag';
import { RefreshIcon } from '@/components/icons/refresh-icon';
import { useAuth } from '@/modules/auth';
import { Pages, PermissionRoles, useScreenSize } from '@/modules/core';
import { useCreateTransaction } from '@/modules/transactions';
import { useWorkspace } from '@/modules/workspace';
import { limitCharacters } from '@/utils/limit-characters';

import { UseVaultDetailsReturn } from '../hooks/details';
import { openFaucet } from '../utils';
import { AssetsDetails } from './AssetsDetails';

export interface CardDetailsProps {
  store: UseVaultDetailsReturn['store'];
  vault: UseVaultDetailsReturn['vault'];
  assets: UseVaultDetailsReturn['assets'];
}

const MAX_DESCRIPTION_CHARS = 80;

const Update = () => {
  return (
    <Text
      w={20}
      display="flex"
      alignItems="center"
      justifyContent="space-around"
      variant="description"
      fontSize={{ base: 'small', sm: 'md' }}
      fontWeight="semibold"
      _hover={{
        cursor: 'pointer',
        color: 'grey.200',
      }}
    >
      Update
      <RefreshIcon
        _hover={{
          cursor: 'pointer',
          color: 'grey.200',
        }}
        w={{ base: 4, sm: 5 }}
        h={{ base: 4, sm: 5 }}
      />
    </Text>
  );
};

const CardDetails = (props: CardDetailsProps): JSX.Element | null => {
  const assetsContainerRef = useRef(null);
  const navigate = useNavigate();

  const { store, vault, assets } = props;
  const {
    balanceUSD,
    visebleBalance,
    setVisibleBalance,
    isFirstAssetsLoading,
    setIsFirstAssetsLoading,
  } = store;
  const { currentWorkspace, hasPermission } = useWorkspace();
  const { workspaces, isSingleWorkspace } = useAuth();
  const { isMobile, isExtraSmall } = useScreenSize();

  const hasBalance = vault.hasBalance;
  const balanceFormatted = bn(
    bn.parseUnits(vault.ethBalance ?? '0.000'),
  ).format({
    precision: 4,
  });

  const { isEthBalanceLowerThanReservedAmount } = useCreateTransaction();

  const workspaceId = workspaces.current ?? '';

  const reqPerm = [
    PermissionRoles.ADMIN,
    PermissionRoles.OWNER,
    PermissionRoles.MANAGER,
    PermissionRoles.SIGNER,
  ];

  useEffect(() => {
    return () => setIsFirstAssetsLoading(true);
  }, []);

  const makeTransactionsPerm = useMemo(() => {
    const as = hasPermission(reqPerm);
    return as;
  }, [vault.id, balanceFormatted]);

  const vaultDescription = useMemo(() => {
    if (!vault?.description) return '';

    let description = vault.description;
    if (description.length > MAX_DESCRIPTION_CHARS) {
      description = description.substring(0, MAX_DESCRIPTION_CHARS) + '...';
    }
    return description;
  }, [vault]);

  if (!vault) return null;

  return (
    <Box w="full">
      <Box mb="1.2em" w="full">
        <Text
          color="grey.400"
          fontWeight="semibold"
          fontSize={{ base: 'md', sm: 'xl' }}
        >
          Overview
        </Text>
      </Box>

      <CustomSkeleton isLoaded={!vault.isLoading}>
        <Card
          p={{ base: 4, sm: 8 }}
          borderColor="gradients.transaction-border"
          bg="gradients.transaction-card"
          borderWidth={1}
          backdropFilter="blur(16px)"
          dropShadow="0px 8px 6px 0px #00000026"
        >
          <VStack spacing={4} w="full" maxW="full">
            <Flex
              w="full"
              maxW="full"
              flex={1}
              id="asd"
              flexDir={{ base: 'column', sm: 'row' }}
              alignItems="flex-start"
              justify="space-between"
              gap={{ base: 6, sm: 0 }}
            >
              <HStack
                w={{ base: 'full', sm: '70%' }}
                display="flex"
                gap={{ base: 4, sm: 6 }}
                alignItems="flex-start"
              >
                <Avatar
                  position="relative"
                  variant="roundedSquare"
                  size={{ base: 'md', sm: 'lg' }}
                  p={{ base: 8, sm: 14 }}
                  bgColor="grey.600"
                  color="grey.450"
                  fontWeight="bold"
                  name={vault.name}
                >
                  <Box
                    position="absolute"
                    borderRadius="lg"
                    w={{ base: 14, sm: 102 }}
                    h={{ base: 14, sm: 102 }}
                    border="3px solid"
                    borderColor="grey.450"
                  />
                </Avatar>
                <Box
                  w={{ base: 'full', sm: '90%' }}
                  alignItems="center"
                  justifyContent="center"
                >
                  <HStack justifyContent="space-between" gap={2} maxW="full">
                    <Heading
                      alignSelf="flex-start"
                      maxW={{ base: '35vw', sm: '70%', md: '80%' }}
                      variant={isMobile ? 'title-md' : 'title-xl'}
                      isTruncated
                    >
                      {isExtraSmall
                        ? limitCharacters(vault?.name ?? '', 8)
                        : vault?.name}
                    </Heading>
                    {isMobile && <Update />}
                  </HStack>

                  {!isSingleWorkspace && (
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
                        {currentWorkspace.workspace?.name}
                      </Text>
                    </HStack>
                  )}

                  <Text
                    maxW="200px"
                    variant="description"
                    textOverflow="ellipsis"
                    isTruncated
                  >
                    {vaultDescription}
                  </Text>
                </Box>
              </HStack>

              <Flex
                w="full"
                gap={4}
                flexDirection={{ base: 'row', sm: 'column' }}
                alignItems={{ base: 'center', sm: 'flex-end' }}
                justifyContent="space-between"
              >
                <Box width="auto">
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
                      mb={
                        vault.transactions.isPendingSigner && isMobile ? 5 : 0
                      }
                      justifyContent="space-around"
                      spacing={2}
                    >
                      <CustomSkeleton
                        isLoaded={!isFirstAssetsLoading}
                        customStartColor="grey.75"
                        customEndColor="dark.100"
                      >
                        <Heading variant={isMobile ? 'title-lg' : 'title-xl'}>
                          {visebleBalance ? `${balanceUSD} USD` : '-----'}
                        </Heading>
                      </CustomSkeleton>
                      <Box
                        w="auto"
                        _hover={{
                          cursor: 'pointer',
                          opacity: 0.8,
                        }}
                        onClick={() => setVisibleBalance(!visebleBalance)}
                      >
                        {visebleBalance ? (
                          <EyeOpenIcon boxSize={7} />
                        ) : (
                          <EyeCloseIcon boxSize={5} />
                        )}
                      </Box>
                    </HStack>
                    {!isMobile && <Update />}
                  </HStack>
                </Box>

                <CustomSkeleton
                  isLoaded={!isFirstAssetsLoading}
                  customStartColor="grey.75"
                  customEndColor="dark.100"
                  w="fit-content"
                >
                  <Button
                    hidden={hasBalance}
                    variant="primary"
                    onClick={() => openFaucet(vault.predicateAddress!)}
                    leftIcon={<PlusSquareIcon />}
                  >
                    Faucet
                  </Button>

                  <VStack
                    spacing={2}
                    hidden={!hasBalance}
                    alignItems={{ base: 'flex-end', sm: 'flex-start' }}
                  >
                    <Button
                      alignSelf="end"
                      onClick={() =>
                        navigate(
                          Pages.createTransaction({
                            vaultId: vault.id!,
                            workspaceId,
                          }),
                        )
                      }
                      isDisabled={
                        !vault?.hasBalance ||
                        !makeTransactionsPerm ||
                        vault.transactions.isPendingSigner ||
                        isEthBalanceLowerThanReservedAmount
                      }
                      variant="primary"
                      leftIcon={<SquarePlusIcon />}
                      fontWeight="bold"
                    >
                      Send
                    </Button>
                    {isEthBalanceLowerThanReservedAmount &&
                      !vault.transactions.isPendingSigner && (
                        <Text
                          variant="description"
                          textAlign={{ base: 'end', sm: 'left' }}
                          fontSize="xs"
                          color="error.500"
                        >
                          Not enough balance.
                        </Text>
                      )}
                    {vault.transactions.isPendingSigner ? (
                      <Text
                        variant="description"
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
                        variant="description"
                        color="error.500"
                      >
                        You dont have permission to send transactions.
                      </Text>
                    ) : (
                      <Text hidden={true} variant="description" fontSize="xs">
                        Send single or batch <br /> payments with multi assets.
                      </Text>
                    )}
                  </VStack>
                </CustomSkeleton>
              </Flex>
            </Flex>

            <Divider w="full" borderColor="grey.400" />

            <VStack w="full" alignItems="flex-start" spacing={4}>
              <Text fontWeight="semibold" color="grey.450">
                {`Vault's balance breakdown`}
              </Text>
              <CustomSkeleton
                isLoaded={!currentWorkspace.isLoading && !isFirstAssetsLoading}
                w="full"
                h="full"
              >
                {!hasBalance ? (
                  <Card
                    w="full"
                    h={{ base: 98, sm: 102.5, lg: 150 }}
                    p={{ base: 4, sm: 8 }}
                    borderColor="dark.100"
                    borderStyle="dashed"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <VStack
                      flex={1}
                      h="full"
                      spacing={1}
                      justifyContent="center"
                    >
                      <Text fontWeight="bold" color="grey.200">
                        First thing first...
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
                    spacing={{ base: 2, sm: 4 }}
                    justifyContent="flex-start"
                  >
                    <AssetsDetails
                      containerRef={assetsContainerRef}
                      assets={assets.value!}
                      visibleBalance={visebleBalance}
                      viewAllRedirect={Pages.vaultBalance({
                        vaultId: vault.id,
                        workspaceId,
                      })}
                    />
                  </HStack>
                )}
              </CustomSkeleton>
            </VStack>
          </VStack>
        </Card>
        {/*
        <AmountDetails
          store={store}
          vaultAddress={vault.predicateAddress!}
          assets={assets}
          isLoading={vault.isLoading}
        /> */}
      </CustomSkeleton>
    </Box>
  );
};

export { CardDetails };
