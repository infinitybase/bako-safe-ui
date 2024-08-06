import { useAuth } from '@/modules/auth';
import { useWorkspace } from '../useWorkspace';
import { useAddressBook } from '@/modules';

const useWorkspaceDetails = () => {
  const authDetails = useAuth();
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
