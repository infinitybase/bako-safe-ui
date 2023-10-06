import { useCreateVault } from '@/modules';

import { Dialog } from './dialog';
import { CreateVaultForm } from './form';

const CreateVaultDialog = () => {
  const { tabs, form, addresses } = useCreateVault();

  return (
    <Dialog isOpen={true} onClose={console.log}>
      <CreateVaultForm tabs={tabs} form={form} addresses={addresses} />
    </Dialog>
  );
};

export { CreateVaultDialog };
