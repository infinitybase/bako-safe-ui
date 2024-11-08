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
      if (contact) return contact;

      const handle = getHandleFromResolver(address);
      return handle;
    },
    [contactByAddress, getHandleFromResolver],
  );

  return {
    resolveNickname,
  };
};

export { useResolveNickname };
