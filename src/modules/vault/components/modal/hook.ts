import debounce from 'lodash.debounce';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { Pages } from '@/modules/core/routes';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';
import { useVaultListRequest } from '@/modules/vault/hooks';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { PredicateAndWorkspace } from '../../services/methods';

interface UseVaultDrawerParams {
  onClose?: () => void;
  onCloseAll?: () => void;
  isOpen?: boolean;
  orderByRoot?: boolean;
  perPage?: number;
}

const useVaultDrawer = (props: UseVaultDrawerParams) => {
  const inView = useInView({ delay: 300 });
  const [search, setSearch] = useState('');

  const {
    authDetails: { userInfos },
    workspaceInfos: {
      handlers: { handleWorkspaceSelection },
      requests: {
        workspaceBalance: { refetch: refetchWorkspaceBalance },
      },
    },
    vaultDetails: {
      vaultRequest: { refetch: refetchVaultRequest },
    },
  } = useWorkspaceContext();

  const {
    vaultTransactions: {
      request: { refetch: refetchVaultTransactions },
      handlers: { setSelectedTransaction, selectedTransaction },
    },
    resetAllTransactionsTypeFilters,
  } = useTransactionsContext();

  const vaultList = useVaultListRequest(
    { q: search, perPage: props.perPage, orderByRoot: props.orderByRoot },
    props.isOpen,
  );

  const invalidateRequests = () => {
    refetchVaultTransactions();
    refetchVaultRequest();
    refetchWorkspaceBalance();
    vaultList.refetch();
  };

  const debouncedSearchHandler = useCallback(
    debounce((event: string | ChangeEvent<HTMLInputElement>) => {
      if (typeof event === 'string') {
        setSearch(event);
        return;
      }

      setSearch(event.target.value);
    }, 300),
    [],
  );

  useEffect(() => {
    if (inView.inView && vaultList.hasNextPage && !vaultList.isLoading) {
      vaultList.fetchNextPage();
    }
  }, [
    inView.inView,
    vaultList.isFetching,
    vaultList.isLoading,
    vaultList.fetchNextPage,
    vaultList.hasNextPage,
  ]);

  const onSelectVault = (vault: PredicateAndWorkspace) => {
    if (selectedTransaction?.id?.length) {
      setSelectedTransaction({ id: '', name: '' });
    }

    if (props.onCloseAll) props.onCloseAll();
    else props.onClose?.();

    resetAllTransactionsTypeFilters();
    invalidateRequests();
    setSearch('');
    handleWorkspaceSelection(
      vault.workspace.id,
      Pages.detailsVault({
        vaultId: vault.id,
        workspaceId: userInfos.workspace?.id,
      }),
    );
  };

  const onCloseDrawer = () => {
    props.onClose?.();
    setSearch('');
  };

  return {
    drawer: {
      onSelectVault: onSelectVault,
      onClose: onCloseDrawer,
    },
    search: {
      value: search,
      handler: debouncedSearchHandler,
    },
    request: vaultList,
    inView,
  };
};

export { useVaultDrawer };
