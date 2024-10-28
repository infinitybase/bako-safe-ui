import { ListContactsResponse } from '@bako-safe/services/services/address-book';

const useGetContactByAddress = (
  address: string,
  contactList?: ListContactsResponse,
) => {
  const savedContact = contactList?.find(
    (contact) => contact.user.address === address,
  );

  return { savedContact };
};

export { useGetContactByAddress };
