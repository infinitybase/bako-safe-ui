import { createContext, useContext } from 'react';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';

import { AssetItem } from '../modalSelectAssets';

export interface ITransferBridgePayload {
  selectNetworkFrom: string;
  selectAssetFrom: string;
  selectNetworkTo: string;
  selectAssetTo: AssetItem | null;
  selectAssetToMobile: string;
  destinationAddress: string;
  amount: string;
  searchAsset: string;
}

interface FormBridgeContextProps {
  form: UseFormReturn<ITransferBridgePayload>;
}

const FormBridgeContext = createContext<FormBridgeContextProps | null>(null);

const FormBridgeProvider = ({ children }: { children: React.ReactNode }) => {
  const form = useForm<ITransferBridgePayload>({
    defaultValues: {
      selectNetworkFrom: '',
      selectAssetFrom: '',
      selectNetworkTo: '',
      selectAssetTo: null,
      searchAsset: '',
    },
  });

  return (
    <FormBridgeContext.Provider value={{ form }}>
      <FormProvider {...form}>{children}</FormProvider>
    </FormBridgeContext.Provider>
  );
};

const useFormBridgeContext = () => {
  const ctx = useContext(FormBridgeContext);
  if (!ctx)
    throw new Error('useFormBridge must be used inside FormBridgeProvider');
  return ctx;
};

export { FormBridgeProvider, useFormBridgeContext };
