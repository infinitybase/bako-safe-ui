import { IUseAuthDetails } from '@bako-safe/services';
import { createContext, useContext } from 'react';

import { useAuth } from '..';

const AuthContext = createContext<IUseAuthDetails | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
export default AuthProvider;

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }

  return context;
};

export { AuthProvider, useAuthContext };
