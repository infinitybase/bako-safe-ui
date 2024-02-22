import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Icon,
  Link,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { CgList } from 'react-icons/cg';
import { FaRegPlusSquare } from 'react-icons/fa';
import { GoArrowSwitch } from 'react-icons/go';

import { CustomSkeleton, HomeIcon, VaultIcon } from '@/components';
import { useAuth } from '@/modules/auth';
import { Pages } from '@/modules/core/routes';
import {
  TransactionCard,
  transactionStatus,
  WaitingSignatureBadge,
} from '@/modules/transactions';
import { ExtraVaultCard, VaultCard } from '@/modules/vault';
import { useSelectWorkspace } from '@/modules/workspace';
import { limitCharacters } from '@/utils';

import { useHome } from '..';
import { ActionCard } from '../components/ActionCard';
import { EmptyTransaction } from '../components/EmptyCard/Transaction';

const HomePage = () => {
  const {
    account,
    navigate,
    vaultsRequest: {
      vaults: { recentVaults, extraCount, vaultsMax },
    },
    transactionsRequest: { transactions },
    pendingSignerTransactions,
    homeRequest,
  } = useHome();

  const {
    workspaces: { current },
  } = useAuth();

  const { selectWorkspace } = useSelectWorkspace();
  const hasTransactions = transactions?.length;

  return (
    <VStack id="top" w="full" scrollMargin={20} spacing={6}>
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
            onClick={() =>
              navigate(Pages.createVault({ workspaceId: current }))
            }
          >
            Create vault
          </Button>
        </Box>
      </HStack>
      <CustomSkeleton isLoaded={!homeRequest.isLoading}>
        <HStack spacing={6} w="full" h="full">
          <ActionCard.Container
            onClick={() => navigate(Pages.userVaults({ workspaceId: current }))}
          >
            <ActionCard.Icon icon={VaultIcon} />
            <Box>
              <ActionCard.Title>Vaults</ActionCard.Title>
              <ActionCard.Description>
                Access and Manage All Your Vaults in One Place.
              </ActionCard.Description>
            </Box>
          </ActionCard.Container>

          <ActionCard.Container
            //isUpcoming={hasTransactions ? false : true}
            onClick={() => {
              return hasTransactions
                ? navigate(
                    Pages.userTransactions({
                      workspaceId: current,
                    }),
                  )
                : null;
            }}
          >
            <ActionCard.Icon
              icon={GoArrowSwitch}
              //isUpcoming={hasTransactions ? false : true}
            />
            <Box>
              <ActionCard.Title>Transactions</ActionCard.Title>
              <ActionCard.Description>
                Manage Transactions Across All Vaults in One Place.
              </ActionCard.Description>
            </Box>
          </ActionCard.Container>

          <ActionCard.Container
            onClick={() =>
              navigate(Pages.addressBook({ workspaceId: current }))
            }
          >
            <ActionCard.Icon icon={CgList} />
            <Box>
              <ActionCard.Title>Address book</ActionCard.Title>
              <ActionCard.Description>
                Access and Manage Your Contacts for Easy Transfers and Vault
                Creation.
              </ActionCard.Description>
            </Box>
          </ActionCard.Container>
        </HStack>
      </CustomSkeleton>
      {/* RECENT VAULTS */}
      {recentVaults?.length && (
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
      )}
      <Grid w="full" templateColumns="repeat(4, 1fr)" gap={6}>
        {recentVaults?.map(
          ({ id, name, workspace, members, description }, index) => {
            const lastCard = index === vaultsMax - 1;
            const hasMore = extraCount > 0;

            return (
              <CustomSkeleton isLoaded={!homeRequest.isLoading} key={id}>
                <GridItem>
                  {lastCard && hasMore ? (
                    <ExtraVaultCard
                      extra={extraCount}
                      onClick={() => navigate(Pages.userVaults())}
                    />
                  ) : (
                    <VaultCard
                      id={id}
                      name={name}
                      workspace={workspace}
                      title={description}
                      members={members!}
                      onClick={async () => {
                        selectWorkspace(workspace.id, {
                          onSelect: (_workspace) => {
                            navigate(
                              Pages.detailsVault({
                                workspaceId: _workspace.id,
                                vaultId: id,
                              }),
                            );
                          },
                        });
                      }}
                    />
                  )}
                </GridItem>
              </CustomSkeleton>
            );
          },
        )}
      </Grid>
      {/* TRANSACTION LIST */}
      {transactions && transactions.length <= 0 ? (
        <VStack w="full" spacing={6}>
          {transactions.length && (
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
          )}
          <CustomSkeleton isLoaded={!homeRequest.isLoading}>
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
            <WaitingSignatureBadge
              isLoading={pendingSignerTransactions.isLoading}
              quantity={pendingSignerTransactions.data?.ofUser ?? 0}
            />
            <Spacer />
            <Link
              color="brand.500"
              onClick={() => navigate(Pages.userTransactions())}
            >
              View all
            </Link>
          </HStack>
          <TransactionCard.List spacing={4} mt={6} mb={12}>
            <CustomSkeleton isLoaded={!homeRequest.isLoading}>
              {transactions?.map((transaction) => {
                const status = transactionStatus({ ...transaction, account });
                const isSigner = !!transaction.predicate?.members?.find(
                  (member) => member.address === account,
                );

                return (
                  <TransactionCard.Container
                    mb={4}
                    key={transaction.id}
                    status={status}
                    details={
                      <TransactionCard.Details
                        transaction={transaction}
                        status={status}
                      />
                    }
                  >
                    {transaction.predicate && (
                      <TransactionCard.VaultInfo
                        vault={transaction.predicate}
                      />
                    )}
                    <TransactionCard.CreationDate>
                      {format(new Date(transaction.createdAt), 'EEE, dd MMM')}
                    </TransactionCard.CreationDate>
                    <TransactionCard.Assets />
                    <TransactionCard.Amount
                      assets={transaction.resume.outputs}
                    />
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
                      isSigner={isSigner}
                      status={transactionStatus({
                        ...transaction,
                        account,
                      })}
                    />
                  </TransactionCard.Container>
                );
              })}
            </CustomSkeleton>
          </TransactionCard.List>
        </Box>
      )}
    </VStack>
  );
};

export { HomePage };
