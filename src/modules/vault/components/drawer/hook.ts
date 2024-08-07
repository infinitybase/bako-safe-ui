import debounce from 'lodash.debounce';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

import { queryClient } from '@/config';
import { Predicate, Workspace } from '@/modules/core';
import { Pages } from '@/modules/core/routes';
import { useVaultListRequest } from '@/modules/vault/hooks';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

interface UseVaultDrawerParams {
  onClose?: () => void;
  isOpen?: boolean;
  onSelect?: (
    vault: Predicate & {
      workspace: Workspace;
    },
  ) => void;
}

const useVaultDrawer = (props: UseVaultDrawerParams) => {
  const navigate = useNavigate();
  const inView = useInView({ delay: 300 });
  const [search, setSearch] = useState('');

  const {
    authDetails: { userInfos },
    workspaceInfos: {
      handlers: { handleWorkspaceSelection },
    },
  } = useWorkspaceContext();

  const vaultListRequestRequest = useVaultListRequest(
    { q: search },
    props.isOpen,
  );

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
    if (
      inView.inView &&
      vaultListRequestRequest.hasNextPage &&
      !vaultListRequestRequest.isLoading
    ) {
      vaultListRequestRequest.fetchNextPage();
    }
  }, [
    inView.inView,
    vaultListRequestRequest.isFetching,
    vaultListRequestRequest.isLoading,
    vaultListRequestRequest.fetchNextPage,
    vaultListRequestRequest.hasNextPage,
  ]);

  const onSelectVault = (
    vault: Predicate & {
      workspace: Workspace;
    },
  ) => {
    props.onClose?.();
    queryClient.resetQueries();
    queryClient.invalidateQueries({ queryKey: ['vault/pagination'] });
    vaultListRequestRequest.refetch();
    setSearch('');
    handleWorkspaceSelection(vault.workspace.id);
    navigate(
      Pages.detailsVault({
        vaultId: vault.id,
        workspaceId: userInfos.workspace?.id,
      }),
    );
  };

  const onCloseDrawer = () => {
    props.onClose?.();
    queryClient.invalidateQueries({ queryKey: ['vault/pagination'] });
    queryClient.resetQueries();
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
    request: vaultListRequestRequest,
    inView,
  };
};

export { useVaultDrawer };
