import { useMutation } from '@tanstack/react-query';

import { workspaceService } from '@/modules/services/services-initializer';

const useCreateWorkspaceRequest = () => {
  return useMutation({
    mutationKey: ['create-workspace'],
    mutationFn: workspaceService.create,
  });
};

export { useCreateWorkspaceRequest };
