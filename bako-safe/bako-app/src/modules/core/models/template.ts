export interface ITemplatePayload {
  name: string;
  description?: string;
  minSigners: number;
  addresses: string[] | { value: string }[];
}

export interface ITemplate extends ITemplatePayload {
  id: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}
