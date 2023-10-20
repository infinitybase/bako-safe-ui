import debounce from 'lodash.debounce';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

import { queryClient } from '@/config';
import { Pages, useVaultListRequest } from '@/modules';

interface UseVaultDrawerParams {
  onClose: () => void;
  isOpen?: boolean;
}

const useVaultDrawer = (props: UseVaultDrawerParams) => {
  const navigate = useNavigate();
  const inView = useInView({ delay: 300 });
  const [search, setSearch] = useState('');

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
    props.onClose();
    queryClient.invalidateQueries('vault/pagination');
    setSearch('');
    navigate(Pages.detailsVault({ vaultId }));
  };

  const onCloseDrawer = () => {
    props.onClose();
    queryClient.invalidateQueries('vault/pagination');
    setSearch('');
  };

  return {
    drawer: {
      onSelectVault,
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
