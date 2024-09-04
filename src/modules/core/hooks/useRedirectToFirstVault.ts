import { Pages } from '@/modules';
import { useUpdateSettingsRequest } from '@/modules/settings/hooks';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const useRedirectToFirstVault = () => {
  const updateUserMutation = useUpdateSettingsRequest();
  const {
    workspaceInfos: {
      handlers: { handleWorkspaceSelection },
    },
  } = useWorkspaceContext();

  const handleRedirectToFirstVault = (
    vaultId: string,
    workspaceId: string,
    userId: string,
  ) => {
    updateUserMutation.mutate({
      id: userId,
      first_login: false,
    });

    handleWorkspaceSelection(
      workspaceId,
      Pages.detailsVault({
        vaultId: vaultId ?? '',
        workspaceId: workspaceId ?? '',
      }),
    );
  };

  return {
    handleRedirectToFirstVault,
  };
};
export { useRedirectToFirstVault };
