import { useQuery } from '@tanstack/react-query';

import { AddressBookQueryKey, WorkspaceContact } from '@/modules/core';
import { AddressBookUtils } from '@/utils';

import { AddressBookService, GetPaginatedContactsParams } from '../services';

//export const CONTACTS_PAGINATE_LIST_QUERY_KEY = 'contacts/pagination';

const useListPaginatedContactsRequest = (
  contacts: WorkspaceContact[],
  filter: GetPaginatedContactsParams,
  workspace: string,
  includePersonal: boolean,
) => {
  const contactIds = contacts.map((contact) => contact.id).join('-');

  const { data, ...query } = useQuery({
    queryKey: AddressBookQueryKey.LIST_BY_USER_PAGINATED(
      workspace,
      filter.q ?? '',
      contactIds,
      includePersonal,
    ),
    queryFn: () =>
      AddressBookService.search(
        {
          ...filter,
          perPage: 5,
        },
        contacts,
      ),
  });

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
