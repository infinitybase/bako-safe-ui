import { createContext, useContext } from 'react';
import { IUseAuthReturn } from '..';
import { useWorkspaceDetails } from './hooks/details/useWorkspaceDetails';

export type IWorkspaceContext = IUseAuthReturn | null;

const WorkspaceContext = createContext<IWorkspaceContext>(null);

const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
  const { authDetails } = useWorkspaceDetails();

  return (
    <WorkspaceContext.Provider value={authDetails}>
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
