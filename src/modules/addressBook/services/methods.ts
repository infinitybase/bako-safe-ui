import { api } from '@/config';
import { AddressBook } from '@/modules/core/models/addressBook';

export type CreateContactResponse = AddressBook;
export type UpdateContactResponse = AddressBook;
export type FindContactsResponse = AddressBook[];
export type ListContactsResponse = AddressBook[];
export type DeleteContactResponse = boolean;
export interface CreateContactPayload {
  nickname: string;
  address: string;
}

export interface UpdateContactPayload {
  id: string;
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

  static async update(payload: UpdateContactPayload) {
    const { data } = await api.put<UpdateContactResponse>(
      `/address-book/${payload.id}`,
      payload,
    );
    return data;
  }

  static async delete(id: string) {
    const { data } = await api.delete<DeleteContactResponse>(
      `/address-book/${id}`,
    );
    return data;
  }

  static async find(params: FindContactsParams) {
    const { data } = await api.get<FindContactsResponse>('/address-book', {
      params,
    });
    return data;
  }

  static async list() {
    const { data } = await api.get<ListContactsResponse>('/address-book');
    return data;
  }
}
