import {
  Badge,
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Icon,
  Link,
  Skeleton,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { useState } from 'react';
import { CgList } from 'react-icons/cg';
import { FaRegPlusSquare } from 'react-icons/fa';
import { GoArrowSwitch } from 'react-icons/go';

import { HomeIcon, PendingIcon, VaultIcon } from '@/components';
import { Pages, Transaction, Witness, WitnessStatus } from '@/modules/core';
import { TransactionCard } from '@/modules/transactions/components/';
import { ExtraVaultCard, VaultCard } from '@/modules/vault';
import { limitCharacters } from '@/utils';

import { useHome } from '..';
import { ActionCard } from '../components/ActionCard';

const { REJECTED, DONE, PENDING } = WitnessStatus;

const HomePage = () => {
  const [open, setOpen] = useState(false);

  const {
    vaultsRequest: {
      vaults: { recentVaults, extraCount, vaultsMax, vaultsTransactions },
      isLoading: loadingRecentVaults,
    },
    transactionsRequest: { transactions },
    account,
    navigate,
  } = useHome();

  const transactionStatus = ({ predicate, witnesses }: Transaction) => {
    const { minSigners } = predicate;
    const vaultMembersCount = predicate.addresses.length;
    const signatureCount = witnesses.filter((t) => t.status === DONE).length;
    const witness = witnesses.find((t: Witness) => t.account === account);
    const howManyDeclined = witnesses.filter(
      (w) => w.status === REJECTED,
    ).length;

    return {
      isCompleted: signatureCount >= minSigners,
      isDeclined: witness?.status === REJECTED,
      isSigned: witness?.status === DONE,
      isPending: witness?.status !== PENDING,
      isReproved: vaultMembersCount - howManyDeclined < minSigners,
    };
  };

  const waitingSignatures = () => {
    return vaultsTransactions?.filter((transaction) => {
      const { isCompleted, isSigned, isDeclined, isReproved } =
        transactionStatus(transaction);

      return !isSigned && !isDeclined && !isCompleted && !isReproved;
    }).length;
  };

  return (
    <VStack w="full" spacing={6}>
      <HStack w="full" h="10" justifyContent="space-between">
        <HStack>
          <Icon as={HomeIcon} fontSize="lg" color="grey.200" />
          <Text color="grey.200" fontWeight="semibold">
            Home
          </Text>
        </HStack>

        <Box>
          <Button
            variant="primary"
            fontWeight="bold"
            leftIcon={<FaRegPlusSquare />}
            onClick={() => alert('ok')}
          >
            Create vault
          </Button>
        </Box>
      </HStack>

      <HStack spacing={6}>
        <ActionCard.Container onClick={() => navigate(Pages.userVaults())}>
          <ActionCard.Icon icon={VaultIcon} />
          <Box>
            <ActionCard.Title>Vaults</ActionCard.Title>
            <ActionCard.Description>
              Access and Manage All Your Vaults in One Place.
            </ActionCard.Description>
          </Box>
        </ActionCard.Container>

        <ActionCard.Container onClick={() => navigate(Pages.transactions())}>
          <ActionCard.Icon icon={GoArrowSwitch} />
          <Box>
            <ActionCard.Title>Transactions</ActionCard.Title>
            <ActionCard.Description>
              Manage Transactions Across All Vaults in One Place.
            </ActionCard.Description>
          </Box>
        </ActionCard.Container>

        <ActionCard.Container isUpcoming={true}>
          <ActionCard.Icon icon={CgList} isUpcoming={true} />
          <Box>
            <ActionCard.Title isUpcoming={true}>Address book</ActionCard.Title>
            <ActionCard.Description>
              Access and Manage Your Contacts for Easy Transfers and Vault
              Creation.
            </ActionCard.Description>
          </Box>
        </ActionCard.Container>
      </HStack>

      {/* RECENT VAULTS */}
      <Box mt={4} mb={-2} alignSelf="flex-start">
        <Text
          variant="subtitle"
          fontWeight="semibold"
          fontSize="xl"
          color="grey.200"
        >
          Recently used vaults
        </Text>
      </Box>
      <Grid w="full" templateColumns="repeat(4, 1fr)" gap={6}>
        {recentVaults?.map(
          ({ id, name, predicateAddress, addresses }, index) => {
            const lastCard = index === vaultsMax - 1;
            const hasMore = extraCount > 0;

            return (
              <GridItem key={id}>
                <Skeleton
                  speed={1}
                  startColor="dark.200"
                  endColor="dark.500"
                  isLoaded={!loadingRecentVaults}
                  w="100%"
                  borderRadius={10}
                >
                  {lastCard && hasMore ? (
                    <ExtraVaultCard
                      extra={extraCount}
                      onClick={() => navigate(Pages.userVaults())}
                    />
                  ) : (
                    <VaultCard
                      name={name}
                      address={predicateAddress}
                      members={addresses}
                      onClick={() => navigate(`/predicate/${id}`)}
                    />
                  )}
                </Skeleton>
              </GridItem>
            );
          },
        )}
      </Grid>

      {/* TRANSACTION LIST */}
      <Box w="full" mt={8}>
        <HStack spacing={4}>
          <Text
            variant="subtitle"
            fontWeight="semibold"
            fontSize="xl"
            color="grey.200"
          >
            Transactions
          </Text>
          <Badge h={6} variant="warning">
            <Icon as={PendingIcon} />
            {`${waitingSignatures()} waiting for your signature`}
          </Badge>
          <Spacer />
          <Link color="brand.500">View all</Link>
        </HStack>

        <VStack spacing={4} mt={6} mb={12}>
          {transactions?.map((transaction) => {
            return (
              <TransactionCard.Container
                status={transactionStatus(transaction)}
                isExpanded={open}
                key={transaction.id}
              >
                <TransactionCard.VaultInfo vault={transaction.predicate} />
                <TransactionCard.CreationDate>
                  {format(new Date(transaction.createdAt), 'EEE, dd MMM')}
                </TransactionCard.CreationDate>
                <TransactionCard.Assets />
                <TransactionCard.Amount assets={transaction.assets} />
                <TransactionCard.Name>
                  {limitCharacters(transaction.name, 20)}
                </TransactionCard.Name>
                <TransactionCard.Status
                  transaction={transaction}
                  status={transactionStatus(transaction)}
                />
                <TransactionCard.Actions
                  transaction={transaction}
                  isExpanded={open}
                  status={transactionStatus(transaction)}
                  collapse={() => setOpen(!open)}
                />
              </TransactionCard.Container>
            );
          })}
        </VStack>
      </Box>
    </VStack>
  );
};

export { HomePage };
