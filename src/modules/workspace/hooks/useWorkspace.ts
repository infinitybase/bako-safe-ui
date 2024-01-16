import { useWorkspaceStore } from '../store';

export interface Workspace {
  id: string;
  name: string;
  avatar: string;
}

const useWorkspace = () => {
  const { currentWorkspace, setCurrentWorkspace } = useWorkspaceStore();

  return {
    currentWorkspace,
    setCurrentWorkspace,
  };
};

export { useWorkspace };
