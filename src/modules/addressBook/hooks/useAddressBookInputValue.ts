import { useState } from 'react';

import { AutocompleteOption } from '@/components/autocomplete';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import { AddressBookUtils } from '@/utils/address-book';

const useAddressBookInputValue = () => {
  const [formField, setFormField] = useState({
    value: '',
    label: '',
  });

  const {
    offChainSync: {
      handlers: { getHandleFromResolver, getResolverFromHandle },
    },
  } = useWorkspaceContext();

  const setInputValue = (value: string): AutocompleteOption => {
    const resolver = getResolverFromHandle(value);

    if (resolver) {
      const initialValue = resolver;
      const label = AddressBookUtils.formatForAutocomplete(value, resolver);
      setFormField({
        value: initialValue,
        label,
      });
      return {
        value: initialValue,
        label,
      };
    }

    const handle = getHandleFromResolver(value);

    if (handle && !formField.label.length) {
      return {
        value,
        label: AddressBookUtils.formatForAutocomplete(handle, value),
      };
    }

    if (formField.label.length && formField.value.length) {
      return { ...formField };
    }

    return { value, label: value };
  };

  return {
    setInputValue,
  };
};

export { useAddressBookInputValue };
