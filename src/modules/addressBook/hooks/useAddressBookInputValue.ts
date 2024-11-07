import { AutocompleteOption } from '@/components/autocomplete';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import { AddressBookUtils } from '@/utils/address-book';

const useAddressBookInputValue = () => {
  const {
    offChainSync: {
      handlers: { getHandleFromResolver, getResolverFromHandle },
    },
  } = useWorkspaceContext();

  const setInputValue = (value: string): AutocompleteOption => {
    const resolver = getResolverFromHandle(value);

    if (resolver) {
      return {
        value: resolver,
        label: AddressBookUtils.formatForAutocomplete(value, resolver),
      };
    }

    const handle = getHandleFromResolver(value);

    if (handle) {
      return {
        value,
        label: AddressBookUtils.formatForAutocomplete(handle, value),
      };
    }

    return { value, label: value };
  };

  return {
    setInputValue,
  };
};

export { useAddressBookInputValue };
