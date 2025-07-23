import { Provider } from 'fuels';
import { useMemo } from 'react';

import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

export const useProvider = () => {
  const {
    authDetails: { userInfos },
  } = useWorkspaceContext();

  return useMemo(() => {
    if (userInfos.network.url) {
      return new Provider(userInfos.network.url);
    }
  }, [userInfos.network.url]);
};
