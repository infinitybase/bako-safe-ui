import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

export type UseWebAuthnForm = ReturnType<typeof useWebAuthnForm>;

const createSchema = (isRegisterMode: boolean) =>
  yup.object({
    username: yup
      .string()
      .min(3, 'Username must be at least 3 characters')
      .required('You must provide a username')
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

const useWebAuthnForm = (isRegisterMode: boolean) => {
  const schema = createSchema(isRegisterMode);

  const form = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      termsOfUse: false,
    },
  });

  return { form };
};

export { useWebAuthnForm };
