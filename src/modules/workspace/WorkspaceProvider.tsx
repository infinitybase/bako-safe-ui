import { createContext, useContext } from 'react';
import { IUseAuthReturn, UseWorkspaceReturn } from '..';
import { useWorkspaceDetails } from './hooks/details/useWorkspaceDetails';

export interface IWorkspaceContext {
  authDetails: IUseAuthReturn;
  workspaceInfos: UseWorkspaceReturn;
}

const WorkspaceContext = createContext<IWorkspaceContext | null>(null);

const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
  const workspaceDetails = useWorkspaceDetails();

  return (
    <WorkspaceContext.Provider value={workspaceDetails}>
      {children}
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
