import { Address } from 'fuels';
import { useCallback } from 'react';

import { useBakoIDResolveNames } from '@/modules/core/hooks/bako-id';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

const useAddressNicknameResolver = (members: string[] = []) => {
  const {
    addressBookInfos: {
      handlers: { contactByAddress },
    },
    providerInstance,
  } = useWorkspaceContext();

  const { data: handles = [], isLoading } = useBakoIDResolveNames({
    addresses: members.filter((m) => !!m).map((m) => m),
    provider: providerInstance,
  });

  const getResolverName = useCallback(
    (address: string) => {
      const handle = handles.find(
        (h) => h.resolver === Address.fromString(address).toB256(),
      );
      return handle?.name;
    },
    [handles],
  );

  const getHandleFromResolver = useCallback(
    (name: string) => {
      const handle = handles.find((h) => h.name === name.replace('@', ''));
      return handle?.resolver;
    },
    [handles],
  );

  const resolveContactOrHandle = useCallback(
    (address: string) => {
      const contact = contactByAddress(address)?.nickname;
      if (contact) return contact;

      const handle = getResolverName(address);
      return handle;
    },
    [contactByAddress, getResolverName],
  );

  const resolveAddressContactHandle = useCallback(
    (address: string, handle?: string, resolver?: string) => {
      const contact = contactByAddress(address)?.nickname;
      const resolverFromHandle = getHandleFromResolver(handle ?? '');

      const isValidHandle =
        !!resolverFromHandle && resolverFromHandle === resolver;
      const primaryHandle = getResolverName(address);

      return {
        contact,
        handle: isValidHandle ? handle : primaryHandle,
      };
    },
    [contactByAddress, getResolverName],
  );

  return {
    resolveContactOrHandle,
    resolveAddressContactHandle,
    isLoading,
  };
};

export { useAddressNicknameResolver };
