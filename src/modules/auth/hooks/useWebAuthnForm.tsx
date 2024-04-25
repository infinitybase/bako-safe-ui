import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useWebAuthnLastLoginId } from './useWebAuthnLastLoginId';

const createSchema = yup.object({
  name: yup
    .string()
    .min(3, 'Name must be at least 3 characters')
    .required('You must provide a name')
    .test(
      'is-valid-name',
      "The username can't contain special characters or symbols",
      (name) => /^@?[a-zA-Z0-9_]+$/.test(name),
    ),
});

const loginSchema = yup.object({
  name: yup.string().required('You must select a name'),
});

const useWebAuthnForm = () => {
  const { lastLoginId } = useWebAuthnLastLoginId();

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
      name: lastLoginId || '',
    },
  });

  return { memberForm, loginForm };
};

export { useWebAuthnForm };
