import { PlusSquareIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { bn } from 'fuels';
import { useMemo } from 'react';

import { Card, CustomSkeleton } from '@/components';
import { AssetCard, assetsMap, NativeAssetId } from '@/modules/core';
import { useWorkspace } from '@/modules/workspace';

import { UseVaultDetailsReturn } from '../hooks/details';
import { openFaucet } from '../utils';

export interface CardDetailsProps {
  store: UseVaultDetailsReturn['store'];
  vault: UseVaultDetailsReturn['vault'];
}

const MAX_DESCRIPTION_CHARS = 80;

const CardDetails = (props: CardDetailsProps) => {
  // const navigate = useNavigate();
  const { store, vault } = props;
  const { biggerAsset, visebleBalance, setVisibleBalance } = store;
  const { currentWorkspace } = useWorkspace();

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
    <Box w="full" maxW="600">
      <Box mb={5} w="full">
        <Text color="grey.400" fontWeight="semibold" fontSize="20px">
          Balance
        </Text>
      </Box>

      <CustomSkeleton isLoaded={!vault.isLoading}>
        <Card p={8} bgColor="grey.800">
          <VStack spacing={9} w="full">
            <HStack
              w="full"
              display="flex"
              alignItems="center"
              justify="space-between"
            >
              <Center display="flex" gap={6} alignItems="flex-start">
                <Avatar
                  variant="roundedSquare"
                  size="lg"
                  p={10}
                  bgColor="grey.600"
                  color="white"
                  name={vault.name}
                />
                <Box>
                  <Heading
                    variant="title-xl"
                    maxW={200}
                    isTruncated={!vault?.name?.includes(' ')}
                  >
                    {vault?.name}
                  </Heading>

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

              <VStack spacing={5} alignItems="flex-end">
                <Box width="50%">
                  <HStack width="100%" spacing={2} alignItems="center">
                    <HStack spacing={2}>
                      <Heading variant="title-xl" ml={3}>
                        {visebleBalance ? balance : '-----'}
                      </Heading>
                      <Box
                        width="5"
                        onClick={() => setVisibleBalance(!visebleBalance)}
                      >
                        {visebleBalance ? (
                          <ViewIcon boxSize={4} />
                        ) : (
                          <ViewOffIcon boxSize={4} />
                        )}
                      </Box>
                    </HStack>
                  </HStack>
                  <Text variant="description">Vault balance</Text>
                </Box>
                <VStack spacing={2} alignItems="flex-end">
                  <Button
                    minW={180}
                    variant="primary"
                    onClick={() => openFaucet(vault.predicateAddress!)}
                    leftIcon={<PlusSquareIcon w={6} h={6} />}
                  >
                    Faucet
                  </Button>
                </VStack>
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
              </VStack>
            </HStack>

            <Divider borderColor="grey.400" />

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
                color="grey.200"
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
                      borderColor="dark.100"
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
