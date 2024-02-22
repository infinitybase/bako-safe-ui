import { create } from 'zustand';

import { WorkspaceContact } from '@/modules/core';

type State = {
  contacts: WorkspaceContact[];
};

type Actions = {
  setContacts: (contacts: WorkspaceContact[]) => void;
};

type Store = State & Actions;

const useAddressBookStore = create<Store>((set) => ({
  contacts: [],
  setContacts: (contacts) => set({ contacts }),
}));

export { useAddressBookStore };
