import { CookieName, CookiesConfig } from '@/config/cookies';
import { AddressBook } from '@/modules';

export class AddressBookUtils {
  static getNickname(userId: string, workspaceContacts: AddressBook[]) {
    const workspaceContact = workspaceContacts.find(
      ({ user }) => user.id === userId,
    );

    if (workspaceContact) return workspaceContact.nickname;

    const singleCookie = CookiesConfig.getCookie(CookieName.SINGLE_CONTACTS);
    const singleAddressBook: AddressBook[] = JSON.parse(singleCookie ?? '[]');

    return (
      singleAddressBook.find(({ user }) => user.id === userId)?.nickname ?? ''
    );
  }
}
