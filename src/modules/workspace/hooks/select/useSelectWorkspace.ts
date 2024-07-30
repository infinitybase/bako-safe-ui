import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { Workspace, WorkspacesQueryKey } from '@/modules/core/models/workspace';
import { SelectWorkspaceResponse, WorkspaceService } from '../../services';
import { useWorkspaceContext } from '../../WorkspaceProvider';

const useSelectWorkspaceRequest = (
  options?: UseMutationOptions<SelectWorkspaceResponse, unknown, unknown>,
) => {
  return useMutation({
    mutationKey: WorkspacesQueryKey.SELECT(),
    mutationFn: WorkspaceService.select,
    ...options,
  });
};

interface UseSelectWorkspaceOptions {
  onSelect: (workspace: Workspace) => void;
  onError?: () => void;
}

const useSelectWorkspace = () => {
  const { mutate, isPending, data, ...request } = useSelectWorkspaceRequest();
  const auth = useWorkspaceContext();

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
    isSelecting: isPending,
    ...request,
  };
};

export { useSelectWorkspace, useSelectWorkspaceRequest };
