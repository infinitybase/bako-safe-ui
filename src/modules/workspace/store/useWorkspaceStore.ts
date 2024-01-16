import { create } from 'zustand';

import { Workspace } from '../hooks';

interface WorkspaceState {
  currentWorkspace: Workspace;
  setCurrentWorkspace: (workspace: Workspace) => void;
}

const useWorkspaceStore = create<WorkspaceState>((set) => ({
  currentWorkspace: {} as Workspace,
  setCurrentWorkspace: (currentWorkspace) => set({ currentWorkspace }),
}));

export { useWorkspaceStore };
