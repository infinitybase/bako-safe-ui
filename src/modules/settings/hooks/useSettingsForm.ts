import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const schema = yup.object({
  notify: yup.string(),
  name: yup.string(),
  email: yup
    .string()
    .email()
    .test('subscription-reqires-email', 'Email is required!', function (item) {
      return this.parent.notify === 'true' && !item ? false : true;
    }),
});

const useSettingsForm = () => {
  const form = useForm({
    mode: 'onSubmit',
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

// export type UseCreateTransactionForm = ReturnType<typeof useSettingsForm>;

export { useSettingsForm };
