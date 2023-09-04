import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDidMountEffect, useFuelAccount } from '@/modules';

import { useCreateVaultForm } from './useCreateVaultForm';

export enum TabState {
  INFO,
  ADDRESSES,
}

export type UseCreateVaultReturn = ReturnType<typeof useCreateVault>;

const useCreateVault = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabState>(TabState.INFO);
  const { form, addressesFieldArray } = useCreateVaultForm();
  const { account } = useFuelAccount();

  useDidMountEffect(() => {
    addressesFieldArray.append({ value: account });
  }, []);

  const handleCreateVault = form.handleSubmit((data) => {
    console.log(data);
  });

  const removeAddress = (index: number) => addressesFieldArray.remove(index);
  const appendAddress = () => addressesFieldArray.append({ value: '' });

  const hasAddress = (value: string) =>
    addressesFieldArray.fields.map((field) => field.value === value);

  return {
    form: {
      ...form,
      handleCreateVault,
    },
    addresses: {
      fields: addressesFieldArray.fields,
      remove: removeAddress,
      append: appendAddress,
      has: hasAddress,
    },
    tabs: {
      tab,
      set: setTab,
      isLast: tab === TabState.ADDRESSES,
    },
    navigate,
  };
};

export { useCreateVault };
