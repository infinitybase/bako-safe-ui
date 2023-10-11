import { useMutation } from 'react-query';

import { ITemplatePayload } from '@/modules/core';

import { TemplateService } from '../services/methods';

const useCreate = () => {
  const { mutateAsync, isLoading, isError } = useMutation(
    async (data: ITemplatePayload) => {
      return await TemplateService.create(data);
    },
  );

  return {
    createTemplate: mutateAsync,
    isLoading,
    isError,
  };
};

export { useCreate };
