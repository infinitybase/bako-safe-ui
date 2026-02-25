import { useQueryClient } from '@tanstack/react-query';
import { Provider } from 'fuels';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

import { useAuth } from '@/modules';
import { LATEST_INFO_QUERY_KEY } from '@/modules/auth/hooks/useUserInfoRequest';
import { localStorageKeys } from '@/modules/auth/services';
import { invalidateQueriesOnNetworkSwitch } from '@/modules/core/utils/react-query';

import NetworkSwitchContext from '../providers/NetworkSwitchProvider';

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

  const networkSwitchContext = useContext(NetworkSwitchContext);
  const queryClient = useQueryClient();
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
      // Only refetch if we actually created a new network
      refetchNetworks();
    }
    // Skip refetch if network already exists - no changes to list
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

    // Close drawer immediately for better UX
    handleClose();

    // Start network switch loading state
    networkSwitchContext?.startNetworkSwitch();

    // Save network in background (only creates Provider if network doesn't exist)
    saveNetwork(url!);

    selectNetworkRequest.mutate(
      { url },
      {
        onSuccess: (response) => {
          // Update userInfos.network with the response from API
          // This is more reliable than optimistic update since API returns the actual network
          if (response?.network) {
            queryClient.setQueryData(LATEST_INFO_QUERY_KEY, (oldData: unknown) => {
              if (!oldData || typeof oldData !== 'object') return oldData;
              return {
                ...oldData,
                network: response.network,
              };
            });
          }

          // Smart invalidation: preserves immutable data (assets, Bako ID, etc.)
          // while invalidating network-dependent queries
          invalidateQueriesOnNetworkSwitch().then(() => {
            // Finish network switch loading state after queries are invalidated
            // Small delay to allow React Query to start fetching
            setTimeout(() => {
              networkSwitchContext?.finishNetworkSwitch();
            }, 500);
          });
        },
        onError: () => {
          // Finish network switch loading state on error
          networkSwitchContext?.finishNetworkSwitch();
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
    // Only update localStorage, saveNetwork is called when needed
    localStorage.setItem(
      localStorageKeys.SELECTED_CHAIN_ID,
      JSON.stringify(currentNetwork.chainId),
    );
  }, [currentNetwork.chainId]);

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
