import { CookieName } from '@/config/cookies';
import { AddressBook } from '@/modules/core/models/addressBook';
import { WorkspaceContact } from '@/modules/core/models/workspace';
import { AddressUtils } from '@/modules/core/utils/address';

const { SINGLE_CONTACTS, SINGLE_WORKSPACE } = CookieName;

export class AddressBookUtils {
  static formatForAutocomplete(nickname: string, address: string) {
    return `${nickname} - ${AddressUtils.format(address)}`;
  }

  static getNickname(userId: string, workspaceContacts: WorkspaceContact[]) {
    const workspaceContact = workspaceContacts.find(
      ({ user }) => user.id === userId,
    );

    if (workspaceContact) return workspaceContact.nickname;

    return undefined;
    // const singleCookie = CookiesConfig.getCookie(SINGLE_CONTACTS);
    // const singleAddressBook: AddressBook[] = JSON.parse(singleCookie ?? '[]');
    //
    // return (
    //   singleAddressBook.find(({ user }) => user.id === userId)?.nickname ?? ''
    // );
  }

  static removeDuplicates(addressBook: AddressBook[]) {
    return addressBook;
    // const userIds: string[] = [];
    // const duplicatedIds: string[] = [];
    //
    // addressBook.forEach(({ user }) => {
    //   if (userIds.includes(user.id)) duplicatedIds.push(user.id);
    //   userIds.push(user.id);
    // });
    //
    // if (duplicatedIds.length === 0) return addressBook;
    //
    // const singleWorkspace = JSON.parse(
    //   CookiesConfig.getCookie(SINGLE_WORKSPACE)!,
    // );
    //
    // return addressBook.filter(({ user, owner }) =>
    //   duplicatedIds.includes(user.id) && owner.id === singleWorkspace?.id
    //     ? false
    //     : true,
    // );
  }
}
