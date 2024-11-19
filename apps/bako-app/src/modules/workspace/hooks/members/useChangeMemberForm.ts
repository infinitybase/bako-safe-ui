import type { IPermission, Workspace } from '@bako-safe/services';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { AddressUtils } from '@/modules/core';

const memberSchema = (members: string[]) => {
  return yup.object({
    // TODO: Move address validation to ./src/modules/core/utils/address
    address: yup.object().shape({
      value: yup
        .string()
        .required('Empty address')
        .test('is-valid-address', 'Invalid address', (address) =>
          AddressUtils.isValid(address),
        )
        .test('is-not-owner', 'This address is already a member', (address) => {
          return !members?.includes(address);
        }),
    }),
  });
};

const permissionSchema = yup.object({
  permission: yup.string().required('Permission is required.'),
});

const editSchema = yup.object({
  permission: yup.string().required('Permission is required.'),
});

const useChangeMemberForm = (owner: string[]) => {
  const memberForm = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(memberSchema(owner)),
    defaultValues: {
      address: {
        value: '',
      },
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

  const editForm = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(editSchema),
    defaultValues: {
      permission: '',
    },
  });

  const setMemberValuesByWorkspace = (
    workspace: Workspace,
    memberId: string,
  ) => {
    const member = workspace?.members
      .filter((member) => member.id === memberId)
      .map((member) => member.address);
    const permission = workspace?.permissions;
    const permissionRole =
      permission &&
      Object.keys(permission).filter((role) =>
        permission[role as keyof IPermission].includes('*'),
      );

    permissionForm.setValue('permission', permissionRole?.[0], {
      shouldValidate: true,
    });
    memberForm.setValue(
      'address',
      { value: member?.[0] },
      { shouldValidate: true },
    );
    editForm.setValue('permission', permissionRole?.[0], {
      shouldValidate: true,
    });
  };

  return { memberForm, permissionForm, editForm, setMemberValuesByWorkspace };
};

export { useChangeMemberForm };
