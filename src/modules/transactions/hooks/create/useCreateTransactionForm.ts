import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';

const transactionSchema = yup.object({
  asset: yup.string().required(),
  amount: yup.string().required(),
  to: yup.string().required(),
});

const schema = yup.object({
  name: yup.string().required(''),
  transactions: yup.array(transactionSchema),
});

const useCreateTransactionForm = () => {
  const form = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      transactions: [
        {
          asset: '',
          to: '',
          amount: '',
        },
      ],
    },
  });
  const transactionsFields = useFieldArray({
    control: form.control,
    name: 'transactions',
  });

  return {
    form,
    transactionsFields,
  };
};

export { useCreateTransactionForm };
