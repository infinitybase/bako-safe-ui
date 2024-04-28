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
  LIST_BY_USER: (workspaceId: string) => [
    AddressBookQueryKey.DEFAULT,
    'by-user',
    workspaceId,
  ],
  LIST_BY_USER_PAGINATED: (
    workspaceId: string,
    filter: string,
    contactIds: string,
    includePersonal: boolean,
    excludeContacts?: string,
  ) => [
    AddressBookQueryKey.DEFAULT,
    'by-user',
    'paginated',
    workspaceId,
    filter,
    contactIds,
    includePersonal,
    excludeContacts,
  ],
  FULL_DATA: (workspaceId: string) => [
    AddressBookQueryKey.DEFAULT,
    AddressBookQueryKey.LIST_BY_USER(workspaceId),
  ],
};
