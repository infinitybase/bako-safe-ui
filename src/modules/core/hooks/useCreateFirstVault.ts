import { Pages, useCreateBakoSafeVault } from '@/modules';
import { useUpdateSettingsRequest } from '@/modules/settings/hooks';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import { Address } from 'fuels';

const useCreateFirstVault = (workspaceId: string) => {
  const updateUserMutation = useUpdateSettingsRequest();
  const {
    workspaceInfos: {
      handlers: { handleWorkspaceSelection },
    },
  } = useWorkspaceContext();

  const bakoSafeVault = useCreateBakoSafeVault({
    onSuccess: (data) => {
      handleWorkspaceSelection(
        workspaceId,
        Pages.detailsVault({
          vaultId: data.BakoSafeVaultId,
          workspaceId: workspaceId ?? '',
        }),
      );
    },
    onError: () => {
      console.log('Error while creating the first users vault');
    },
  });

  const handleCreateFirstVault = (
    address: string,
    userId: string,
    isFromWebAuthn?: boolean,
    userName?: string,
  ) => {
    updateUserMutation.mutate({
      id: userId,
      first_login: false,
    });

    const userAddress = Address.fromString(address).bech32Address;

    bakoSafeVault.create({
      name: isFromWebAuthn ? `${userName} Vault` : 'Personal Vault ',
      description: 'Pegar com Fábio',
      minSigners: 1,
      addresses: [userAddress],
    });
  };

  return {
    handleCreateFirstVault,
  };
};
export { useCreateFirstVault };
