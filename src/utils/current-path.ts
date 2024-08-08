import { useLocation } from 'react-router-dom';

const currentPath = () => {
  const { pathname } = useLocation();

  const isSignInpage = pathname === '/';

  return {
    isSignInpage,
  };
};

export { currentPath };
