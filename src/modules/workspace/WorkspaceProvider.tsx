import { createContext, useContext } from 'react';

import { BakoLoading } from '@/components';

import { useWorkspaceDetails } from './hooks/details/useWorkspaceDetails';

export type IWorkspaceContext = ReturnType<typeof useWorkspaceDetails>;

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

// TODO: Check eslint warning about exportting useWorkspaceContext
export { useWorkspaceContext, WorkspaceProvider };
