import { AddressBook, WorkspaceContact } from '@bako-safe/services';

import { AddressUtils } from '@/modules/core/utils/address';

export class AddressBookUtils {
  static formatForAutocomplete(nickname: string, address: string) {
    return `${nickname} - ${AddressUtils.format(address)}`;
  }

  static getNickname(
    member: { id: string; avatar: string; address: string; nickname: string },
    workspaceContacts?: WorkspaceContact,
    singleContact?: WorkspaceContact,
  ) {
    if (singleContact) {
      return singleContact.nickname;
    }

    if (workspaceContacts) {
      return workspaceContacts.nickname;
    }

    return member.address;
  }

  static removeDuplicates(addressBook: AddressBook[]) {
    return addressBook;
  }
}
