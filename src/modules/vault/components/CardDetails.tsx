import { PlusSquareIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { bn } from 'fuels';
import { useMemo } from 'react';

import { Card, CustomSkeleton } from '@/components';
import { EyeCloseIcon } from '@/components/icons/eye-close';
import { EyeOpenIcon } from '@/components/icons/eye-open';
import { HandbagIcon } from '@/components/icons/handbag';
import { RefreshIcon } from '@/components/icons/refresh-icon';
import { useAuth } from '@/modules/auth';
import {
  AssetCard,
  assetsMap,
  NativeAssetId,
  useScreenSize,
} from '@/modules/core';
import { useWorkspace } from '@/modules/workspace';

import { UseVaultDetailsReturn } from '../hooks/details';
import { openFaucet } from '../utils';

export interface CardDetailsProps {
  store: UseVaultDetailsReturn['store'];
  vault: UseVaultDetailsReturn['vault'];
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

const CardDetails = (props: CardDetailsProps) => {
  // const navigate = useNavigate();
  const { store, vault } = props;
  const { biggerAsset, visebleBalance, setVisibleBalance } = store;
  const { currentWorkspace } = useWorkspace();
  const { isSingleWorkspace } = useAuth();
  const { isMobile } = useScreenSize();

  const balance = bn(bn.parseUnits(biggerAsset?.amount ?? '0.000')).format({
    precision: 4,
  });

  // const reqPerm = [
  //   PermissionRoles.ADMIN,
  //   PermissionRoles.OWNER,
  //   PermissionRoles.MANAGER,
  //   PermissionRoles.SIGNER,
  // ];
  // const makeTransactionsPerm = useMemo(() => {
  //   const as = hasPermission(reqPerm);
  //   return as;
  // }, [vault.id, balance]);

  const vaultDescription = useMemo(() => {
    if (!vault?.description) return '';

    let description = vault.description;
    if (description.length > MAX_DESCRIPTION_CHARS) {
      description = description.substring(0, MAX_DESCRIPTION_CHARS) + '...';
    }
    return description;
  }, [vault]);

  if (!vault) return;

  return (
    <Box w="full" maxW="680">
      <Box mb={5} w="full">
        <Text
          color="grey.400"
          fontWeight="semibold"
          fontSize={{ base: 'md', sm: 'xl' }}
        >
          Balance
        </Text>
      </Box>

      <CustomSkeleton isLoaded={!vault.isLoading}>
        <Card p={{ base: 4, sm: 8 }} bgColor="grey.800">
          <VStack spacing={4} w="full">
            <Flex
              w="full"
              flexDir={{ base: 'column', sm: 'row' }}
              alignItems={{ base: 'flex-start', sm: 'center' }}
              justify="space-between"
              gap={{ base: 6, sm: 0 }}
            >
              <Center w="full" display="flex" gap={6} alignItems="flex-start">
                <Avatar
                  position="relative"
                  variant="roundedSquare"
                  size={{ base: 'md', sm: 'lg' }}
                  p={{ base: 8, sm: 14 }}
                  bgColor="grey.200"
                  color="grey.800"
                  fontWeight="bold"
                  name={vault.name}
                >
                  <Box
                    position="absolute"
                    borderRadius="md"
                    w={{ base: 14, sm: 24 }}
                    h={{ base: 14, sm: 24 }}
                    border="3px solid white"
                  />
                </Avatar>
                <Box w="full">
                  <HStack justifyContent="space-between" gap={2} w="full">
                    <Heading
                      variant={isMobile ? 'title-md' : 'title-xl'}
                      w="max"
                      isTruncated={!vault?.name?.includes(' ')}
                    >
                      {vault?.name}
                    </Heading>
                    {isMobile && <Update />}
                  </HStack>

                  {!isSingleWorkspace && (
                    <Text
                      alignItems="center"
                      variant="description"
                      textOverflow="ellipsis"
                      noOfLines={2}
                      isTruncated
                      mb={2}
                      fontSize={{ base: 'small', sm: 'sm' }}
                    >
                      <HandbagIcon
                        w={{ base: 3, sm: 4 }}
                        h={{ base: 3, sm: 4 }}
                        mr={2}
                      />
                      {currentWorkspace.workspace?.name}
                    </Text>
                  )}

                  <Text
                    maxW="200px"
                    variant="description"
                    textOverflow="ellipsis"
                    noOfLines={2}
                    isTruncated
                  >
                    {vaultDescription}
                  </Text>
                </Box>
              </Center>

              <Flex
                flexDirection={{ base: 'row', sm: 'column' }}
                gap={4}
                alignItems={{ base: 'center', sm: 'flex-end' }}
                justifyContent="space-between"
                w="full"
              >
                <Box width="auto">
                  <HStack
                    minW={20}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <HStack
                      w="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="space-around"
                      spacing={2}
                    >
                      <Heading variant="title-xl">
                        {visebleBalance ? balance : '-----'}
                      </Heading>
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

                <Button
                  fontSize={{ base: 'sm', sm: 'md' }}
                  minW={{ base: undefined, sm: 180 }}
                  h={12}
                  variant="primary"
                  onClick={() => openFaucet(vault.predicateAddress!)}
                  _hover={{
                    opacity: 0.8,
                  }}
                  leftIcon={
                    <PlusSquareIcon
                      w={{ base: 5, sm: 6 }}
                      h={{ base: 5, sm: 6 }}
                    />
                  }
                >
                  Faucet
                </Button>

                {/* <VStack spacing={2} alignItems="flex-start">
                  <Button
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
                      vaultDetails.transactions.isPendingSigner
                    }
                    minW={130}
                    variant="primary"
                  >
                    Send
                  </Button>
                  {vault.transactions.isPendingSigner ? (
                    <Text variant="description" fontSize="xs" color="error.500">
                      This vault has pending transactions.
                    </Text>
                  ) : !makeTransactionsPerm ? (
                    <Text variant="description" fontSize="xs" color="error.500">
                      You dont have permission to send transactions.
                    </Text>
                  ) : (
                    <Text variant="description" fontSize="xs">
                      Send single or batch <br /> payments with multi assets.
                    </Text>
                  )}
                </VStack> */}
              </Flex>
            </Flex>

            <Divider w="full" borderColor="grey.400" />

            {/* <HStack
              w="full"
              spacing={5}
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <VStack spacing={4} justifyContent="flex-start">
                <Box p={3} backgroundColor={'white'} borderRadius={10}>
                  <QRCodeSVG
                    value={vault.predicateAddress!}
                    fgColor="black"
                    bgColor="white"
                    style={{
                      borderRadius: 10,
                      width: 180,
                      height: 180,
                    }}
                  />
                </Box>
                <AddressCopy
                  w="full"
                  address={AddressUtils.format(vault.predicateAddress)!}
                  addressToCopy={vault.predicateAddress!}
                />
              </VStack>
            </HStack> */}
            <VStack h="full" w="full" alignItems="flex-start" spacing={4}>
              <Text
                fontWeight="semibold"
                color="grey.450"
              >{`Workspace's balance breakdown`}</Text>
              <CustomSkeleton
                isLoaded={!currentWorkspace.isLoading}
                w="full"
                h="full"
              >
                {parseFloat(balance!) === 0 || !balance ? (
                  <Card
                    w="full"
                    h="full"
                    p={8}
                    borderColor="dark.100"
                    borderStyle="dashed"
                  >
                    <VStack h="full" spacing={1} justifyContent="center">
                      <Text fontWeight="bold" color="grey.200">
                        First thing first...
                      </Text>
                      <Text color="white" maxW={340} textAlign="center">
                        {`You don't have any vaults yet. Create a vault to start to
                    save your assets.`}
                      </Text>
                    </VStack>
                  </Card>
                ) : (
                  <VStack w="full" h="full" spacing={1} justifyContent="center">
                    {/*todo: 
                      - update service with typing returning the assets -> Asset[]
                      - implement a recursive function to render the diferent assets, and make to dynamic data
                  */}
                    <AssetCard
                      asset={{
                        ...assetsMap[NativeAssetId],
                        assetId: NativeAssetId,
                        amount: balance,
                      }}
                      visibleBalance={visebleBalance}
                    />
                  </VStack>
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
