import { useAuth, useAuthActions } from '@/modules/auth';

const useWorkspaceDetails = () => {
  const authActions = useAuthActions();
  const authDetails = useAuth(authActions);

  return {
    authDetails,
  };
};

export { useWorkspaceDetails };
