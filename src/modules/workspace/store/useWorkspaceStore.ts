import { create } from 'zustand';

import { Nullable, Workspace } from '@/modules/core';

interface WorkspaceState {
  currentWorkspace: Nullable<Workspace>;
  setCurrentWorkspace: (workspace: Workspace) => void;
}

const useWorkspaceStore = create<WorkspaceState>((set) => ({
  currentWorkspace: null,
  setCurrentWorkspace: (currentWorkspace) => set({ currentWorkspace }),
}));

export { useWorkspaceStore };
