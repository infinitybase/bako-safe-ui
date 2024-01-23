import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { AddressUtils, Workspace } from '@/modules/core';

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

  const setMemberValuesByWorkspace = (
    workspace: Workspace,
    memberId: string,
  ) => {
    const member = workspace.members
      .filter((member) => member.id === memberId)
      .map((member) => member.address)
      .toString();
    const permission = workspace.permissions[memberId];
    const permissionRole = Object.keys(permission)
      .filter((role) => permission[role].includes('*'))
      .toString();

    permissionForm.setValue('permission', permissionRole, {
      shouldValidate: true,
    });
    memberForm.setValue('address', member, { shouldValidate: true });
  };

  return { memberForm, permissionForm, setMemberValuesByWorkspace };
};

export { useChangeMemberForm };
