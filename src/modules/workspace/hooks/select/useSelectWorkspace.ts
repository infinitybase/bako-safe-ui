import { useMutation, UseMutationOptions } from 'react-query';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { Workspace, WorkspacesQueryKey } from '@/modules/core/models/workspace';

import { SelectWorkspaceResponse, WorkspaceService } from '../../services';

const { WORKSPACE, PERMISSIONS, USER_ID } = CookieName;

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

  const selectWorkspace = (
    workspace: Workspace,
    options: UseSelectWorkspaceOptions,
  ) => {
    const user = CookiesConfig.getCookie(USER_ID)!;

    CookiesConfig.setCookies([
      {
        name: WORKSPACE,
        value: JSON.stringify(workspace),
      },
      {
        name: PERMISSIONS,
        value: JSON.stringify(workspace.permissions[user]),
      },
    ]);

    mutate(
      {
        workspace: workspace.id,
        user: CookiesConfig.getCookie(USER_ID)!,
      },
      {
        onSuccess: ({ workspace }) => options.onSelect(workspace),
        onError: options.onError,
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
