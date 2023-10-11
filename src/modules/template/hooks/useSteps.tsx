import { UseFormReturn, useFieldArray, useForm } from 'react-hook-form';

import { ITemplatePayload } from '@/modules/core';

import { AddressStep, InfoStep, SuccesStep } from '../components';
import { useModal } from './useModal';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from './useAddressesValidate';

export interface IStep {
  component: React.ReactNode;
  hiddeTitle: boolean;
  hiddeFooter: boolean;
  hiddeProgressBar: boolean;
  onSubmit: (data: ITemplatePayload) => void;
  isLoading: boolean;
}
import { useCreate } from './useCreateTemplate';
import { useNavigate } from 'react-router-dom';
import { useTemplateStore } from '../store';
const useSteps = () => {
  const { nextStep } = useModal();
  const navigate = useNavigate();
  const { templateFormInitial } = useTemplateStore();
  const { createTemplate, isLoading } = useCreate();
  const { handleSubmit, ...form } = useForm<ITemplatePayload>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      addresses: templateFormInitial.addresses || [],
      minSigners: templateFormInitial.minSigners || 1,
    },
  });

  const a: string[] = [];
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
      onSubmit: (data) => {
        nextStep();
      },
    },
    {
      component: <AddressStep form={{ handleSubmit, ...form }} />,
      hiddeTitle: false,
      hiddeFooter: false,
      hiddeProgressBar: false,
      isLoading,
      onSubmit: async (data) => {
        const { addresses, ...rest } = data;
        const add = addresses as unknown as { value: string }[];

        await createTemplate({
          ...data,
          addresses: add.map((item) => item.value),
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
      onSubmit: (data) => {
        navigate('/home');
      },
    },
  ];

  return { steps, handleSubmit, form, addresses: addressesFieldArray };
};

export { useSteps };
