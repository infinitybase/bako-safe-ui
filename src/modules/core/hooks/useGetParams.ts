import { useParams } from 'react-router-dom';

export const useGetParams = () => {
  const params = useParams();
  
  return {
    vaultPageParams: {
      vaultId: params.vaultId || '',
    },
  };
};