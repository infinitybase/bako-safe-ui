import { api } from '@/config';
import { AddressBook } from '@/modules/core/models/addressBook';

export type CreateContactResponse = AddressBook;
export interface CreateContactPayload {
  nickname: string;
  address: string;
}

export class AddressBookService {
  static async create(payload: CreateContactPayload) {
    const { data } = await api.post<CreateContactResponse>(
      '/address-book',
      payload,
    );
    return data;
  }
}
