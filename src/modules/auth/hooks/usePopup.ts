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
    const url = searchParams.get('url');

    console.log({ sessionId, address, isNew, name, url });

    return { sessionId, address, isNew, name, url };
  }, [location]);

  return { ...queryParams, location };
};

export { useQueryParams };
