import { useForm } from 'react-hook-form';

import { AssetItem } from '../../components/bridge';

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

const useFormBridge = () => {
  const form = useForm<ITransferBridgePayload>({
    defaultValues: {
      selectNetworkFrom: '',
      selectAssetFrom: '',
      selectNetworkTo: '',
      selectAssetTo: null,
      searchAsset: '',
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    console.log('Form data', data);
  });

  return {
    form,
    onSubmit,
  };
};

export { useFormBridge };
