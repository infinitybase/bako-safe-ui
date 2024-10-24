import { IPagination } from "@app/modules/core";
import { AddressBook, WorkspaceContact } from "@app/modules/core/models/";
import { SortOption } from "../types";

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

export interface GetPaginatedContactsParams {
  q?: string;
  includePersonal?: boolean;
  excludeContacts?: string[];
  perPage?: number;
  page?: number;
  orderBy?: string;
  sort?: SortOption;
}

export type GetPaginatedContactsResponse = IPagination<WorkspaceContact>;
