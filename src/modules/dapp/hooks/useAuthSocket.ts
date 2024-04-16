import { useState } from 'react';

import { useQueryParams } from '@/modules/auth/hooks';

import { useCreateConnections } from './useCreateConnection';
import { useGetCurrentVaultRequest } from './useGetCurrentVaultRequest';

export interface AuthSocketEvent {
  sessionId: string;
  address: string;
}

export const useAuthSocket = () => {
  const { sessionId } = useQueryParams();
  const [selectedVaultId, setSelectedVaultId] = useState('');

  const getCurrentVaultRequest = useGetCurrentVaultRequest(sessionId!);

  const createConnectionsMutation = useCreateConnections();

  return {
    selectedVaultId,
    setSelectedVaultId,
    currentVault: getCurrentVaultRequest?.data,
    send: createConnectionsMutation,
  };
};
