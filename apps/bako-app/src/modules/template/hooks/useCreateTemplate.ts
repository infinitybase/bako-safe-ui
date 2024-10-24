import { useMutation } from '@tanstack/react-query';

import { ITemplatePayload } from '@/modules/core';

import { TemplateService } from '../services/methods';

const useCreate = () => {
  const { mutateAsync, isPending, isError } = useMutation({
    mutationFn: async (data: ITemplatePayload) => {
      return await TemplateService.create(data);
    },
  });

  return {
    createTemplate: mutateAsync,
    isLoading: isPending,
    isError,
  };
};

export { useCreate };
