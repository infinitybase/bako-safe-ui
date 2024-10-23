import { createContext, useContext } from 'react';

import { BakoLoading } from '@ui/components';
import { currentPath } from '@/utils';

import { useWorkspaceDetails } from './hooks/details/useWorkspaceDetails';

export type IWorkspaceContext = ReturnType<typeof useWorkspaceDetails>;

const WorkspaceContext = createContext<IWorkspaceContext | null>(null);

const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
  const workspaceDetails = useWorkspaceDetails();
  const { isFromDapp } = currentPath();

  return (
    <WorkspaceContext.Provider value={workspaceDetails}>
      {workspaceDetails.isWorkspaceReady || isFromDapp ? (
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

export { useWorkspaceContext, WorkspaceProvider };
