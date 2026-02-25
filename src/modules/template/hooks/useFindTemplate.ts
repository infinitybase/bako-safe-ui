import { useQuery } from '@tanstack/react-query';

import { TemplateService } from '../services/methods';

const useFindTemplate = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['findTemplate'],
    queryFn: () => TemplateService.getAll(),
    // IS TEMPORARY - TEMPLATES ARE NOT READY YET
    enabled: false,
  });

  return {
    template: data || [],
    isLoading,
    isError,
  };
};

export { useFindTemplate };
