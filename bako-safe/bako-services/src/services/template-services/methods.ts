import { api } from "@/config";
import { ITemplate, ITemplatePayload, PaginationParams } from "@/modules/core";

export interface GetAllTemplatesPayload extends PaginationParams {
  q?: string;
}

export type GetTemplateResponse = ITemplate;
export type CreateTemplateResponse = ITemplatePayload;
export type GetAllTemplateResponse = ITemplatePayload[];
export type GetAllTemplatePaginationResponse = ITemplate[];
export type CreateTemplatePayload = ITemplatePayload;

export class TemplateService {
  static async create(payload: CreateTemplatePayload) {
    const { data } = await api.post<CreateTemplateResponse>(
      "/template",
      payload,
    );
    return data;
  }

  static async getAll(params?: GetAllTemplatesPayload) {
    const { data } = await api.get<GetAllTemplatePaginationResponse>(
      "/template",
      {
        params,
      },
    );

    return data;
  }

  static async getById(id: string) {
    const { data } = await api.get<GetTemplateResponse>(`/template/${id}`);
    return data;
  }

  static async update(id: string, payload: Partial<ITemplatePayload>) {
    const { data } = await api.put<GetTemplateResponse>(
      `/template/${id}`,
      payload,
    );
    return data;
  }
}
