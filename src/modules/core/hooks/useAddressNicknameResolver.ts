import { useCallback } from 'react';

import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const useAddressNicknameResolver = () => {
  const {
    addressBookInfos: {
      handlers: { contactByAddress },
    },
    offChainSync: {
      handlers: { getHandleFromResolver, getResolverFromHandle },
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
    (address: string, handle?: string, resolver?: string) => {
      const contact = contactByAddress(address)?.nickname;
      const resolverFromHandle = handle ? getResolverFromHandle(handle) : null;

      const isValidHandle =
        !!resolverFromHandle && resolverFromHandle === resolver;
      const primaryHandle = getHandleFromResolver(address);

      return {
        contact,
        handle: isValidHandle ? handle : primaryHandle,
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
