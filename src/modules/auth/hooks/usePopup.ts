import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const useQueryParams = () => {
  const location = useLocation();

  const queryParams = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get('sessionId');
    const address = searchParams.get('address');
    const isNew = searchParams.get('new');
    const name = searchParams.get('name');
    const origin = searchParams.get('origin');

    return { sessionId, address, isNew, name, origin };
  }, [location]);

  return { ...queryParams, location };
};

export { useQueryParams };
