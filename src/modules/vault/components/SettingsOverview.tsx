import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { QRCodeSVG } from 'qrcode.react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, CustomSkeleton } from '@/components';
import { AddressCopy } from '@/components/addressCopy';
import { useAuth } from '@/modules/auth';
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

  const { hasPermission } = useWorkspace();
  const {
    workspaces: { current },
  } = useAuth();

  const workspaceId = current ?? '';

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
        <Card
          p={[4, 8]}
          bg="dark.200"
          position="relative"
          borderColor="dark.100"
        >
          <Stack direction={['column', 'row']}>
            <VStack spacing={[6, 9]} w="full">
              <Stack
                direction={['column', 'row']}
                alignItems={['flex-start', 'center']}
                spacing={[3, 6]}
                w="full"
                maxW={['full', '100%']}
              >
                <Center>
                  <Avatar
                    variant="roundedSquare"
                    name={vault.name}
                    bg="grey.900"
                    color="white"
                    size={'lg'}
                    p={[10, 10]}
                  />
                </Center>
                <Box>
                  <Heading
                    mb={1}
                    variant="title-xl"
                    fontSize={['md', 'xl']}
                    isTruncated
                    maxW={600}
                  >
                    {vault?.name}
                  </Heading>

                  <Box maxW={420}>
                    <Text variant="description">{vault?.description}</Text>
                  </Box>
                </Box>
              </Stack>

              <HStack
                w="full"
                maxW={[160, '100%']}
                spacing={5}
                justifyContent={['center', 'flex-start']}
                alignItems="flex-start"
              >
                <VStack spacing={5}>
                  <Box width="100%" maxW="full">
                    <Stack
                      justifyContent={['flex-start', 'space-between']}
                      alignItems={['flex-start', 'center']}
                      direction={['column', 'row']}
                      mb={2}
                    >
                      <Text variant="description">Vault balance</Text>
                      <HStack spacing={2}>
                        <HStack spacing={2}>
                          <Heading variant="title-xl" fontSize={['md', 'lg']}>
                            {store.visebleBalance
                              ? biggerAsset?.amount ?? 0
                              : '*****'}
                          </Heading>
                          <Text variant="description" fontSize={['sm', 'md']}>
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
                            <ViewIcon boxSize={[5, 6]} />
                          ) : (
                            <ViewOffIcon boxSize={[5, 6]} />
                          )}
                        </Box>
                      </HStack>
                    </Stack>
                  </Box>

                  <Divider mt={[0, 0]} borderColor="dark.100" />

                  <HStack spacing={[16, 40]}>
                    <VStack spacing={2} alignItems="flex-start">
                      <Button
                        minW={[125, 130]}
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
                        minW={[125, 130]}
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

            <VStack
              position={['absolute', 'relative']}
              top={[4, 0]}
              right={[4, 0]}
              spacing={4}
              align={['flex-end', 'center']}
              justifyContent="flex-start"
            >
              <Box
                p={3}
                backgroundColor={'white'}
                w={[32, 180]}
                h={[32, 180]}
                borderRadius={10}
              >
                <QRCodeSVG
                  value={vault.predicateAddress!}
                  fgColor="black"
                  bgColor="white"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 10,
                  }}
                />
              </Box>

              <AddressCopy
                w="full"
                mb={[4, 0]}
                maxW={['40', 180]}
                address={AddressUtils.format(vault.predicateAddress)!}
                addressToCopy={vault.predicateAddress!}
              />
            </VStack>
          </Stack>
        </Card>
      </CustomSkeleton>
    </Box>
  );
};

export { SettingsOverview };
