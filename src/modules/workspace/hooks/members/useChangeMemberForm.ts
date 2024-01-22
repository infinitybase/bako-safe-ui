import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const memberSchema = yup.object({
  address: yup.string().required('Address is required.'),
});

const permissionSchema = yup.object({
  permission: yup.string().required('Permission is required.'),
});

const useChangeMemberForm = () => {
  const memberForm = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(memberSchema),
    defaultValues: {
      address: '',
    },
  });

  const permissionForm = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(permissionSchema),
    defaultValues: {
      permission: '',
    },
  });

  return { memberForm, permissionForm };
};

export { useChangeMemberForm };
