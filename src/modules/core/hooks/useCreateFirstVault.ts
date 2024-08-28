import { useCreateVault } from '@/modules';
import { useUpdateSettingsRequest } from '@/modules/settings/hooks';
import { Address } from 'fuels';

const useCreateFirstVault = (workspaceId: string) => {
  const updateUserMutation = useUpdateSettingsRequest();
  const { bakoSafeVault } = useCreateVault(true, workspaceId);

  const handleCreateFirstVault = (address: string, userId: string) => {
    updateUserMutation.mutate({
      id: userId,
      first_login: false,
    });

    const userAddress = Address.fromString(address).bech32Address;

    bakoSafeVault.create({
      name: 'Personal Vault ',
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
