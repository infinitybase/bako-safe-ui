import { GetPaginatedContactsParams } from '@/modules/addressBook/services';

interface CreatedBy {
  id: string;
  address: string;
}

interface Contact {
  id: string;
  address: string;
  avatar: string;
}

export interface AddressBook {
  id: string;
  nickname: string;
  owner: CreatedBy;
  user: Contact;
}
export const AddressBookQueryKey = {
  DEFAULT: 'contacts',
  LIST_BY_USER: (workspaceId: string, vaultId?: string) => [
    AddressBookQueryKey.DEFAULT,
    workspaceId,
    'by-user',
    vaultId ?? workspaceId,
  ],
  LIST_BY_USER_PAGINATED: (
    workspaceId: string,
    filter: GetPaginatedContactsParams,
  ) => [AddressBookQueryKey.DEFAULT, workspaceId, 'by-user', filter],
  FULL_DATA: (workspaceId: string, vaultId?: string) => [
    AddressBookQueryKey.DEFAULT,
    AddressBookQueryKey.LIST_BY_USER(workspaceId, vaultId),
  ],
};
