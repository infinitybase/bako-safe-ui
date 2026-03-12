import { useNavigate } from 'react-router-dom';

import { CreateTransactionDialog } from '@/modules/transactions/components';

const CreateTransactionPage = () => {
  const navigate = useNavigate();

  const handleClose = () => navigate(-1);

  return (
    <CreateTransactionDialog
      onOpenChange={({ open }) => {
        if (!open) handleClose();
      }}
      open
    />
  );
};

export { CreateTransactionPage };
