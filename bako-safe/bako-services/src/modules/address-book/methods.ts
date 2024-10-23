import { api } from "@app/config";
import { WorkspaceContact } from "@app/modules/core";

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
} from "./types";

export class AddressBookService {
  static async create(payload: CreateContactPayload) {
    const { data } = await api.post<CreateContactResponse>(
      "/address-book",
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
    const { data } = await api.get<FindContactsResponse>("/address-book", {
      params,
    });
    return data;
  }

  static async list(includePersonal: boolean = false) {
    const { data } = await api.get<ListContactsResponse>(
      `/address-book?includePersonal=${includePersonal}`,
    );

    return data;
  }

  static search(
    params: GetPaginatedContactsParams,
    contacts: WorkspaceContact[],
  ): WorkspaceContact[] {
    const { q, includePersonal, excludeContacts, perPage } = params;
    const query = q?.toLowerCase() ?? "";

    const filteredContacts = contacts.filter((contact) => {
      const nickname = contact.nickname.toLowerCase();
      const address = contact.user.address.toLowerCase();

      const isExcluded = excludeContacts?.includes(contact.user.address);
      const matchesQuery =
        nickname.includes(query) ||
        address.includes(query) ||
        (includePersonal && contact.nickname.toLowerCase().includes(query));

      return !isExcluded && matchesQuery;
    });

    const result = filteredContacts.slice(0, perPage);

    return result;
  }

  static async listWithPagination(params: GetPaginatedContactsParams) {
    const { data } = await api.get<GetPaginatedContactsResponse>(
      `/address-book`,
      { params },
    );

    return {
      ...data,
      data: this.search(params, data.data),
    };
  }
}
