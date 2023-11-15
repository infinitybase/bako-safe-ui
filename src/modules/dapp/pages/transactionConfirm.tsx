import {
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
import { Dapp } from '@/layouts';
import { useQueryParams } from '@/modules/auth';
import { AddressUtils, Pages } from '@/modules/core';
import {
  DappConnectionAlert,
  DappConnectionDetail,
} from '@/modules/dapp/components';
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
    <Dapp.Content>
      <Dapp.Section>
        <Dapp.Header
          title="Create transaction"
          description="Setting Sail on a Journey to Unlock the Potential of User-Centered Design."
        />
      </Dapp.Section>

      {/* Vault */}
      <Dapp.Section>
        {vault && (
          <VaultDrawerBox
            name={vault.name}
            address={vault.address.toString()}
            description={vault.description}
            isActive
          />
        )}
      </Dapp.Section>

      <Divider borderColor="dark.100" mb={7} />

      {/* DApp infos */}
      <Dapp.Section>
        <DappConnectionDetail
          title="E21 - app"
          origin="http://localhost:5432"
          faviconUrl=""
        />
      </Dapp.Section>

      {/* Alert */}
      <Dapp.Section>
        <DappConnectionAlert origin="http://localhost:5432" />
      </Dapp.Section>

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
    </Dapp.Content>
  );
};

export { TransactionConfirm };
