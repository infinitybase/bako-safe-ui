import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const createSchema = yup.object({
  name: yup
    .string()
    .min(3, 'Name must be at least 3 characters')
    .required('You must provide a name'),
});

const loginSchema = yup.object({
  name: yup.string().required('You must select a name'),
});

const useWebAuthnForm = () => {
  const memberForm = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(createSchema),
    defaultValues: {
      name: '',
    },
  });

  const loginForm = useForm({
    mode: 'onChange',
    reValidateMode: 'onBlur',
    resolver: yupResolver(loginSchema),
    defaultValues: {
      name: '',
    },
  });

  return { memberForm, loginForm };
};

export { useWebAuthnForm };
