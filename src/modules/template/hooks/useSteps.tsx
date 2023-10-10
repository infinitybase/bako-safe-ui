import { UseFormReturn, useFieldArray, useForm } from 'react-hook-form';

import { ITemplate } from '@/modules/core';

import { AddressStep, InfoStep, SuccesStep } from '../components';
import { useModal } from './useModal';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from './useAddressesValidate';

export interface IStep {
  component: React.ReactNode;
  hiddeTitle: boolean;
  hiddeFooter: boolean;
  hiddeProgressBar: boolean;
  onSubmit: (data: ITemplate) => void;
}

const useSteps = () => {
  const { nextStep } = useModal();
  const { handleSubmit, ...form } = useForm<ITemplate>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      addresses: [],
      minSigners: 0,
    },
  });

  const a: string[] = [];
  const addressesFieldArray = useFieldArray<ITemplate>({
    control: form.control,
    name: 'addresses' as never,
  });

  const steps: IStep[] = [
    {
      component: <InfoStep form={{ handleSubmit, ...form }} />,
      hiddeTitle: false,
      hiddeFooter: false,
      hiddeProgressBar: false,
      onSubmit: (data) => {
        console.log(data);
        nextStep();
      },
    },
    {
      component: <AddressStep form={{ handleSubmit, ...form }} />,
      hiddeTitle: false,
      hiddeFooter: false,
      hiddeProgressBar: false,
      onSubmit: (data) => console.log(data),
    },
    {
      component: <SuccesStep />,
      hiddeTitle: true,
      hiddeFooter: true,
      hiddeProgressBar: true,
      onSubmit: (data) => console.log(data),
    },
  ];

  return { steps, handleSubmit, form, addresses: addressesFieldArray };
};

export { useSteps };
