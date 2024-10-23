import { useSidebar } from '../details';
import { useGetParams } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import { useCLI } from '@/modules/cli/hooks';

const useVaultDetails = () => {
  const {
    vaultPageParams: { vaultId, workspaceId },
  } = useGetParams();

  const {
    vaultDetails: { vaultRequest, assets },
    authDetails: {
      userInfos: { address: account, id: userId },
    },
    workspaceInfos: {
      currentWorkspaceRequest: { currentWorkspace },
    },
  } = useWorkspaceContext();

  const {
    settings: CLISettings,
    hasPermission: hasCLIPermission,
    APIToken,
    commingSoonFeatures: { commingSoonDialog, selectedFeature },
  } = useCLI({
    vault: vaultRequest?.data,
    userId,
    currentWorkspace: currentWorkspace,
  });

  const sideBarDetails = useSidebar({
    params: { vaultId: vaultId ?? '', workspaceId: workspaceId ?? '' },
  });

  return {
    CLIInfos: {
      CLISettings,
      hasCLIPermission,
      APIToken,
      commingSoonFeatures: { commingSoonDialog, selectedFeature },
    },
    vault: {
      ...vaultRequest,
    },
    sideBarDetails,
    assets,
    account,
  };
};

export type UseVaultDetailsReturn = ReturnType<typeof useVaultDetails>;

export { useVaultDetails };
