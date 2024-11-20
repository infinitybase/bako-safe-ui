import type { SortOption, IPagination } from "@/types";
import type { WorkspaceContact } from "../workspace/types";

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

interface CreatedBy {
  id: string;
  address: string;
}

interface Contact {
  id: string;
  address: string;
  avatar: string;
}
export interface AddressBook {
  id: string;
  nickname: string;
  owner: CreatedBy;
  user: Contact;
}

export type GetPaginatedContactsResponse = IPagination<WorkspaceContact>;
