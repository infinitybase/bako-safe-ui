import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { queryClient } from '@/config/query-client';
import { useContactToast } from '@/modules/addressBook/hooks';

import { GET_API_TOKENS_QUERY_KEY } from '../list';
import { useRemoveAPITokenRequest } from './useRemoveAPITokenRequest';

const useRemoveAPIToken = () => {
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);

  const { vaultId } = useParams<{ workspaceId: string; vaultId: string }>();

  const { mutate, isLoading, isError } = useRemoveAPITokenRequest();
  const { successToast, errorToast } = useContactToast();

  const handleRemove = async (apiTokenId: string) => {
    mutate(
      {
        predicateId: vaultId!,
        apiTokenId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries([GET_API_TOKENS_QUERY_KEY]);
          successToast({
            title: 'API Token removed!',
            description: 'Your API Token was successfully removed.',
          });
        },
        onError: () => {
          errorToast({
            title: 'Error on remove API Token',
            description: 'An error occurred while removing the API Token.',
          });
        },
      },
    );
  };

  return {
    confirm: {
      show: showConfirmRemove,
      set: setShowConfirmRemove,
    },
    request: {
      mutate,
      isLoading,
      isError,
    },
    handler: handleRemove,
  };
};

export { useRemoveAPIToken };
