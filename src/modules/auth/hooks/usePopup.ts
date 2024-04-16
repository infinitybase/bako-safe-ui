import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const useQueryParams = () => {
  const location = useLocation();

  const queryParams = useMemo(() => {
    console.log('location: ', location.search);
    const searchParams = new URLSearchParams(location.search);
    console.log('searchParams: ', searchParams);
    const sessionId = searchParams.get('sessionId');
    const address = searchParams.get('address');
    const isNew = searchParams.get('new');
    const name = searchParams.get('name');
    const origin = searchParams.get('origin');
    const currentVault = searchParams.get('currentVault');
    const openConnect = searchParams.get('openConnect') === 'true';

    return {
      sessionId,
      address,
      isNew,
      name,
      origin,
      currentVault,
      openConnect,
    };
  }, [location]);

  return { ...queryParams, location };
};

export { useQueryParams };
