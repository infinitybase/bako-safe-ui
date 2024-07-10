import { Dispatch, useState } from 'react';
import { useParams } from 'react-router-dom';

import { queryClient } from '@/config';
import { useContactToast } from '@/modules/addressBook';
import {
  CreateAPITokenPayload,
  CreateAPITokenResponse,
} from '@/modules/cli/services';

import { GET_API_TOKENS_QUERY_KEY } from '../list';
import { TabState } from '../useAPIToken';
import { useCreateAPITokenForm } from './useCreateAPITokenForm';
import { useCreateAPITokenRequest } from './useCreateAPITokenRequest';

export type UseCreateAPITokenReturn = ReturnType<typeof useCreateAPIToken>;

const useCreateAPIToken = (
  setTab: Dispatch<React.SetStateAction<TabState>>,
) => {
  const [createdAPIKey, setCreatedAPIKey] = useState<string>('');

  const { vaultId } = useParams<{ workspaceId: string; vaultId: string }>();

  const { form } = useCreateAPITokenForm();
  const { mutate, isLoading, isError } = useCreateAPITokenRequest(vaultId!);
  const { successToast, errorToast } = useContactToast();

  const handleSubmit = form.handleSubmit(async (data) => {
    const formattdeData: CreateAPITokenPayload = {
      name: data.name,
      config: {
        transactionTitle: data.transactionName,
      },
    };

    await mutate(formattdeData, {
      onSuccess: (data: CreateAPITokenResponse) => {
        queryClient.invalidateQueries([GET_API_TOKENS_QUERY_KEY]);
        successToast({
          title: 'API Token created!',
          description: 'Your API Token was successfully created.',
        });
        setTab(TabState.SUCCESS);
        setCreatedAPIKey(data.token);
      },
      onError: () => {
        errorToast({
          title: 'Error on create API Token',
          description: 'An error occurred while creating the API Token.',
        });
      },
    });
  });

  return {
    form: {
      ...form,
      submit: handleSubmit,
    },
    request: {
      mutate,
      isLoading,
      isError,
    },
    createdAPIKey: {
      value: createdAPIKey,
      set: setCreatedAPIKey,
    },
  };
};

export { useCreateAPIToken };
