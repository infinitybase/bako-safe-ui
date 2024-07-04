import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required('Key name is required.'),
  transactionName: yup.string().required('Transaction name is required.'),
});

export type UseCreateVaultFormFields = yup.InferType<typeof schema>;

const useCreateAPITokenForm = () => {
  const form = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      transactionName: '',
    },
  });

  return {
    form,
  };
};

export { useCreateAPITokenForm };
