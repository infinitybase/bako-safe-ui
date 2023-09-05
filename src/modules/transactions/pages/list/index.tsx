import { useParams } from 'react-router-dom';

const TransactionsVaultPage = () => {
  const params = useParams<{ id: string }>();
  return <>{params.id}</>;
};

export { TransactionsVaultPage };
