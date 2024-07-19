import { useLocation } from 'react-router-dom';

const useCurrentPathname = () => {
  const location = useLocation();
  return location.pathname;
};

export { useCurrentPathname };
