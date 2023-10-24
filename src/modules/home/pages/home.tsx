import {
  Badge,
  Box,
  Button,
  CircularProgress,
  Grid,
  GridItem,
  HStack,
  Icon,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { CgList } from 'react-icons/cg';
import { FaRegPlusSquare } from 'react-icons/fa';
import { GoArrowSwitch } from 'react-icons/go';

import { CustomSkeleton, HomeIcon, PendingIcon, VaultIcon } from '@/components';
import { Pages } from '@/modules';
import {
  TransactionCard,
  transactionStatus,
  waitingSignatures,
} from '@/modules/transactions';
import { ExtraVaultCard, VaultCard } from '@/modules/vault';
import { limitCharacters } from '@/utils';

import { useHome } from '..';
import { ActionCard } from '../components/ActionCard';
import { EmptyTransaction } from '../components/EmptyCard/Transaction';
import { EmptyVault } from '../components/EmptyCard/Vault';

const HomePage = () => {
  const {
    account,
    navigate,
    vaultsRequest: {
      vaults: { recentVaults, extraCount, vaultsMax },
      loadingRecentVaults,
    },
    transactionsRequest: {
      transactions,
      loadingTransactions,
      isFetching: isFetchingTransactions,
    },
  } = useHome();

  const isLoading = loadingRecentVaults || loadingTransactions;
  const hasVaults = recentVaults && recentVaults?.length;

  return (
    <VStack id="top" w="full" scrollMargin={20} spacing={6}>
      {!hasVaults ? (
        <CustomSkeleton isLoaded={!isLoading}>
          <EmptyVault />
        </CustomSkeleton>
      ) : (
        <>
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
                onClick={() => navigate(Pages.createVault())}
              >
                Create vault
              </Button>
            </Box>
          </HStack>
          <CustomSkeleton isLoaded={!isLoading}>
            <HStack spacing={6} w="full" h="full">
              <ActionCard.Container
                onClick={() => navigate(Pages.userVaults())}
              >
                <ActionCard.Icon icon={VaultIcon} />
                <Box>
                  <ActionCard.Title>Vaults</ActionCard.Title>
                  <ActionCard.Description>
                    Access and Manage All Your Vaults in One Place.
                  </ActionCard.Description>
                </Box>
              </ActionCard.Container>

              <ActionCard.Container isUpcoming={true}>
                <ActionCard.Icon isUpcoming={true} icon={GoArrowSwitch} />
                <Box>
                  <ActionCard.Title isUpcoming={true}>
                    Transactions
                  </ActionCard.Title>
                  <ActionCard.Description>
                    Manage Transactions Across All Vaults in One Place.
                  </ActionCard.Description>
                </Box>
              </ActionCard.Container>

              <ActionCard.Container isUpcoming={true}>
                <ActionCard.Icon icon={CgList} isUpcoming={true} />
                <Box>
                  <ActionCard.Title isUpcoming={true}>
                    Address book
                  </ActionCard.Title>
                  <ActionCard.Description>
                    Access and Manage Your Contacts for Easy Transfers and Vault
                    Creation.
                  </ActionCard.Description>
                </Box>
              </ActionCard.Container>
            </HStack>
          </CustomSkeleton>
          {/* RECENT VAULTS */}
          <Box mt={4} alignSelf="flex-start">
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
              (
                { id, name, predicateAddress, completeAddress, description },
                index,
              ) => {
                const lastCard = index === vaultsMax - 1;
                const hasMore = extraCount > 0;

                return (
                  <GridItem key={id}>
                    <CustomSkeleton isLoaded={!isLoading}>
                      {lastCard && hasMore ? (
                        <ExtraVaultCard
                          extra={extraCount}
                          onClick={() => navigate(Pages.userVaults())}
                        />
                      ) : (
                        <VaultCard
                          name={name}
                          title={description}
                          address={predicateAddress}
                          members={completeAddress}
                          onClick={() =>
                            navigate(Pages.detailsVault({ vaultId: id }))
                          }
                        />
                      )}
                    </CustomSkeleton>
                  </GridItem>
                );
              },
            )}
          </Grid>
          {/* TRANSACTION LIST */}
          {transactions && transactions.length <= 0 ? (
            <VStack w="full" spacing={6}>
              <HStack w="full" spacing={4}>
                <Text
                  variant="subtitle"
                  fontWeight="semibold"
                  fontSize="xl"
                  color="grey.200"
                >
                  Transactions
                </Text>
              </HStack>
              <CustomSkeleton isLoaded={!isLoading}>
                <EmptyTransaction />
              </CustomSkeleton>
            </VStack>
          ) : (
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
                <CircularProgress
                  hidden={!isFetchingTransactions}
                  size="20px"
                  color="brand.500"
                  trackColor="dark.100"
                  isIndeterminate
                />
                <Badge h={6} variant="warning" hidden={isFetchingTransactions}>
                  <Icon as={PendingIcon} />
                  {`${waitingSignatures({
                    account,
                    transactions: transactions ?? [],
                  })} waiting for your signature`}
                </Badge>
                <Spacer />
              </HStack>
              <TransactionCard.List spacing={4} mt={6} mb={12}>
                {transactions?.map((transaction) => {
                  return (
                    <CustomSkeleton isLoaded={!isLoading} key={transaction.id}>
                      <TransactionCard.Container
                        status={transactionStatus({ ...transaction, account })}
                        details={
                          <TransactionCard.Details transaction={transaction} />
                        }
                      >
                        <TransactionCard.VaultInfo
                          vault={transaction.predicate}
                        />
                        <TransactionCard.CreationDate>
                          {format(
                            new Date(transaction.createdAt),
                            'EEE, dd MMM',
                          )}
                        </TransactionCard.CreationDate>
                        <TransactionCard.Assets />
                        <TransactionCard.Amount assets={transaction.assets} />
                        <TransactionCard.Name>
                          {limitCharacters(transaction.name, 20)}
                        </TransactionCard.Name>
                        <TransactionCard.Status
                          transaction={transaction}
                          status={transactionStatus({
                            ...transaction,
                            account,
                          })}
                        />
                        <TransactionCard.Actions
                          transaction={transaction}
                          status={transactionStatus({
                            ...transaction,
                            account,
                          })}
                        />
                      </TransactionCard.Container>
                    </CustomSkeleton>
                  );
                })}
              </TransactionCard.List>
            </Box>
          )}
        </>
      )}
    </VStack>
  );
};

export { HomePage };
