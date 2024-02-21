import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { bn } from 'fuels';
import { QRCodeSVG } from 'qrcode.react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, CustomSkeleton } from '@/components';
import { AddressUtils, PermissionRoles } from '@/modules/core';
import { Pages } from '@/modules/core/routes';
import { useWorkspace } from '@/modules/workspace';

import { AddressCopy } from '../../../components/addressCopy';
import { useVaultDetails, UseVaultDetailsReturn } from '../hooks/details';
import { openFaucet } from '../utils';

export interface CardDetailsProps {
  store: UseVaultDetailsReturn['store'];
  vault: UseVaultDetailsReturn['vault'];
}

const MAX_DESCRIPTION_CHARS = 80;

const CardDetails = (props: CardDetailsProps) => {
  const navigate = useNavigate();
  const { store, vault } = props;
  const { biggerAsset, visebleBalance, setVisibleBalance } = store;
  const { currentWorkspace, hasPermission } = useWorkspace();
  const { vault: vaultDetails } = useVaultDetails();
  const balance = bn(bn.parseUnits(biggerAsset?.amount ?? '0.000')).format({
    precision: 4,
  });
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
  }, [vault.id, balance]);

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
    <Box w="full" maxW="460px">
      <Box mb={5} w="full">
        <Text color="grey.200" fontWeight="semibold" fontSize="20px">
          Overview
        </Text>
      </Box>

      <CustomSkeleton isLoaded={!vault.isLoading}>
        <Card p={8}>
          <VStack spacing={9} w="full">
            <HStack spacing={6} w="full">
              <Center>
                <Avatar
                  variant="roundedSquare"
                  size="lg"
                  p={10}
                  bgColor="grey.900"
                  color="white"
                  name={vault.name}
                />
              </Center>
              <Box>
                <Heading
                  mb={3}
                  variant="title-xl"
                  maxW={280}
                  isTruncated={!vault?.name?.includes(' ')}
                >
                  {vault?.name}
                </Heading>

                <Text
                  maxW="250px"
                  variant="description"
                  textOverflow="ellipsis"
                  noOfLines={2}
                  isTruncated
                >
                  {vaultDescription}
                </Text>
              </Box>
            </HStack>

            <HStack
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
              <VStack spacing={5} alignItems="flex-start">
                <Box width="100%">
                  <HStack width="100%" spacing={2}>
                    <HStack spacing={2}>
                      <Heading variant="title-xl">
                        {visebleBalance ? balance : '*****'}
                      </Heading>
                      <Text variant="description" fontSize="md">
                        {visebleBalance ? biggerAsset?.slug : 'ETH'}
                      </Text>
                    </HStack>
                    <Box
                      display="flex"
                      width="18%"
                      justifyContent="center"
                      alignItems="center"
                      onClick={() => setVisibleBalance(!visebleBalance)}
                    >
                      {visebleBalance ? (
                        <ViewIcon boxSize={6} />
                      ) : (
                        <ViewOffIcon boxSize={6} />
                      )}
                    </Box>
                  </HStack>
                  <Text variant="description">Vault balance</Text>
                </Box>
                <VStack spacing={2} alignItems="flex-start">
                  <Button
                    minW={130}
                    variant="primary"
                    onClick={() => openFaucet(vault.predicateAddress!)}
                  >
                    Faucet
                  </Button>
                  <Text variant="description" fontSize="xs">
                    Use the faucet to add assets to the vault.
                  </Text>
                </VStack>
                <VStack spacing={2} alignItems="flex-start">
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
                </VStack>
              </VStack>
            </HStack>
          </VStack>
        </Card>
      </CustomSkeleton>
    </Box>
  );
};

export { CardDetails };
