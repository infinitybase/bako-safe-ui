import { api } from '@/config';
import { CookieName, CookiesConfig } from '@/config/cookies';

const { SINGLE_CONTACTS, WORKSPACE } = CookieName;

import {
  CreateContactPayload,
  CreateContactResponse,
  DeleteContactResponse,
  FindContactsParams,
  FindContactsResponse,
  GetPaginatedContactsParams,
  GetPaginatedContactsResponse,
  ListContactsResponse,
  UpdateContactPayload,
  UpdateContactResponse,
} from './types';

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

    if (JSON.parse(CookiesConfig.getCookie(WORKSPACE)!)?.single) {
      CookiesConfig.setCookies([
        { name: SINGLE_CONTACTS, value: JSON.stringify(data) },
      ]);
    }

    return data;
  }

  static async listWithPagination(params: GetPaginatedContactsParams) {
    const { data } = await api.get<GetPaginatedContactsResponse>(
      `/address-book`,
      { params },
    );

    return data;
  }
}
