import { VStack } from 'bako-ui';
import { memo, useCallback, useMemo } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import {
  CreateContactDialog,
  useAddressBookAutocompleteOptions,
} from '@/modules/addressBook';
import {
  ITransactionForm,
  useAssetSelectOptions,
  UseCreateTransaction,
} from '@/modules/transactions/hooks';
import { UseVaultDetailsReturn } from '@/modules/vault';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import RecipientFormAddress from './form/address';
import RecipientFormAmount from './form/amount';
import RecipientFormAsset from './form/asset';

interface RecipientFormFieldProps {
  index: number;
  assets: UseVaultDetailsReturn['assets'];
  isFeeCalcLoading: boolean;
  getBalanceAvailable: UseCreateTransaction['getBalanceAvailable'];
}

const RecipientFormField = (props: RecipientFormFieldProps) => {
  const { assets, index, isFeeCalcLoading, getBalanceAvailable } = props;
  const { setValue, formState, control } = useFormContext<ITransactionForm>();

  const {
    authDetails: { userInfos },
    addressBookInfos: {
      workspaceId,
      dialog: { contactDialog },
      handlers: { handleOpenDialog },
      requests: { listContactsRequest, createContactRequest },
      form: contactForm,
    },
    vaultDetails: {
      assets: { isNFTAsset },
    },
    tokensUSD,
  } = useWorkspaceContext();

  const balanceAvailable = getBalanceAvailable();

  const transactions = useWatch({ control, name: 'transactions' });

  const setResolverAndHandle = useCallback(
    (resolver?: string, handle?: string) => {
      setValue('resolver', resolver);
      setValue('handle', handle);

      return;
    },
    [setValue],
  );

  const { optionsRequests, optionRef } = useAddressBookAutocompleteOptions({
    workspaceId: workspaceId!,
    includePersonal: !userInfos.onSingleWorkspace,
    contacts: listContactsRequest.data!,
    fields: transactions || [],
    errors: formState.errors.transactions,
    isUsingTemplate: false,
    isFirstLoading: false,
    dynamicCurrentIndex: index,
    canRepeatAddresses: true,
    setResolverAndHandle,
  });

  const asset = useMemo(
    () => transactions?.[index]?.asset,
    [transactions, index],
  );

  const isNFT = useMemo(() => isNFTAsset(asset!), [asset, isNFTAsset]);

  const { assetsOptions } = useAssetSelectOptions({
    currentAsset: asset!,
    assets: assets.assets,
    nfts: assets.nfts,
    recipients: transactions,
    getBalanceAvailable,
  });

  const getAssetPrice = useCallback(
    (assetId: string) => {
      return tokensUSD.data?.[assetId]?.usdAmount ?? 0;
    },
    [tokensUSD.data],
  );

  const handleOpenAddressBookDialog = useCallback(
    (address: string) => {
      handleOpenDialog({ address });
    },
    [handleOpenDialog],
  );

  return (
    <>
      <CreateContactDialog
        form={contactForm}
        dialog={contactDialog}
        isLoading={createContactRequest.isPending}
        isEdit={false}
      />
      <VStack gap={5}>
        <Controller
          name={`transactions.${index}.value`}
          control={control}
          render={({ field, fieldState }) => (
            <RecipientFormAddress
              addressBookOptions={optionsRequests[index].options}
              optionsRef={optionRef}
              handleOpenDialog={handleOpenAddressBookDialog}
              index={index}
              isLoading={optionsRequests[index].isPending}
              error={fieldState.error}
              {...field}
            />
          )}
        />
        <Controller
          name={`transactions.${index}.asset`}
          control={control}
          render={({ field, fieldState }) => (
            <RecipientFormAsset
              error={fieldState.error}
              index={index}
              isNFT={isNFT}
              isNFTAsset={isNFTAsset}
              isInvalid={fieldState.invalid}
              isFeeCalcLoading={isFeeCalcLoading}
              balanceAvailable={balanceAvailable}
              assets={assets}
              assetsOptions={assetsOptions}
              onChange={field.onChange}
              onClearValue={() => {
                field.onChange('');
                setValue(`transactions.${index}.amount`, '');
              }}
              value={field.value}
            />
          )}
        />
        <Controller
          name={`transactions.${index}.amount`}
          control={control}
          render={({ field, fieldState }) => (
            <RecipientFormAmount
              {...field}
              getAssetPrice={getAssetPrice}
              getBalanceAvailable={getBalanceAvailable}
              index={index}
              isNFT={isNFT}
              isLoadingFee={isFeeCalcLoading}
              error={fieldState.error}
            />
          )}
        />
      </VStack>
    </>
  );
};

export default memo(RecipientFormField);
