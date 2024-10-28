import {
  CircularProgress,
  FormControl,
  FormHelperText,
  FormLabel,
  Text,
  VStack,
} from '@chakra-ui/react';
import { AmountInput, Autocomplete } from '@bako-safe/ui/components';
import { bn } from 'fuels';
import { Controller } from 'react-hook-form';

import {
  AddToAddressBook,
  CreateContactDialog,
  useAddressBookAutocompleteOptions,
} from '@/modules/addressBook';
import { AddressUtils, AssetSelect } from '@/modules/core';
import { UseCreateTransaction } from '@/modules/transactions/hooks';
import { UseVaultDetailsReturn } from '@/modules/vault';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

interface TransctionFormFieldProps {
  form: UseCreateTransaction['form'];
  index: number;
  assets: UseVaultDetailsReturn['assets'];
  isFeeCalcLoading: boolean;
  getBalanceAvailable: UseCreateTransaction['getBalanceAvailable'];
}

const TransactionFormField = (props: TransctionFormFieldProps) => {
  const { form, assets, index, isFeeCalcLoading, getBalanceAvailable } = props;

  const asset = form.watch(`transactions.${index}.asset`);
  const isNFT = !!assets?.nfts?.find((nft) => nft.assetId === asset);

  const {
    authDetails: { userInfos },
    addressBookInfos: {
      workspaceId,
      dialog: { contactDialog },
      handlers: { handleOpenDialog },
      requests: { listContactsRequest, createContactRequest },
      form: contactForm,
      inView,
      canAddMember,
    },
  } = useWorkspaceContext();

  const balanceAvailable = getBalanceAvailable();

  const { optionsRequests, handleFieldOptions, optionRef } =
    useAddressBookAutocompleteOptions({
      workspaceId: workspaceId!,
      includePersonal: !userInfos.onSingleWorkspace,
      contacts: listContactsRequest.data!,
      fields: form.watch('transactions')!,
      errors: form.formState.errors.transactions,
      isUsingTemplate: false,
      isFirstLoading: false,
      dynamicCurrentIndex: index,
      canRepeatAddresses: true,
    });

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
          control={form.control}
          render={({ field, fieldState }) => {
            const appliedOptions = handleFieldOptions(
              field.value,
              optionsRequests[index].options,
              !!field.value,
            );

            const showAddToAddressBook =
              canAddMember &&
              !fieldState.invalid &&
              AddressUtils.isValid(field.value) &&
              optionsRequests[index].isSuccess &&
              listContactsRequest.data &&
              !listContactsRequest.data
                .map((o) => o.user.address)
                .includes(field.value);

            return (
              <FormControl isInvalid={fieldState.invalid}>
                <Autocomplete
                  value={field.value}
                  label={`Recipient ${index + 1} address`}
                  onChange={field.onChange}
                  isLoading={!optionsRequests[index].isSuccess}
                  options={appliedOptions}
                  inView={inView}
                  clearable={false}
                  optionsRef={optionRef}
                  variant="dark"
                />
                <FormHelperText color="error.500">
                  {fieldState.error?.message}
                </FormHelperText>
                <AddToAddressBook
                  visible={showAddToAddressBook}
                  onAdd={() => handleOpenDialog?.({ address: field.value })}
                />
              </FormControl>
            );
          }}
        />
        <Controller
          name={`transactions.${index}.asset`}
          control={form.control}
          render={({ field, fieldState }) => (
            <AssetSelect
              isInvalid={fieldState.invalid}
              assets={assets!.assets!}
              nfts={assets!.nfts!}
              name={`transaction.${index}.asset`}
              value={field.value}
              onChange={(e) => {
                field.onChange(e);
                form.setValue(`transactions.${index}.amount`, bn(1).format());
              }}
              helperText={
                <FormHelperText
                  color={fieldState.invalid ? 'error.500' : 'grey.200'}
                >
                  {fieldState.error?.message ??
                    'Select the asset you want to send'}
                </FormHelperText>
              }
            />
          )}
        />
        <Controller
          name={`transactions.${index}.amount`}
          control={form.control}
          render={({ field, fieldState }) => {
            return (
              <FormControl>
                <AmountInput
                  placeholder=" "
                  value={isNFT ? '1' : field.value}
                  onChange={field.onChange}
                  isInvalid={fieldState.invalid}
                  isDisabled={!!isNFT}
                />
                <FormLabel color="gray">Amount</FormLabel>
                <FormHelperText>
                  {asset && (
                    <Text display="flex" alignItems="center">
                      Balance (available):{' '}
                      {isFeeCalcLoading ? (
                        <CircularProgress
                          trackColor="dark.100"
                          size={3}
                          isIndeterminate
                          color="brand.500"
                          ml={1}
                        />
                      ) : (
                        <>
                          {assets.getAssetInfo(asset)?.slug} {balanceAvailable}
                        </>
                      )}
                    </Text>
                  )}
                </FormHelperText>
                <FormHelperText color="error.500">
                  {fieldState.error?.message}
                </FormHelperText>
              </FormControl>
            );
          }}
        />
      </VStack>
    </>
  );
};

export { TransactionFormField };
