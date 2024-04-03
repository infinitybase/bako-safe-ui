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
            <VStack spacing={[6, 9]} w="full" pr={3}>
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
                <Box maxW="59%">
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

              <VStack w="full" maxW={['full', '100%']} spacing={5}>
                <Box w={['full', '98%']} maxW="full">
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

                <Divider
                  w={['full', '98%']}
                  mt={[0, 0]}
                  borderColor="dark.100"
                />

                <HStack
                  w={['full', '98%']}
                  justifySelf="end"
                  spacing={[16, 40]}
                >
                  <VStack w="full" spacing={2} alignItems="flex-start">
                    <Button
                      minW={[125, 130]}
                      variant="primary"
                      onClick={() => openFaucet(vault.predicateAddress!)}
                    >
                      Faucet
                    </Button>
                    <Text variant="description" fontSize="xs">
                      Use the faucet to add assets to the vault
                    </Text>
                  </VStack>

                  <VStack w="full" alignItems="flex-end" spacing={0}>
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
                      <Text
                        variant="description"
                        textAlign="right"
                        fontSize="xs"
                        w="full"
                        mt={2}
                        color="error.500"
                      >
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
                      <Text hidden={true} variant="description" fontSize="xs">
                        Send single or batch <br /> payments with multi assets.
                      </Text>
                    )}
                  </VStack>
                </HStack>
              </VStack>
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
