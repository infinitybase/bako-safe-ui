export * from "./useCreateContactRequest";
export * from "./useDeleteContactRequest";
export * from "./useInfiniteListContactsRequest";

export const AddressBookQueryKey = {
  DEFAULT: "contacts",
  LIST_BY_USER: (workspaceId: string) => [
    AddressBookQueryKey.DEFAULT,
    "by-user",
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
    "by-user",
    "paginated",
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
