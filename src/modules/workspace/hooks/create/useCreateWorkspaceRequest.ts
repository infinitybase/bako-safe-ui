import { useMutation } from 'react-query';

import { WorkspaceService } from '../../services';

const useCreateWorkspaceRequest = () => {
  return useMutation('create-workspace', WorkspaceService.create);
};

export { useCreateWorkspaceRequest };
