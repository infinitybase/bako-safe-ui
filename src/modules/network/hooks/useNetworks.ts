import { Provider } from 'fuels';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

import { useAuth } from '@/modules';
import { localStorageKeys } from '@/modules/auth/services';
import { invalidateQueriesOnNetworkSwitch } from '@/modules/core/utils/react-query';

import {
  availableNetWorks,
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

  const { search } = useLocation();
  const fromConnector = !!new URLSearchParams(search).get('sessionId');

  const checkNetworkRequest = useCheckNetworkRequest();
  const { data: networks, refetch: refetchNetworks } = useListNetworksRequest();
  const selectNetworkRequest = useSelectNetworkRequest();
  const createNetworkRequest = useCreateNetworkRequest();
  const deleteNetworkRequest = useDeleteNetworkRequest();

  const {
    userInfos: { network: userNetwork },
  } = useAuth();

  const saveNetwork = async (url: string) => {
    const exists = NetworkService.hasNetwork(url);
    if (!exists) {
      const provider = new Provider(url!);
      const { name } = await provider.getChain();
      const chainId = await provider.getChainId();
      await NetworkService.create({
        name,
        url: url!,
        chainId,
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
      { ...data, chainId: 0 },
      {
        onSuccess: async () => {
          setMode(NetworkDrawerMode.SELECT);
          await handleSelectNetwork(data.url);
          setValidNetwork(false);
          refetchNetworks();
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
          // Smart invalidation: preserves immutable data (assets, Bako ID, etc.)
          // while invalidating network-dependent queries
          invalidateQueriesOnNetworkSwitch();
          handleClose();
        },
      },
    );
  };

  const handleCheckNetwork = async () => {
    const url = networkForm.watch('url');
    const existingNetwork = NetworkService.hasNetwork(url);

    if (!url) {
      networkForm.setError('url', {
        type: 'required',
        message: 'Url is required',
      });
    }

    if (existingNetwork) {
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

  const currentNetwork = userNetwork ?? availableNetWorks[NetworkType.MAINNET];

  const checkNetwork = (type: NetworkType) =>
    currentNetwork?.url?.includes(type);

  const handleClose = () => {
    setMode(NetworkDrawerMode.SELECT);
    setValidNetwork(false);
    networkForm.reset();
    onClose?.();
  };

  const handleSelection = (network: CustomNetwork) => {
    localStorage.setItem(localStorageKeys.SELECTED_NETWORK, network.url);
    onClose?.();
  };

  useEffect(() => {
    saveNetwork(currentNetwork.url);

    localStorage.setItem(
      localStorageKeys.SELECTED_CHAIN_ID,
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
    fromConnector,
    setValidNetwork,
    checkNetwork,
    handleSelectNetwork,
    handleAddNetwork,
    handleDeleteCustomNetwork,
    handleCheckNetwork,
    handleClose,
    handleSelection,
    setMode,
  };
};

export { useNetworks };
