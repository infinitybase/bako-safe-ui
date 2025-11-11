import { useState } from 'react';

import { AutocompleteOption } from '@/components/autocomplete';
import { useBakoIDClient } from '@/modules/core/hooks/bako-id';
import { useWorkspaceContext } from '@/modules/workspace/hooks';
import { AddressBookUtils } from '@/utils/address-book';

const useAddressBookInputValue = () => {
  const [formField, setFormField] = useState({
    value: '',
    label: '',
  });

  const { providerInstance } = useWorkspaceContext();
  const {
    handlers: { getResolverName, getResolverAddress },
  } = useBakoIDClient(providerInstance);

  const setInputValue = (value: string): AutocompleteOption => {
    const formattedValue = value?.startsWith('@') ? value.toLowerCase() : value;

    if (!formattedValue) {
      const formField = {
        value: '',
        label: '',
      };
      setFormField(formField);
      return formField;
    }

    if (formField.value === formattedValue) return formField;

    const resolver = getResolverAddress(formattedValue);

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

    const handle = getResolverName(formattedValue);

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
