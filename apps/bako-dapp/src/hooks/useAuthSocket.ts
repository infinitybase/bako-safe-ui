import { useQueryParams } from '@app/modules/auth';
import { Pages } from '@app/modules/core';
import { useWorkspaceContext } from '@app/modules/workspace/WorkspaceProvider';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
