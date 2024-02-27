import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const createSchema = yup.object({
  name: yup
    .string()
    .required('You must provide a name')
    .test(
      'is-valid-name',
      'This username is not available',
      (name) => name.length > 3,
    ),
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
