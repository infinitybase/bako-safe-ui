import { WorkspaceService } from '@bako-safe/services/modules/workspace';
import { useMutation } from '@tanstack/react-query';

const useCreateWorkspaceRequest = () => {
  return useMutation({
    mutationKey: ['create-workspace'],
    mutationFn: WorkspaceService.create,
  });
};

export { useCreateWorkspaceRequest };
