import { SortOption } from 'bakosafe';

import { IPagination } from '@/modules/core';
import { AddressBook } from '@/modules/core/models/';

import { WorkspaceContact } from '../../core/models/workspace';

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
  perPage?: number;
  page?: number;
  orderBy?: string;
  sort?: SortOption;
}

export type GetPaginatedContactsResponse = IPagination<WorkspaceContact>;
