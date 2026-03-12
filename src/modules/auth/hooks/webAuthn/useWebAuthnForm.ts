import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

export type UseWebAuthnForm = ReturnType<typeof useWebAuthnForm>;

const createSchema = () =>
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
  });

const useWebAuthnForm = () => {
  const schema = createSchema();

  const form = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
    },
  });

  return { form };
};

export { useWebAuthnForm };
