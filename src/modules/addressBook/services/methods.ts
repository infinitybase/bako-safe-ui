import { api } from '@/config';
import { AddressBook } from '@/modules/core/models/addressBook';

export type CreateContactResponse = AddressBook;
export type FindContactsResponse = AddressBook[];
export interface CreateContactPayload {
  nickname: string;
  address: string;
}

export interface FindContactsParams {
  q?: string;
}

export class AddressBookService {
  static async create(payload: CreateContactPayload) {
    const { data } = await api.post<CreateContactResponse>(
      '/address-book',
      payload,
    );
    return data;
  }

  static async find(params: FindContactsParams) {
    const { data } = await api.get<FindContactsResponse>('/address-book', {
      params,
    });
    return data;
  }
}
