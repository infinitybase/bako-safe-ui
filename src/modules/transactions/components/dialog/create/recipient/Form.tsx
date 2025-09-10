import { CloseIcon } from '@chakra-ui/icons';
import {
  CircularProgress,
  FormHelperText,
  HStack,
  IconButton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { bn } from 'fuels';
import { memo, useCallback, useMemo } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import {
  CreateContactDialog,
  useAddressBookAutocompleteOptions,
} from '@/modules/addressBook';
import { AssetSelect } from '@/modules/core';
import { useBakoIDClient } from '@/modules/core/hooks/bako-id';
import {
  ITransactionForm,
  useAssetSelectOptions,
  UseCreateTransaction,
} from '@/modules/transactions/hooks';
import { UseVaultDetailsReturn } from '@/modules/vault';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import RecipientFormAddress from './form/address';
import RecipientFormAmount from './form/amount';

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
    providerInstance,
    vaultDetails: {
      assets: { isNFTAsset },
    },
    tokensUSD,
  } = useWorkspaceContext();

  const balanceAvailable = getBalanceAvailable();
  const {
    handlers: { fetchResolverName, fetchResolveAddress },
  } = useBakoIDClient(providerInstance);

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
      <VStack spacing={5}>
        <Controller
          name={`transactions.${index}.value`}
          control={control}
          render={({ field, fieldState }) => (
            <RecipientFormAddress
              addressBookOptions={optionsRequests[index].options}
              optionsRef={optionRef}
              handleOpenDialog={handleOpenAddressBookDialog}
              handleResolverAddress={fetchResolveAddress.handler}
              handleResolverName={fetchResolverName.handler}
              index={index}
              isLoading={
                !optionsRequests[index].isSuccess ||
                fetchResolveAddress.isLoading ||
                fetchResolverName.isLoading
              }
              error={fieldState.error}
              {...field}
            />
          )}
        />
        <Controller
          name={`transactions.${index}.asset`}
          control={control}
          render={({ field, fieldState }) => {
            return (
              <HStack
                align="start"
                spacing={2}
                position="relative"
                width="100%"
                data-testid="transaction_asset"
              >
                <AssetSelect
                  isInvalid={fieldState.invalid}
                  options={assetsOptions}
                  name={`transaction.${index}.asset`}
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    if (isNFTAsset(e)) {
                      setValue(`transactions.${index}.amount`, bn(1).format());
                      return;
                    }

                    if (isNFTAsset(field.value)) {
                      setValue(`transactions.${index}.amount`, '');
                    }
                  }}
                  helperText={
                    <FormHelperText
                      color={fieldState.error ? 'error.500' : 'grey.425'}
                    >
                      {!isNFT && (
                        <Text display="flex" alignItems="center" mt={1}>
                          {!field.value ? (
                            'Select an asset to see the balance'
                          ) : parseFloat(balanceAvailable) > 0 ? (
                            isFeeCalcLoading ? (
                              <>
                                Balance (available):{' '}
                                <CircularProgress
                                  trackColor="dark.100"
                                  size={3}
                                  isIndeterminate
                                  color="grey.425"
                                  ml={1}
                                />
                              </>
                            ) : (
                              <>
                                Balance (available):{' '}
                                {assets.getAssetInfo(asset!)?.slug}{' '}
                                {balanceAvailable}
                              </>
                            )
                          ) : null}
                        </Text>
                      )}
                    </FormHelperText>
                  }
                />
                {field.value && (
                  <IconButton
                    aria-label="Clear"
                    icon={<CloseIcon boxSize={2.5} />}
                    size="xs"
                    variant="ghost"
                    position="absolute"
                    top={isNFT ? '47%' : '38%'}
                    right="0.5rem"
                    bg="grey.825"
                    padding="0.5rem"
                    paddingTop={'20px'}
                    paddingBottom={'20px'}
                    borderRadius="md"
                    _hover={{ bg: 'grey.825' }}
                    color={'white'}
                    transform="translateY(-50%)"
                    zIndex={1}
                    onClick={() => {
                      field.onChange(null);
                      setValue(`transactions.${index}.amount`, '');
                    }}
                  />
                )}
              </HStack>
            );
          }}
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
