import { Box, VStack } from 'bako-ui';
import { useMemo } from 'react';

import { HomeQueryKey } from '@/modules/core';
import { useTransactionSocketListener } from '@/modules/transactions/hooks/events/useTransactionsSocketListener';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

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
      <RecentVaultsList
        predicates={recentVaults}
        isLoading={latestPredicates.isLoading}
      />
      {/* TRANSACTION LIST */}
      <Box minH="650px" w="full">
        <HomeTransactions />
      </Box>
    </VStack>
  );
};

export { HomePage };
