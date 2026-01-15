import { useQueryClient } from '@tanstack/react-query';
import { Box, Grid, GridItem, Loader, Text } from 'bako-ui';
import { useEffect, useMemo } from 'react';

import { TransactionFilters } from '@/components';
import AddAssetsDialog from '@/components/addAssetsDialog';
import DepositDialog from '@/components/depositDialog';
import { EmptyState } from '@/components/emptyState';
import WelcomeDialog from '@/components/welcomeDialog';
import { CardLiquidStake } from '@/modules';
import { useBakoSafeVault } from '@/modules/core/hooks';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';
import { TransactionCard, WaitingSignatureBadge } from '@/modules/transactions';
import { TransactionListSkeleton } from '@/modules/transactions/components/TransactionListSkeleton';
import { useTransactionSocketListener } from '@/modules/transactions/hooks/events/useTransactionsSocketListener';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { AccountAllocation, AccountOverview } from '../../components';
import { useCheckPredicateBalances, useVaultInfosContext } from '../../hooks';
import { usePredicateBalanceOutdatedSocketListener } from '../../hooks/events';
import { vaultInfinityQueryKey } from '../../hooks/list/useVaultTransactionsRequest';

const VaultDetailsPage = () => {
  const { isOpen: welcomeDialogState, onOpenChange: setWelcomeDialogState } =
    useDisclosure(true);
  const {
    isOpen: addAssetsDialogState,
    onOpenChange: setAddAssetsDialogState,
    onOpen: setIsAddAssetDialogOpen,
  } = useDisclosure();
  const {
    isOpen: depositDialogState,
    onOpenChange: setDepositDialogState,
    setOpen: setOpenDepositDialog,
  } = useDisclosure();
  const { vault, assets } = useVaultInfosContext();

  const {
    vaultTransactions: {
      filter: { txFilterType, value: status },
      lists: { transactions },
      request: { isLoading, isFetching, queryKey },
      handlers: {
        handleIncomingAction,
        handleOutgoingAction,
        handleAllAction,
        handlePendingStatusChange,
      },
      transactionsRef,
    },
    pendingSignerTransactions,
    isPendingSigner,
  } = useTransactionsContext();
  const queryClient = useQueryClient();

  const {
    authDetails: { userInfos },
    screenSizes: { isSmall, isMobile },
  } = useWorkspaceContext();

  const hasTransactions = useMemo(
    () => !isLoading && transactions?.length,
    [isLoading, transactions],
  );

  const { vault: vaultSafe } = useBakoSafeVault({
    address: vault.data.predicateAddress,
    provider: vault.data.provider,
    id: vault.data.id,
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey, exact: true });
    };
  }, []);

  const vaultQueryKey =
    vaultInfinityQueryKey.VAULT_TRANSACTION_LIST_PAGINATION_QUERY_KEY(
      vault.data?.id ?? undefined,
    );

  const workspaceId = userInfos?.workspace?.id || '';

  useTransactionSocketListener(vaultQueryKey ?? []);
  useCheckPredicateBalances(vault.data?.id ?? '');
  usePredicateBalanceOutdatedSocketListener();

  if (!vault) return null;

  return (
    <Box w="full">
      <WelcomeDialog
        isOpen={welcomeDialogState}
        onOpenChange={setWelcomeDialogState}
        setIsDepositDialogOpen={setOpenDepositDialog}
      />

      <DepositDialog
        isOpen={depositDialogState}
        onOpenChange={setDepositDialogState}
        vault={vault.data}
      />

      <AddAssetsDialog
        isOpen={addAssetsDialogState}
        onOpenChange={setAddAssetsDialogState}
        setIsDepositDialogOpen={setOpenDepositDialog}
      />

      <Grid
        alignItems="stretch"
        gap={10}
        templateColumns={{
          base: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(8, 1fr)',
        }}
      >
        <GridItem
          colSpan={{
            md: 2,
            lg: 3,
          }}
        >
          <AccountOverview
            vault={vault}
            onAddAssets={setIsAddAssetDialogOpen}
            isPendingSigner={isPendingSigner}
          />
        </GridItem>
        <GridItem colSpan={{ lg: 2 }}>
          <AccountAllocation
            assets={assets}
            vault={vault}
            workspaceId={workspaceId}
          />
        </GridItem>
        <GridItem colSpan={{ lg: 3 }}>
          <CardLiquidStake assets={assets} vault={vaultSafe} />
        </GridItem>
      </Grid>

      <Box
        w="full"
        display="flex"
        flexDir={{ base: 'row', sm: isSmall ? 'column' : 'row' }}
        alignItems="center"
        gap={4}
        mt={{ md: 10, base: 4 }}
        mb={{ base: 4, md: 6 }}
        justifyContent="space-between"
      >
        <Box
          display="flex"
          flexDir={{ base: 'column', sm: isSmall ? 'column' : 'row' }}
          alignItems={{ base: 'start', sm: isSmall ? 'unset' : 'center' }}
          gap={isSmall ? 2 : 4}
        >
          <Text as="h2" fontWeight="semibold" fontSize="sm" color="textPrimary">
            Transactions
          </Text>
          <WaitingSignatureBadge
            isLoading={pendingSignerTransactions.isLoading}
            quantity={pendingSignerTransactions.data?.ofUser ?? 0}
          />
        </Box>

        <TransactionFilters
          currentFilter={txFilterType}
          onIncomingFilter={handleIncomingAction}
          onOutgoingFilter={handleOutgoingAction}
          onAllFilter={handleAllAction}
          status={status}
          isPendingSignerTransaction={isPendingSigner}
          onPendingFilter={handlePendingStatusChange}
          justifyContent="flex-end"
        />
      </Box>

      {isLoading && <TransactionListSkeleton />}

      {hasTransactions
        ? transactions?.map((grouped, index) => {
            const isLastGroup = index === transactions.length - 1;
            return (
              <Box key={grouped.day} w="full">
                <TransactionCard.GroupDay day={grouped.day} mb={2} />
                <TransactionCard.List
                  w="full"
                  maxH={{ base: undefined, sm: 'calc(100% - 72px)' }}
                  gap={0}
                >
                  {grouped?.transactions?.map((transaction) => (
                    <TransactionCard.Item
                      w="full"
                      key={transaction.id}
                      ref={transactionsRef}
                      isMobile={isMobile}
                      transaction={transaction}
                      userInfos={userInfos}
                    />
                  ))}

                  {isLastGroup &&
                    grouped.transactions.length >= 5 &&
                    isFetching && (
                      <Loader alignSelf="center" mt={4} color="brand.500" />
                    )}
                </TransactionCard.List>
              </Box>
            );
          })
        : !!transactions && !isLoading && <EmptyState showAction={false} />}
    </Box>
  );
};

export { VaultDetailsPage };
