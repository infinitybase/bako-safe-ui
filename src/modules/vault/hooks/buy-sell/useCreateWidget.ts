import { useMutation } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';

import { ICreateWidgetPayload } from '@/modules/core/models/meld';

import { VaultService } from '../../services';

export const useCreateWidget = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    mutateAsync: createWidgetAsync,
    mutate: createWidget,
    ...rest
  } = useMutation({
    mutationFn: async (data: ICreateWidgetPayload) =>
      VaultService.createWidget(data),
    onSuccess: (response) => {
      navigate(`${location.pathname}/session/${response.id}`);
    },
  });

  return { createWidgetAsync, createWidget, ...rest };
};
