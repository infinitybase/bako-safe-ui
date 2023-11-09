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
  createdBy: CreatedBy;
  user: Contact;
}
