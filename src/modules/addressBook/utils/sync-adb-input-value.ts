import { OffChainSync } from '@bako-id/sdk';

import { AutocompleteOption } from '@/components/autocomplete';
import {
  getHandleFromResolver,
  getResolverFromHandle,
} from '@/modules/core/utils/handles';
import { AddressBookUtils } from '@/utils/address-book';

export const syncAddressBookInputValue = (
  value: string,
  sync?: OffChainSync,
): AutocompleteOption => {
  const result = { value, label: value };

  if (!sync) return result;

  const resolver = getResolverFromHandle(sync, value);

  if (resolver) {
    return {
      value: resolver,
      label: AddressBookUtils.formatForAutocomplete(value, resolver),
    };
  }

  const handle = getHandleFromResolver(sync, value);

  if (handle) {
    return {
      value,
      label: AddressBookUtils.formatForAutocomplete(`@${handle}`, value),
    };
  }

  return result;
};
