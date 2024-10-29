import { WorkspaceContact } from "../workspace/types";
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
import { AxiosInstance } from "axios";

export class AddressBookService {
  api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async create(payload: CreateContactPayload) {
    const { data } = await this.api.post<CreateContactResponse>(
      "/address-book",
      payload,
    );
    return data;
  }

  async update(payload: UpdateContactPayload) {
    const { data } = await this.api.put<UpdateContactResponse>(
      `/address-book/${payload.id}`,
      payload,
    );
    return data;
  }

  async delete(id: string) {
    const { data } = await this.api.delete<DeleteContactResponse>(
      `/address-book/${id}`,
    );
    return data;
  }

  async find(params: FindContactsParams) {
    const { data } = await this.api.get<FindContactsResponse>("/address-book", {
      params,
    });
    return data;
  }

  async list(includePersonal: boolean = false) {
    const { data } = await this.api.get<ListContactsResponse>(
      `/address-book?includePersonal=${includePersonal}`,
    );

    return data;
  }

  search(
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

  async listWithPagination(params: GetPaginatedContactsParams) {
    const { data } = await this.api.get<GetPaginatedContactsResponse>(
      `/address-book`,
      { params },
    );

    return {
      ...data,
      data: this.search(params, data.data),
    };
  }
}
