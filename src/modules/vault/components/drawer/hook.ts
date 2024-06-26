import debounce from 'lodash.debounce';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

import { queryClient } from '@/config';
import { useAuth } from '@/modules/auth';
import { Predicate, Workspace } from '@/modules/core';
import { Pages } from '@/modules/core/routes';
import { useVaultListRequest } from '@/modules/vault/hooks';
import { useSelectWorkspace } from '@/modules/workspace/hooks';

import { useVaultState } from '../../states';

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
  const { setIsFirstAssetsLoading } = useVaultState();

  const { selectWorkspace } = useSelectWorkspace();
  const {
    workspaces: { current },
  } = useAuth();

  const vaultListRequestRequest = useVaultListRequest(
    { q: search },
    // In local was working fine, but when deploy, the requests wasn't being updated even if invalidating it
    // so, removing this props solve the problem
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
    setIsFirstAssetsLoading(true);
    queryClient.resetQueries();
    queryClient.invalidateQueries('vault/pagination');
    vaultListRequestRequest.refetch();
    setSearch('');
    selectWorkspace(vault.workspace.id);
    navigate(
      Pages.detailsVault({
        vaultId: vault.id,
        workspaceId: current,
      }),
    );
  };

  const onCloseDrawer = () => {
    props.onClose?.();
    queryClient.invalidateQueries('vault/pagination');
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
