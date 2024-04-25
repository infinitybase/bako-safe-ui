import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { CheckNicknameResponse } from '../services';
import { useWebAuthnLastLoginId } from './useWebAuthnLastLoginId';

const createSchema = yup.object({
  name: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .required('You must provide a username')
    .test(
      'is-valid-name',
      "The username can't contain special characters or symbols",
      (name) => /^@?[a-zA-Z0-9_]+$/.test(name),
    ),
});

const useWebAuthnForm = (availableAccounts: CheckNicknameResponse[]) => {
  const { lastLoginId } = useWebAuthnLastLoginId();

  const loginSchema = yup.object({
    name: yup
      .string()
      .required('You must select a username')
      .test('is-valid-username', 'You must select a valid username', (name) => {
        const acc = availableAccounts.find((user) => user.webauthn.id === name);
        return !!acc;
      }),
  });

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
    reValidateMode: 'onChange',
    resolver: yupResolver(loginSchema),
    defaultValues: {
      name: lastLoginId || '',
    },
  });

  return { memberForm, loginForm };
};

export { useWebAuthnForm };
