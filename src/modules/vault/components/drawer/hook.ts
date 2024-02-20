import debounce from 'lodash.debounce';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

import { queryClient } from '@/config';
import { Predicate, Workspace } from '@/modules/core';
import { Pages } from '@/modules/core/routes';
import { useVaultListRequest } from '@/modules/vault/hooks';
import { useSelectWorkspace, useWorkspace } from '@/modules/workspace/hooks';

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
  const { currentWorkspace } = useWorkspace();
  const { selectWorkspace } = useSelectWorkspace();

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
    if (inView.inView && !vaultListRequestRequest.isLoading) {
      vaultListRequestRequest.fetchNextPage();
    }
  }, [
    inView.inView,
    vaultListRequestRequest.isLoading,
    vaultListRequestRequest.fetchNextPage,
  ]);

  const onSelectVault = (
    vault: Predicate & {
      workspace: Workspace;
    },
  ) => {
    props.onClose?.();
    queryClient.invalidateQueries('vault/pagination');
    setSearch('');
    selectWorkspace(vault.workspace);
    navigate(
      Pages.detailsVault({
        vaultId: vault.id,
        workspaceId: currentWorkspace.id,
      }),
    );
  };

  const onCloseDrawer = () => {
    props.onClose?.();
    queryClient.invalidateQueries('vault/pagination');
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
