import { useMutation, UseMutationOptions } from 'react-query';

//import { CookieName } from '@/config/cookies';
import { useAuth } from '@/modules/auth/hooks';
import { Workspace, WorkspacesQueryKey } from '@/modules/core/models/workspace';

import { SelectWorkspaceResponse, WorkspaceService } from '../../services';

//const { WORKSPACE, PERMISSIONS, USER_ID } = CookieName;

const useSelectWorkspaceRequest = (
  options?: UseMutationOptions<SelectWorkspaceResponse, unknown, unknown>,
) => {
  return useMutation(
    WorkspacesQueryKey.SELECT(),
    WorkspaceService.select,
    options,
  );
};

interface UseSelectWorkspaceOptions {
  onSelect: (workspace: Workspace) => void;
  onError?: () => void;
}

const useSelectWorkspace = () => {
  const { mutate, isLoading, data, ...request } = useSelectWorkspaceRequest();
  const auth = useAuth();

  const selectWorkspace = (
    workspace: string,
    options?: UseSelectWorkspaceOptions,
  ) => {
    mutate(
      {
        user: auth.userId,
        workspace: workspace,
      },
      {
        onSuccess: ({ workspace }) => {
          options?.onSelect(workspace);
          auth.handlers.authenticateWorkspace({
            permissions: workspace.permissions,
            workspace: workspace.id,
          });
        },
        onError: options?.onError,
      },
    );
  };

  return {
    selectWorkspace,
    selectedWorkspace: data,
    isSelecting: isLoading,
    ...request,
  };
};

export { useSelectWorkspace, useSelectWorkspaceRequest };
