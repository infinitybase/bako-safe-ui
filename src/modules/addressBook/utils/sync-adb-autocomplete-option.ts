import { isValidDomain, OffChainSync } from '@bako-id/sdk';

import { AutocompleteOption } from '@/components/autocomplete';
import { AddressUtils } from '@/modules/core/utils/address';
import { Maybe } from '@/modules/core/utils/types';
import { AddressBookUtils } from '@/utils/address-book';

export const syncAddressBookAutocompleteOption = (
  value: string,
  sync?: OffChainSync,
): Maybe<AutocompleteOption> => {
  if (!sync) return null;

  if (value.startsWith('@') && isValidDomain(value)) {
    const resolver = sync?.getResolver(value.slice(1));

    if (resolver) {
      return {
        value: resolver,
        label: AddressBookUtils.formatForAutocomplete(value, resolver),
      };
    }

    return null;
  }

  if (AddressUtils.isValid(value)) {
    const domain = sync?.getDomain(value);

    if (domain) {
      return {
        value,
        label: AddressBookUtils.formatForAutocomplete(`@${domain}`, value),
      };
    }

    return null;
  }

  return null;
};
