import { Box, Grid, GridItem, VStack } from 'bako-ui';
import { useMemo } from 'react';

import { HomeQueryKey } from '@/modules/core';
import { useTransactionSocketListener } from '@/modules/transactions/hooks/events/useTransactionsSocketListener';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import BalanceAllocationCard from '../components/BalanceAllocationCard';
import HomeTransactions from '../components/HomeTransactions';
import RecentVaultsList from '../components/RecentVaultsList';

const HomePage = () => {
  const {
    authDetails: { userInfos },
    workspaceInfos: {
      requests: { latestPredicates },
    },
  } = useWorkspaceContext();

  const recentVaults = useMemo(() => {
    const predicates = latestPredicates.data?.predicates?.data;
    return (
      predicates?.map((predicate) => ({
        ...predicate,
        configurable:
          typeof predicate.configurable === 'string'
            ? JSON.parse(predicate.configurable)
            : predicate.configurable,
      })) ?? []
    );
  }, [latestPredicates]);

  const workspaceId = userInfos.workspace?.id;

  const homeQueryKey = HomeQueryKey.HOME_WORKSPACE(workspaceId ?? '');

  useTransactionSocketListener(homeQueryKey ?? []);

  return (
    <VStack id="top" w="full" gap={10}>
      {/* RECENT VAULTS */}
      <Grid templateColumns={{ base: '1fr', lg: '2fr 3fr' }} gap={10} w="full">
        <GridItem>
          <BalanceAllocationCard />
        </GridItem>
        <GridItem>
          <RecentVaultsList
            predicates={recentVaults}
            isLoading={latestPredicates.isLoading}
          />
        </GridItem>
      </Grid>
      {/* TRANSACTION LIST */}
      <Box minH="650px" w="full">
        <HomeTransactions />
      </Box>
    </VStack>
  );
};

export { HomePage };
