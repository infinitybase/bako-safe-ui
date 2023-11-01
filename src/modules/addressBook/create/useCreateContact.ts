import { useCreateContactForm } from './useCreateContactForm';

export enum TabState {
  INFO,
  ADDRESSES,
  SUCCESS,
}

export type UseCreateContactReturn = ReturnType<typeof useCreateContact>;

const useCreateContact = () => {
  // const { account } = useFuelAccount();
  // const [fuel] = useFuel();

  // const navigate = useNavigate();
  // const [tab, setTab] = useState<TabState>(TabState.INFO);
  // const [vaultId, setVaultId] = useState<string>('');
  // const toast = useToast();
  // const { setTemplateFormInitial } = useTemplateStore();
  const { form } = useCreateContactForm();
  // const request = useCreateVaultRequest({
  //   onSuccess: (data) => {
  //     setVaultId(data.id);
  //     setTab(TabState.SUCCESS);
  //   },
  //   onError: () => {
  //     toast.show({
  //       status: 'error',
  //       title: 'Error on create vault',
  //       position: 'bottom',
  //       isClosable: true,
  //     });
  //   },
  // });

  // const handleCreateVault = form.handleSubmit(async (data) => {
  //   const addresses = data.addresses?.map((address) => address.value) ?? [];

  //   request.createVault({
  //     name: data.name,
  //     addresses,
  //     minSigners: Number(data.minSigners),
  //     description: data.description,
  //     provider: await fuel.getProvider(),
  //   });
  // });

  return {
    form: {
      ...form,
      // handleCreateVault,
    },
    // addresses: {
    //   fields: addressesFieldArray.fields,
    //   remove: removeAddress,
    //   append: appendAddress,
    //   has: hasAddress,
    // },
    // tabs: {
    //   tab,
    //   set: setTab,
    //   isLast: tab === TabState.ADDRESSES,
    // },
    // request,
    // navigate,
    // onDeposit,
    // setFormWithTemplate,
    // onSaveTemplate,
  };
};

export { useCreateContact };
