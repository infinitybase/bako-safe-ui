import { useNavigate } from 'react-router-dom';

import { CreateVaultDialog } from '@/modules/vault/components';

const CreateVaultPage = () => {
  const navigate = useNavigate();

  const handleClose = () => navigate(-1);

  return <CreateVaultDialog onClose={handleClose} isOpen />;
};

export { CreateVaultPage };
