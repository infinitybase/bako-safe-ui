import { ListContactsResponse } from '@services/modules/address-book';

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
