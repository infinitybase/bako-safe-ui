import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { AddressUtils } from '@/modules/core';

const schema = yup.object({
  nickname: yup.string().required('Name is required.'),
  address: yup
    .string()
    .required('Address is required.')
    .test('is-valid-address', 'Invalid address', (address) =>
      AddressUtils.isValid(address),
    ),
});

const useCreateContactForm = () => {
  const form = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      nickname: '',
      address: '',
    },
  });

  return {
    form,
  };
};

export { useCreateContactForm };
