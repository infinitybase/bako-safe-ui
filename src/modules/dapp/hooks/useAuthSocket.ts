import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useQueryParams } from '@/modules/auth/hooks';
import { Pages } from '@/modules/core/routes';

import { useWorkspaceContext } from '@/modules/workspace/hooks';
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
    authDetails: { userInfos },
  } = useWorkspaceContext();

  const [selectedVaultId, setSelectedVaultId] = useState('');

  const getCurrentVaultRequest = useGetCurrentVaultRequest(sessionId!);

  const createConnectionsMutation = useCreateConnections();
  const makeLinkCreateVault = () => {
    navigate(
      `${Pages.createVault({ workspaceId: userInfos.workspace?.id })}${location.search}`,
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
