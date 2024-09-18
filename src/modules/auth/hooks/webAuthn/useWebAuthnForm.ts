import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { WebAuthnModeState } from '../signIn/useWebAuthnSignIn';

export type UseWebAuthnForm = ReturnType<typeof useWebAuthnForm>;

const createSchema = (isRegisterMode: boolean) =>
  yup.object({
    username: yup
      .string()
      .required('You must enter your username to continue')
      .min(3, 'Username must be at least 3 characters')
      .test(
        'is-valid-name',
        "The username can't contain special characters or symbols",
        (name) => /^@?[a-zA-Z0-9_]+$/.test(name),
      ),
    termsOfUse: yup
      .boolean()
      .when([], (_, schema) =>
        isRegisterMode
          ? schema
              .required('You must agree to the Terms of use')
              .oneOf([true], 'You must agree to the Terms of use')
          : schema.notRequired(),
      ),
  });

const useWebAuthnForm = (mode: WebAuthnModeState) => {
  const schema = createSchema(mode === WebAuthnModeState.REGISTER);

  const form = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      termsOfUse: false,
    },
  });

  useEffect(() => {
    form.setValue('termsOfUse', false, { shouldValidate: true });
  }, [mode]);

  return { form };
};

export { useWebAuthnForm };
