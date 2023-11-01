import { useNavigate } from 'react-router-dom';

import { CreateContactDialog } from '../../components';

const CreateContactPage = () => {
  const navigate = useNavigate();
  const handleClose = () => navigate(-1);

  return <CreateContactDialog onClose={handleClose} isOpen />;
};

export { CreateContactPage };
