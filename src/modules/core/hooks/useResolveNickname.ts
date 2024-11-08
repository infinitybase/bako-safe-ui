import { useCallback } from 'react';

import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const useResolveNickname = () => {
  const {
    addressBookInfos: {
      handlers: { contactByAddress },
    },
    offChainSync: {
      handlers: { getHandleFromResolver },
    },
  } = useWorkspaceContext();

  const resolveNickname = useCallback(
    (address: string) => {
      const contact = contactByAddress(address)?.nickname;
      const handle = getHandleFromResolver(address);

      return contact ?? handle ?? undefined;
    },
    [contactByAddress, getHandleFromResolver],
  );

  return {
    resolveNickname,
  };
};

export { useResolveNickname };
