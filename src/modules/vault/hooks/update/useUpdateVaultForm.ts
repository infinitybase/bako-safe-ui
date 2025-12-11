import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useDebounce } from '@/modules/core/hooks';
import { PredicateUpdatePayload } from '@/modules/core/models';

import { useCheckVaultName } from '../useGetByNameVaultRequest';

interface UseUpdateVaultFormParams {
  initialValues: PredicateUpdatePayload;
  vaultId: string;
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required').trim(),
  description: yup.string().optional(),
});

export type UseUpdateVaultForm = ReturnType<typeof useUpdateVaultForm>;

export const useUpdateVaultForm = (params: UseUpdateVaultFormParams) => {
  const { initialValues, vaultId } = params;

  const form = useForm({
    defaultValues: {
      name: initialValues.name,
      description: initialValues.description,
    },
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });

  const currentName = form.watch('name');
  const debouncedName = useDebounce(currentName, 600);
  const { data: nameAlreadyExists } = useCheckVaultName(debouncedName, vaultId);

  return {
    form,
    nameAlreadyExists: !!nameAlreadyExists,
  };
};
