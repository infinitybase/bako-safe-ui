import { useQuery } from 'react-query';

import { WorkspaceContact } from '@/modules/core';
import { AddressBookUtils } from '@/utils';

import { AddressBookService, GetPaginatedContactsParams } from '../services';

export const CONTACTS_PAGINATE_LIST_QUERY_KEY = 'contacts/pagination';

const useListPaginatedContactsRequest = (
  contacts: WorkspaceContact[],
  filter: GetPaginatedContactsParams,
) => {
  const { data, ...query } = useQuery(
    [CONTACTS_PAGINATE_LIST_QUERY_KEY, filter.q],
    () =>
      AddressBookService.search(
        {
          ...filter,
          perPage: 5,
        },
        contacts,
      ),
  );

  return {
    ...query,

    data: data?.map(({ nickname, user }) => {
      return {
        label: AddressBookUtils.formatForAutocomplete(nickname, user.address),
        value: user.address,
      };
    }),
  };
};

export { useListPaginatedContactsRequest };
