import {
  Alert,
  Avatar,
  Box,
  Center,
  Divider,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, Dialog, SquarePlusIcon } from '@/components';
import { DappRightArrow } from '@/components/icons/dapp-right-arrow';
import { DappWarning } from '@/components/icons/dapp-warning';
import { useQueryParams } from '@/modules/auth';
import { AddressUtils, Pages } from '@/modules/core';
import { VaultDrawerBox } from '@/modules/vault/components/drawer/box';

import { useTransactionSocket } from '../hooks';

const TransactionConfirm = () => {
  const {
    init,
    confirmTransaction,
    cancelTransaction,
    vault,
    summary: { transactionSummary, mainOperation },
  } = useTransactionSocket();
  const { sessionId } = useQueryParams();
  const navigate = useNavigate();

  if (!sessionId) {
    window.close();
    navigate(Pages.home());
  }

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    console.log({ mainOperation });
  }, [mainOperation]);

  return (
    <Box w="full" px={6} py={8}>
      {/* Header */}
      <Box w="full" mb={7}>
        <Dialog.Header
          title="Create transaction"
          description="Setting Sail on a Journey to Unlock the Potential of User-Centered Design."
        />
      </Box>

      {/* Vault */}
      <Box w="full" mb={7}>
        {vault && (
          <VaultDrawerBox
            name={vault.name}
            address={vault.address.toString()}
            description={vault.description}
            isActive
          />
        )}
      </Box>

      <Divider borderColor="dark.100" mb={7} />

      {/* DApp infos */}
      <Box w="full" mb={7}>
        <Card py={4}>
          <Text variant="description">Requesting a transaction from:</Text>
          <Divider borderColor="dark.100" my={4} />
          <HStack alignItems="flex-start" spacing={4}>
            <Avatar
              variant="roundedSquare"
              bgColor="dark.150"
              color="white"
              name="EA"
            />
            <Box w="full">
              <Text variant="subtitle">E21 -app</Text>
              <Text fontSize="sm" fontWeight="normal" color="brand.600">
                localhost:5173
              </Text>
            </Box>
          </HStack>
        </Card>
      </Box>

      {/* Alert */}
      <Box w="full" mb={7}>
        <Alert
          px={6}
          py={4}
          bgColor="#FDD8351A"
          borderWidth={1}
          borderRadius={8}
          borderColor="#FDD8351A"
        >
          <Icon fontSize="2xl" as={DappWarning} />
          <Box w="full" ml={4}>
            <Text variant="subtitle" color="#FDD835">
              Double check it!
            </Text>
            <Text fontSize="sm" fontWeight="normal" color="grey.200">
              localhost:5173
            </Text>
          </Box>
        </Alert>
      </Box>

      <Divider borderColor="dark.100" mb={7} />

      {/* Transaction Summary */}
      <VStack w="full" spacing={0} mb={7}>
        <HStack w="full" position="relative" spacing={0}>
          <Card
            display="flex"
            flexDirection="column"
            alignItems="center"
            borderBottomRadius={0}
            py={4}
            w="full"
          >
            <Text variant="description" textAlign="center">
              From:
            </Text>
            <Divider borderColor="dark.100" mt={2} mb={4} />
            <Center flexDirection="column">
              <Avatar
                mb={2}
                name="EA"
                color="white"
                bgColor="dark.150"
                variant="roundedSquare"
              />
              <Text textAlign="center" variant="title">
                {mainOperation?.from?.address === vault?.BSAFEVault.addresses
                  ? vault?.name
                  : 'Unknown'}
              </Text>
              <Text textAlign="center" variant="description">
                {AddressUtils.format(mainOperation?.from?.address ?? '')}
              </Text>
            </Center>
          </Card>
          <Box
            px={4}
            py={3}
            left="50%"
            right="50%"
            width="min-content"
            bgColor="dark.150"
            position="absolute"
            transform="translate(-50%)"
            borderRadius={10}
          >
            <Icon as={DappRightArrow} color="grey.200" />
          </Box>
          <Card
            display="flex"
            flexDirection="column"
            alignItems="center"
            borderBottomRadius={0}
            py={4}
            w="full"
          >
            <Text variant="description" textAlign="center">
              To:
            </Text>
            <Divider borderColor="dark.100" mt={2} mb={4} />
            <Center flexDirection="column">
              <Avatar
                mb={2}
                name="EA"
                color="white"
                bgColor="dark.150"
                variant="roundedSquare"
              />
              <Text textAlign="center" variant="title">
                {mainOperation?.to?.address === vault?.BSAFEVault.addresses
                  ? vault?.name
                  : 'Unknown'}
              </Text>
              <Text textAlign="center" variant="description">
                {AddressUtils.format(mainOperation?.to?.address ?? '')}
              </Text>
            </Center>
          </Card>
        </HStack>
        <Card as={HStack} w="full" borderTopRadius={0}>
          <Avatar
            mb={2}
            name="U"
            color="white"
            bgColor="dark.150"
            variant="roundedSquare"
          />
          <Box w="full">
            <Text variant="subtitle">Token</Text>
            <Text variant="description">q2898iuewi...2928</Text>
          </Box>
          <Box minW="max-content">
            <Text variant="subtitle">1.0987 TKN</Text>
          </Box>
        </Card>
      </VStack>

      <Card display="flex" justifyContent="space-between">
        <Text variant="subtitle">Gas Fee (ETH)</Text>
        <Text variant="subtitle">{transactionSummary?.fee.format()}</Text>
      </Card>

      <Divider borderColor="dark.100" mb={7} />

      {/* Actions */}
      <Dialog.Actions maxW={420}>
        <Dialog.SecondaryAction size="lg" onClick={cancelTransaction}>
          Reject
        </Dialog.SecondaryAction>
        <Dialog.PrimaryAction
          size="lg"
          leftIcon={<SquarePlusIcon fontSize="lg" />}
          onClick={confirmTransaction}
        >
          Create transaction
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </Box>
  );
};

export { TransactionConfirm };
