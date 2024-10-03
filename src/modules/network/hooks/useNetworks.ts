import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { DeleteNetworkPayload, NetworkType } from '../services';
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

export type NetworkFormFields = { name: string; url: string };

const useNetworks = (onClose?: () => void) => {
  const [mode, setMode] = useState<NetworkDrawerMode>(NetworkDrawerMode.SELECT);
  const [validNetwork, setValidNetwork] = useState(false);
  const networkForm = useForm<NetworkFormFields>();

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
        onSuccess: () => {
          setMode(NetworkDrawerMode.SELECT);
          onClose?.();
          setValidNetwork(false);
          refetchNetworks();
        },
      },
    );

    networkForm.reset();
  });

  const handleDeleteCustomNetwork = ({ url }: DeleteNetworkPayload) => {
    deleteNetworkRequest.mutate(
      { url },
      {
        onSuccess: () => {
          setMode(NetworkDrawerMode.SELECT);
          refetchNetworks();
        },
      },
    );
  };

  const handleSelectNetwork = async (url: string) => {
    if (url === currentNetwork.url) {
      handleClose();
      return;
    }

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
        message: 'Network already exists.',
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
    chainId: import.meta.env.CHAIN_ID,
  };

  const checkNetwork = (type: NetworkType) =>
    currentNetwork?.url?.includes(type);

  const handleClose = () => {
    setMode(NetworkDrawerMode.SELECT);
    setValidNetwork(false);
    onClose?.();
  };

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
