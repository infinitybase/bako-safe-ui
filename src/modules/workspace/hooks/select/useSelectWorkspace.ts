import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { Workspace, WorkspacesQueryKey } from '@/modules/core/models/workspace';
import { SelectWorkspaceResponse, WorkspaceService } from '../../services';

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

const useSelectWorkspace = (userId: string) => {
  const { mutate, isPending, data, ...request } = useSelectWorkspaceRequest();

  const selectWorkspace = (
    workspace: string,
    options?: UseSelectWorkspaceOptions,
  ) => {
    mutate(
      {
        user: userId,
        workspace: workspace,
      },
      {
        onSuccess: ({ workspace }) => {
          options?.onSelect(workspace);
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
