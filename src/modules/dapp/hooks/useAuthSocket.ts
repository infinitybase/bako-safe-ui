import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth, useQueryParams } from '@/modules/auth/hooks';
import { Pages } from '@/modules/core/routes';

import { useCreateConnections } from './useCreateConnection';
import { useGetCurrentVaultRequest } from './useGetCurrentVaultRequest';

export interface AuthSocketEvent {
  sessionId: string;
  address: string;
}

export const useAuthSocket = () => {
  const { sessionId } = useQueryParams();
  const navigate = useNavigate();
  const {
    workspaces: { current },
  } = useAuth();

  const [selectedVaultId, setSelectedVaultId] = useState('');

  const getCurrentVaultRequest = useGetCurrentVaultRequest(sessionId!);

  const createConnectionsMutation = useCreateConnections();
  const makeLinkCreateVault = () => {
    navigate(
      `${Pages.createVault({ workspaceId: current })}${location.search}`,
    );
  };

  return {
    selectedVaultId,
    setSelectedVaultId,
    currentVault: getCurrentVaultRequest?.data,
    send: createConnectionsMutation,
    makeLinkCreateVault,
  };
};
