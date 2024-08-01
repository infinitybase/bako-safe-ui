import { useAuth, useAuthActions } from '@/modules/auth';
import { useWorkspace } from '../useWorkspace';
import { useAddressBook } from '@/modules';

const useWorkspaceDetails = () => {
  const authActions = useAuthActions();
  const authDetails = useAuth(authActions);
  const workspaceInfos = useWorkspace(authDetails);
  const addressBookInfos = useAddressBook(
    authDetails,
    workspaceInfos.hasPermission,
  );

  return {
    authDetails,
    workspaceInfos,
    addressBookInfos,
  };
};

export { useWorkspaceDetails };
