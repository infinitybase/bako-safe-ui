import { createContext, useContext } from 'react';

import { useWorkspaceDetails } from './hooks/details/useWorkspaceDetails';

export type IWorkspaceContext = ReturnType<typeof useWorkspaceDetails>;

const WorkspaceContext = createContext<IWorkspaceContext | null>(null);

const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
  const workspaceDetails = useWorkspaceDetails();

  return (
    <WorkspaceContext.Provider value={workspaceDetails}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export { WorkspaceProvider };

export default WorkspaceContext;
