import { useMutation, UseMutationOptions } from 'react-query';

import { WorkspacesQueryKey } from '@/modules/core/models/workspace';

import { SelectWorkspaceResponse, WorkspaceService } from '../services';

const useSelectWorkspaceRequest = (
  options?: UseMutationOptions<SelectWorkspaceResponse, unknown, unknown>,
) => {
  return useMutation(
    WorkspacesQueryKey.SELECT(),
    WorkspaceService.select,
    options,
  );
};

export { useSelectWorkspaceRequest };
