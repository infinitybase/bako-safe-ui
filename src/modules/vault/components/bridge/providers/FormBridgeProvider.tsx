import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';

import { IGetLimitsResponse, IQuoteFormLayersSwap } from '@/modules/core';

import { AssetItem } from '../modalSelectAssets';
import { BridgeStepsForm } from '../utils';

export interface AssetFormItem extends AssetItem {
  tokens?: {
    symbol: string;
    decimals: number;
    logo: string;
  }[];
  id: string;
}

export interface ITransferBridgePayload {
  selectNetworkFrom: string;
  selectAssetFrom: string;
  selectNetworkTo: AssetItem | null;
  selectAssetTo: AssetItem | null;
  selectNetworkToMobile: string;
  selectAssetToMobile: string;
  destinationAddress: string;
  amount: string;
  searchAsset: string;
  searchNetwork: string;
}

interface FormBridgeContextProps {
  form: UseFormReturn<ITransferBridgePayload>;
  isLoadingQuote: boolean;
  dataQuote: IQuoteFormLayersSwap;
  dataLimits: IGetLimitsResponse;
  errorForm: string | null;
  toNetworkOptions: AssetFormItem[];
  isSendingTx: boolean;
  saveQuote: (data: IQuoteFormLayersSwap) => void;
  setLoadingQuote: (loading: boolean) => void;
  saveLimits: (data: IGetLimitsResponse) => void;
  saveErrorForm: (error: string | null) => void;
  saveToNetworkOptions: (options: AssetFormItem[]) => void;
  setIsSendingTx: (loading: boolean) => void;
  stepForm: BridgeStepsForm;
  setStepForm: (step: BridgeStepsForm) => void;
}

const FormBridgeContext = createContext<FormBridgeContextProps | null>(null);

const FormBridgeProvider = ({ children }: { children: React.ReactNode }) => {
  const [dataQuote, setDataQuote] = useState<IQuoteFormLayersSwap>(
    {} as IQuoteFormLayersSwap,
  );
  const [isLoadingQuote, setIsLoadingQuote] = useState<boolean>(false);
  const [dataLimits, setDataLimits] = useState<IGetLimitsResponse>(
    {} as IGetLimitsResponse,
  );
  const [errorForm, setErrorForm] = useState<string | null>(null);
  const [toNetworkOptions, setToNetworkOptions] = useState<AssetFormItem[]>([]);
  const [stepForm, setStepForm] = useState<BridgeStepsForm>(
    BridgeStepsForm.FROM,
  );
  const [isSendingTx, setIsSendingTx] = useState<boolean>(false);

  const form = useForm<ITransferBridgePayload>({
    defaultValues: {
      selectNetworkFrom: '',
      selectAssetFrom: '',
      selectNetworkTo: null,
      selectAssetTo: null,
      searchAsset: '',
      searchNetwork: '',
      amount: '0.000',
    },
  });

  const saveQuote = useCallback((data: IQuoteFormLayersSwap) => {
    setDataQuote(data);
  }, []);

  const setLoadingQuote = useCallback((loading: boolean) => {
    setIsLoadingQuote(loading);
  }, []);

  const saveLimits = useCallback((data: IGetLimitsResponse) => {
    setDataLimits(data);
  }, []);

  const saveErrorForm = useCallback((error: string | null) => {
    setErrorForm(error);
  }, []);

  const saveToNetworkOptions = useCallback((options: AssetFormItem[]) => {
    setToNetworkOptions(options);
  }, []);

  const value = useMemo(
    () => ({
      form,
      dataQuote,
      dataLimits,
      isLoadingQuote,
      errorForm,
      toNetworkOptions,
      isSendingTx,
      saveQuote,
      setLoadingQuote,
      saveLimits,
      saveErrorForm,
      saveToNetworkOptions,
      setIsSendingTx,
      stepForm,
      setStepForm,
    }),
    [
      form,
      dataQuote,
      dataLimits,
      isLoadingQuote,
      errorForm,
      toNetworkOptions,
      isSendingTx,
      saveQuote,
      setLoadingQuote,
      saveLimits,
      saveErrorForm,
      saveToNetworkOptions,
      stepForm,
    ],
  );

  return (
    <FormBridgeContext.Provider value={value}>
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
