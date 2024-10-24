import { yupResolver } from '@hookform/resolvers/yup';
import { Resolver, useFieldArray, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import { ITemplatePayload } from '@/modules/core';

import { AddressStep, InfoStep, SuccesStep } from '../components';
import { schema } from './useAddressesValidate';
import { useModal } from './useModal';

export interface IStep {
  component: React.ReactNode;
  hiddeTitle: boolean;
  hiddeFooter: boolean;
  hiddeProgressBar: boolean;
  onSubmit: (data: ITemplatePayload) => void;
  isLoading: boolean;
}

import { useTemplateStore } from '../store';
import { useCreate } from './useCreateTemplate';
const useSteps = () => {
  const { nextStep, resetSteps } = useModal();
  const navigate = useNavigate();
  const location = useLocation();

  const { templateFormInitial, setTemplateFormInitial } = useTemplateStore();
  const { createTemplate, isLoading } = useCreate();
  const { handleSubmit, ...form } = useForm<ITemplatePayload>({
    resolver: yupResolver(schema) as Resolver<ITemplatePayload, unknown>,
    defaultValues: {
      name: '',
      description: undefined,
      addresses: templateFormInitial.addresses.map((item: string) => {
        return {
          value: item,
        };
      }),
      minSigners: templateFormInitial.minSigners || 1,
    },
  });

  const addressesFieldArray = useFieldArray<ITemplatePayload>({
    control: form.control,
    name: 'addresses' as never,
  });

  const steps: IStep[] = [
    {
      component: <InfoStep form={{ handleSubmit, ...form }} />,
      hiddeTitle: false,
      hiddeFooter: false,
      hiddeProgressBar: false,
      isLoading,
      onSubmit: () => {
        nextStep();
      },
    },
    {
      component: (
        <AddressStep
          form={{ handleSubmit, ...form }}
          addresses={addressesFieldArray}
        />
      ),
      hiddeTitle: false,
      hiddeFooter: false,
      hiddeProgressBar: false,
      isLoading,
      onSubmit: async (data) => {
        //const { addresses } = data;
        // const filteredAddresses = addresses.filter(
        //   (item) => item !== undefined,
        // );

        //const add = filteredAddresses;

        await createTemplate({
          ...data,
          //addresses: add.map((item) => item.value),
        });
        nextStep();
      },
    },
    {
      component: <SuccesStep />,
      hiddeTitle: true,
      hiddeFooter: true,
      hiddeProgressBar: true,
      isLoading,
      onSubmit: () => {
        onClose();
      },
    },
  ];

  const onClose = () => {
    form.reset();
    setTemplateFormInitial({
      addresses: [],
      minSigners: 1,
    });
    resetSteps();
    const vaultId = location?.pathname.replace('/template/create', '');
    navigate(vaultId);
  };

  return { steps, handleSubmit, form, addresses: addressesFieldArray, onClose };
};

export { useSteps };
