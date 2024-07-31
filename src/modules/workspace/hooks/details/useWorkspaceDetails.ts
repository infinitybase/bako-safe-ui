import { useAuth, useAuthActions } from '@/modules/auth';
import { useWorkspace } from '../useWorkspace';

const useWorkspaceDetails = () => {
  const authActions = useAuthActions();
  const authDetails = useAuth(authActions);
  const workspaceInfos = useWorkspace(authDetails);

  return {
    authDetails,
    workspaceInfos,
  };
};

export { useWorkspaceDetails };
