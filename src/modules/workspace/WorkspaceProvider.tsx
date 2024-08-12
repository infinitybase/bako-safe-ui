import { createContext, useContext } from 'react';
import { UseAddressBookReturn, UseWorkspaceReturn } from '..';
import { useWorkspaceDetails } from './hooks/details/useWorkspaceDetails';
import { IUseAuthReturn } from '../auth/services';
import { BakoLoading } from '@/components';
import { IuseTokensUSDAmountRequestReturn } from '../home/hooks/useTokensUSDAmountRequest';

export interface IWorkspaceContext {
  authDetails: IUseAuthReturn;
  workspaceInfos: UseWorkspaceReturn;
  addressBookInfos: UseAddressBookReturn;
  tokensUSD: IuseTokensUSDAmountRequestReturn;
}

const WorkspaceContext = createContext<IWorkspaceContext | null>(null);

const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
  const workspaceDetails = useWorkspaceDetails();

  return (
    <WorkspaceContext.Provider value={workspaceDetails}>
      {workspaceDetails.isWorkspaceReady ? children : <BakoLoading />}
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
