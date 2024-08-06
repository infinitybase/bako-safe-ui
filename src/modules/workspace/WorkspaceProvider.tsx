import { createContext, useContext, useEffect, useState } from 'react';
import { UseAddressBookReturn, UseWorkspaceReturn } from '..';
import { useWorkspaceDetails } from './hooks/details/useWorkspaceDetails';
import { IUseAuthReturn } from '../auth/services';
import { BakoLoading } from '@/components';

export interface IWorkspaceContext {
  authDetails: IUseAuthReturn;
  workspaceInfos: UseWorkspaceReturn;
  addressBookInfos: UseAddressBookReturn;
}

const WorkspaceContext = createContext<IWorkspaceContext | null>(null);

const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
  const workspaceDetails = useWorkspaceDetails();

  return (
    <WorkspaceContext.Provider value={workspaceDetails}>
      {workspaceDetails.isSignInpage ? (
        children
      ) : workspaceDetails.isWorkspaceReady ? (
        children
      ) : (
        <BakoLoading />
      )}
    </WorkspaceContext.Provider>
  );
};
export default WorkspaceProvider;

const useWorkspaceContext = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error(
      'useWorkspaceContext must be used within WorkspaceProvider',
    );
  }

  return context;
};

export { WorkspaceProvider, useWorkspaceContext };
