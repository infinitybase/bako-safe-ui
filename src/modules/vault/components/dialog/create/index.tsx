import { ModalProps } from '@chakra-ui/react';
import { useCallback } from 'react';

import { TabState, useCreateVault } from '@/modules';

import { Dialog } from './dialog';
import { CreateVaultForm } from './form';

export type CreateVaultDialogProps = Omit<ModalProps, 'children'>;

const CreateVaultDialog = (props: CreateVaultDialogProps) => {
  const { tabs, form, addresses, onDeposit } = useCreateVault();

  const handleCancel = useCallback(() => {
    props.onClose();
    form.reset();
    tabs.set(TabState.INFO);
  }, [form, props, tabs]);

  return (
    <Dialog {...props} onClose={handleCancel}>
      <CreateVaultForm
        tabs={tabs}
        form={form}
        addresses={addresses}
        onCancel={handleCancel}
        onDeposit={onDeposit}
      />
    </Dialog>
  );
};

export { CreateVaultDialog };
