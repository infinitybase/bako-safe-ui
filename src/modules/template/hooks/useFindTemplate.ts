import { useQuery } from 'react-query';

import { TemplateService } from '../services/methods';

const useFindTemplate = () => {
  const { data, isLoading, isError } = useQuery('findTemplate', () =>
    TemplateService.getAll(),
  );

  return {
    template: data || [],
    isLoading,
    isError,
  };
};

export { useFindTemplate };
