import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { AddressUtils } from '@/modules/core';

const memberSchema = yup.object({
  // TODO: Move address validation to ./src/modules/core/utils/address
  address: yup
    .string()
    .required('Empty address')
    .test('is-valid-address', 'Invalid address', (address) =>
      AddressUtils.isValid(address),
    ),
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
