import { useCreateWorkspaceForm } from './useCreateWorkspaceForm';
import { useCreateWorkspaceRequest } from './useCreateWorkspaceRequest';

export type UseCreateWorkspace = ReturnType<typeof useCreateWorkspace>;

const useCreateWorkspace = () => {
  const form = useCreateWorkspaceForm();
  const request = useCreateWorkspaceRequest();

  return {
    form,
    request,
  };
};

export { useCreateWorkspace };
