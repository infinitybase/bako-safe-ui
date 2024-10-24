import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const schema = yup.object({
  notify: yup.string(),
  name: yup
    .string()
    .test(
      'is-valid-username',
      "The username can't contain special characters or symbols",
      (name) => {
        if (!name) return true;
        return /^[a-zA-Z0-9_]+$/.test(name);
      },
    ),
  email: yup
    .string()
    .email('Invalid email')
    .test('subscription-reqires-email', 'Email is required!', function (item) {
      return this.parent.notify === 'true' && !item ? false : true;
    }),
});

const useSettingsForm = () => {
  const form = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      notify: 'false',
    },
  });

  return {
    form,
  };
};

export { useSettingsForm };
