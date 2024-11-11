import { useCallback } from 'react';

import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const useAddressNicknameResolver = () => {
  const {
    addressBookInfos: {
      handlers: { contactByAddress },
    },
    offChainSync: {
      handlers: { getHandleFromResolver },
    },
  } = useWorkspaceContext();

  const resolveContactOrHandle = useCallback(
    (address: string) => {
      const contact = contactByAddress(address)?.nickname;
      if (contact) return contact;

      const handle = getHandleFromResolver(address);
      return handle;
    },
    [contactByAddress, getHandleFromResolver],
  );

  const resolveAddressContactHandle = useCallback(
    (address: string) => {
      const contact = contactByAddress(address)?.nickname;
      const handle = getHandleFromResolver(address);

      return {
        address,
        contact,
        handle,
      };
    },
    [contactByAddress, getHandleFromResolver],
  );

  return {
    resolveContactOrHandle,
    resolveAddressContactHandle,
  };
};

export { useAddressNicknameResolver };
