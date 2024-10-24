import { useMutation } from '@tanstack/react-query';

import { WorkspaceService } from '../../services';

const useCreateWorkspaceRequest = () => {
  return useMutation({
    mutationKey: ['create-workspace'],
    mutationFn: WorkspaceService.create,
  });
};

export { useCreateWorkspaceRequest };
