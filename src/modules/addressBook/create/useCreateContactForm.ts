import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required('Name is required.'),
  address: yup.string().required('Address is required.'),
});

const useCreateContactForm = () => {
  const form = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      address: '',
    },
  });

  return {
    form,
  };
};

export { useCreateContactForm };
