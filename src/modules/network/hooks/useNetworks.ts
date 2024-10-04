import { Provider } from 'fuels';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { localStorageKeys } from '@/modules/auth/services';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import {
  CustomNetwork,
  DeleteNetworkPayload,
  NetworkService,
  NetworkType,
} from '../services';
import { useCheckNetworkRequest } from './useCheckNetworkRequest';
import { useCreateNetworkRequest } from './useCreateNetworkRequest';
import { useDeleteNetworkRequest } from './useDeleteNetworkRequest';
import { useListNetworksRequest } from './useListNetworksRequest';
import { useSelectNetworkRequest } from './useSelectNetworkRequest';

export enum NetworkDrawerMode {
  SELECT = 'select',
  ADD = 'add',
  CONFIRM = 'confirm',
}

export type NetworkFormFields = {
  name: string;
  url: string;
};

const formDefaultValues = {
  name: '',
  url: '',
};

const useNetworks = (onClose?: () => void) => {
  const [mode, setMode] = useState<NetworkDrawerMode>(NetworkDrawerMode.SELECT);
  const [validNetwork, setValidNetwork] = useState(false);
  const networkForm = useForm<NetworkFormFields>({
    defaultValues: formDefaultValues,
  });

  const checkNetworkRequest = useCheckNetworkRequest();
  const { data: networks, refetch: refetchNetworks } = useListNetworksRequest();
  const selectNetworkRequest = useSelectNetworkRequest();
  const createNetworkRequest = useCreateNetworkRequest();
  const deleteNetworkRequest = useDeleteNetworkRequest();

  const {
    authDetails: {
      userInfos: { network: userNetwork },
    },
    resetHomeRequests,
  } = useWorkspaceContext();

  const saveNetwork = async (url: string) => {
    const exists = JSON.parse(
      localStorage.getItem(localStorageKeys.NETWORKS) ?? '[]',
    ).find((net: CustomNetwork) => net.url === url);

    if (!exists) {
      const provider = await Provider.create(url!);
      const name = provider.getChain()?.name;
      const chainId = provider.getChainId();

      NetworkService.create({
        name,
        url: url!,
        chainId,
        identifier: NetworkType.LOCALSTORAGE,
      });
    }

    refetchNetworks();
  };

  const handleAddNetwork = networkForm.handleSubmit((data) => {
    if (!data.url) {
      networkForm.setError('url', {
        type: 'required',
        message: 'Url is required.',
      });

      return;
    }

    createNetworkRequest.mutate(
      { ...data, identifier: NetworkType.LOCALSTORAGE, chainId: 0 },
      {
        onSuccess: async () => {
          setMode(NetworkDrawerMode.SELECT);
          onClose?.();
          setValidNetwork(false);
          refetchNetworks();
          handleSelectNetwork(data.url);
        },
      },
    );

    networkForm.reset(formDefaultValues);
  });

  const handleDeleteCustomNetwork = ({ url }: DeleteNetworkPayload) => {
    deleteNetworkRequest.mutate(
      { url },
      {
        onSuccess: () => {
          setMode(NetworkDrawerMode.SELECT);
          refetchNetworks();
          handleSelectNetwork();
        },
      },
    );
  };

  const handleSelectNetwork = async (url?: string) => {
    if (url === currentNetwork.url) {
      handleClose();
      return;
    }

    saveNetwork(url!);

    selectNetworkRequest.mutate(
      { url },
      {
        onSuccess: () => {
          resetHomeRequests();
          handleClose();
        },
      },
    );
  };

  const handleCheckNetwork = async () => {
    const url = networkForm.watch('url');

    if (!url) {
      networkForm.setError('url', {
        type: 'required',
        message: 'Url is required',
      });
    }

    if (networks?.find((net) => net.url === url)) {
      networkForm.setError('url', {
        type: 'required',
        message: 'Network already saved.',
      });

      return;
    }

    checkNetworkRequest.mutate(
      { url },
      {
        onSuccess: (name) => {
          networkForm.setValue('name', name!);
          setValidNetwork(true);
        },
      },
    );
  };

  const currentNetwork = userNetwork ?? {
    url: import.meta.env.VITE_NETWORK,
    chainId: import.meta.env.VITE_CHAIN_ID,
  };

  const checkNetwork = (type: NetworkType) =>
    currentNetwork?.url?.includes(type);

  const handleClose = () => {
    setMode(NetworkDrawerMode.SELECT);
    setValidNetwork(false);
    networkForm.reset();
    onClose?.();
  };

  useEffect(() => {
    saveNetwork(currentNetwork.url);

    localStorage.setItem(
      localStorageKeys.CHAIN_ID,
      JSON.stringify(currentNetwork.chainId),
    );
  }, [currentNetwork]);

  return {
    currentNetwork,
    checkNetworkRequest,
    validNetwork,
    networkForm,
    mode,
    networks,
    selectNetworkRequest,
    checkNetwork,
    handleSelectNetwork,
    handleAddNetwork,
    handleDeleteCustomNetwork,
    handleCheckNetwork,
    handleClose,
    setMode,
  };
};

export { useNetworks };
