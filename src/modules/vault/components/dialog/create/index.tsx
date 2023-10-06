import { ModalProps } from '@chakra-ui/react';

import { useCreateVault } from '@/modules';

import { Dialog } from './dialog';
import { CreateVaultForm } from './form';

export type CreateVaultDialogProps = Omit<ModalProps, 'children'>;

const CreateVaultDialog = (props: CreateVaultDialogProps) => {
  const { tabs, form, addresses } = useCreateVault();

  return (
    <Dialog {...props}>
      <CreateVaultForm
        tabs={tabs}
        form={form}
        addresses={addresses}
        onCancel={props.onClose}
      />
    </Dialog>
  );
};

export { CreateVaultDialog };
