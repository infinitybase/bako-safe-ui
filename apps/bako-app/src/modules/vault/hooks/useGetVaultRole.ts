import { VaultRoles } from '@/modules/vault/utils/roles';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const useGetVaultRole = (vaultOwnerId: string) => {
  const {
    authDetails: { userInfos },
  } = useWorkspaceContext();

  const isOwner = userInfos.id === vaultOwnerId;
  const role = isOwner ? VaultRoles.OWNER : VaultRoles.SIGNER;

  return {
    role,
  };
};

export { useGetVaultRole };
