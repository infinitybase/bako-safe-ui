import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
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
import { QRCodeSVG } from 'qrcode.react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, CustomSkeleton } from '@/components';
import { AddressCopy } from '@/components/addressCopy';
import { AddressUtils, Pages, PermissionRoles } from '@/modules/core';
import { useWorkspace } from '@/modules/workspace';

import { UseVaultDetailsReturn } from '../hooks/details';
import { openFaucet } from '../utils';

export interface CardDetailsProps {
  store: UseVaultDetailsReturn['store'];
  vault: UseVaultDetailsReturn['vault'];
  blockedTransfers: boolean;
}

const SettingsOverview = (props: CardDetailsProps) => {
  const navigate = useNavigate();
  const { vault, store, blockedTransfers } = props;
  const { biggerAsset } = store;
  const {
    currentWorkspace: { workspace: currentWorkspace },
    hasPermission,
  } = useWorkspace();

  const workspaceId = currentWorkspace?.id ?? '';

  const reqPerm = [
    PermissionRoles.ADMIN,
    PermissionRoles.OWNER,
    PermissionRoles.MANAGER,
    PermissionRoles.SIGNER,
  ];
  const makeTransactionsPerm = useMemo(() => {
    const as = hasPermission(reqPerm);
    return as;
  }, [vault.id]);

  if (!vault) return;

  return (
    <Box w="full">
      <Box mb={5} w="full">
        <Text color="grey.200" fontWeight="semibold" fontSize="20px">
          Vault Overview
        </Text>
      </Box>

      <CustomSkeleton isLoaded={!vault.isLoading}>
        <Card p={8} bg="dark.200" borderColor="dark.100">
          <HStack>
            <VStack spacing={9} w="full">
              <HStack spacing={6} w="full">
                <Center>
                  <Avatar
                    variant="roundedSquare"
                    name={vault.name}
                    bg="grey.900"
                    color="white"
                    size={'lg'}
                    p={10}
                  />
                </Center>
                <Box>
                  <Heading mb={1} variant="title-xl" isTruncated maxW={600}>
                    {vault?.name}
                  </Heading>

                  <Box maxW={420}>
                    <Text variant="description">{vault?.description}</Text>
                  </Box>
                </Box>
              </HStack>

              <HStack
                w="full"
                spacing={5}
                justifyContent="flex-start"
                alignItems="flex-start"
              >
                <VStack spacing={5}>
                  <Box width="100%">
                    <HStack
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Text variant="description">Vault balance</Text>
                      <HStack spacing={2}>
                        <HStack spacing={2}>
                          <Heading variant="title-xl">
                            {store.visebleBalance
                              ? biggerAsset?.amount ?? 0
                              : '*****'}
                          </Heading>
                          <Text variant="description" fontSize="md">
                            {biggerAsset?.slug ?? 'ETH'}
                          </Text>
                        </HStack>
                        <Box
                          display="flex"
                          width="18%"
                          justifyContent="center"
                          alignItems="center"
                          onClick={() =>
                            store.setVisibleBalance(!store.visebleBalance)
                          }
                        >
                          {store.visebleBalance ? (
                            <ViewIcon boxSize={6} />
                          ) : (
                            <ViewOffIcon boxSize={6} />
                          )}
                        </Box>
                      </HStack>
                    </HStack>
                  </Box>

                  <Divider borderColor="dark.100" />

                  <HStack spacing={40}>
                    <VStack spacing={2} alignItems="flex-start">
                      <Button
                        minW={130}
                        variant="primary"
                        onClick={() => openFaucet(vault.predicateAddress!)}
                      >
                        Faucet
                      </Button>
                      <Text variant="description" fontSize="xs">
                        Use the faucet to <br />
                        add assets to the vault
                      </Text>
                    </VStack>

                    <VStack spacing={2} alignItems="flex-start">
                      <Button
                        minW={130}
                        variant="primary"
                        isDisabled={
                          !vault?.hasBalance ||
                          blockedTransfers ||
                          !makeTransactionsPerm
                        }
                        onClick={() =>
                          navigate(
                            Pages.createTransaction({
                              vaultId: vault.id!,
                              workspaceId,
                            }),
                          )
                        }
                      >
                        Send
                      </Button>
                      {blockedTransfers ? (
                        <Text variant="description" mt={2} color="error.500">
                          This vault has pending transactions.
                        </Text>
                      ) : !makeTransactionsPerm ? (
                        <Text
                          variant="description"
                          fontSize="xs"
                          color="error.500"
                        >
                          You dont have permission to send transactions.
                        </Text>
                      ) : (
                        <Text variant="description" fontSize="xs">
                          Send single or batch <br /> payments with multi
                          assets.
                        </Text>
                      )}
                    </VStack>
                  </HStack>
                </VStack>
              </HStack>
            </VStack>

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
          </HStack>
        </Card>
      </CustomSkeleton>
    </Box>
  );
};

export { SettingsOverview };
