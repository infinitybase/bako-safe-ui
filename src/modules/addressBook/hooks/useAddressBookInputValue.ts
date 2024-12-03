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
    const formattedValue = value.startsWith('@') ? value.toLowerCase() : value;
    const resolver = getResolverFromHandle(formattedValue);

    if (!resolver && value.startsWith('@')) {
      return {
        value,
        label,
      };
    }

    if (resolver) {
      const initialValue = resolver;
      const label = AddressBookUtils.formatForAutocomplete(
        formattedValue,
        resolver,
      );
      setFormField({
        value: initialValue,
        label,
      });
      return {
        value: initialValue,
        label,
      };
    }

    const handle = getHandleFromResolver(formattedValue);

    if (handle && !formField.label.length) {
      return {
        value: formattedValue,
        label: AddressBookUtils.formatForAutocomplete(handle, formattedValue),
      };
    }

    if (formField.label.length && formField.value.length) {
      return { ...formField };
    }

    return { value: formattedValue, label: formattedValue };
  };

  return {
    setInputValue,
  };
};

export { useAddressBookInputValue };
