import debounce from 'lodash.debounce';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

import { queryClient } from '@/config';
import { Pages } from '@/modules/core/routes';
import { useVaultListRequest } from '@/modules/vault/hooks';
import { useWorkspace } from '@/modules/workspace';

interface UseVaultDrawerParams {
  onClose?: () => void;
  isOpen?: boolean;
  onSelect?: (vaultId: string) => void;
}

const useVaultDrawer = (props: UseVaultDrawerParams) => {
  const navigate = useNavigate();
  const { onSelect } = props;
  const inView = useInView({ delay: 300 });
  const [search, setSearch] = useState('');
  const { currentWorkspace } = useWorkspace();
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

  const onSelectVault = (vaultId: string) => {
    props.onClose?.();
    queryClient.invalidateQueries('vault/pagination');
    setSearch('');
    navigate(Pages.detailsVault({ vaultId, workspaceId: currentWorkspace.id }));
  };

  const onCloseDrawer = () => {
    props.onClose?.();
    queryClient.invalidateQueries('vault/pagination');
    setSearch('');
  };

  return {
    drawer: {
      onSelectVault: onSelect ?? onSelectVault,
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
