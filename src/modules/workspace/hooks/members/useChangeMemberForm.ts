import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const schema = yup.object({
  address: yup.string().required('Address is required.'),
  permission: yup.string().required('Permission is required.'),
});

const useChangeMemberForm = () =>
  useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      address: '',
      permission: '',
    },
  });

export { useChangeMemberForm };
