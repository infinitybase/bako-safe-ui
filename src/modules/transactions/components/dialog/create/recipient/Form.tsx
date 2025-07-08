import { CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  IconButton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Address, bn, isB256 } from 'fuels';
import { memo, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { AmountInput, Autocomplete } from '@/components';
import {
  AddToAddressBook,
  CreateContactDialog,
  useAddressBookAutocompleteOptions,
} from '@/modules/addressBook';
import { AddressUtils, AssetSelect } from '@/modules/core';
import { useBakoIDClient } from '@/modules/core/hooks/bako-id';
import {
  ITransactionForm,
  useAssetSelectOptions,
  UseCreateTransaction,
} from '@/modules/transactions/hooks';
import { UseVaultDetailsReturn } from '@/modules/vault';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import { AddressBookUtils } from '@/utils';

interface RecipientFormFieldProps {
  index: number;
  assets: UseVaultDetailsReturn['assets'];
  isFeeCalcLoading: boolean;
  getBalanceAvailable: UseCreateTransaction['getBalanceAvailable'];
}

const RecipientFormField = (props: RecipientFormFieldProps) => {
  const { assets, index, isFeeCalcLoading, getBalanceAvailable } = props;
  const { setValue, watch, formState, control } =
    useFormContext<ITransactionForm>();

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

  const setResolverAndHandle = (resolver?: string, handle?: string) => {
    setValue('resolver', resolver);
    setValue('handle', handle);

    return;
  };

  const transactions = watch('transactions') ?? [];

  const { optionsRequests, optionRef } = useAddressBookAutocompleteOptions({
    workspaceId: workspaceId!,
    includePersonal: !userInfos.onSingleWorkspace,
    contacts: listContactsRequest.data!,
    fields: transactions,
    errors: formState.errors.transactions,
    isUsingTemplate: false,
    isFirstLoading: false,
    dynamicCurrentIndex: index,
    canRepeatAddresses: true,
    setResolverAndHandle,
  });

  const recipients = watch('transactions') ?? [];
  const asset = recipients?.[index].asset;

  const isNFT = useMemo(() => isNFTAsset(asset), [asset, isNFTAsset]);

  const { assetsOptions } = useAssetSelectOptions({
    currentAsset: asset,
    assets: assets.assets,
    nfts: assets.nfts,
    recipients,
    getBalanceAvailable,
  });

  const getAssetPrice = (assetId: string) => {
    return tokensUSD.data?.[assetId]?.usdAmount ?? 0;
  };

  const formatUsdEstimate = (amount: string, assetId: string) => {
    if (!amount || !assetId) return '$0.00';
    const price = getAssetPrice(assetId);
    const estimated = parseFloat(amount) * price;

    return estimated.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

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
          render={({ field, fieldState }) => {
            const labelPath = `transactions.${index}.resolvedLabel` as const;
            let inputValue = '';

            if (watch(labelPath)?.startsWith('@')) {
              inputValue = watch(labelPath) ?? '';
            } else {
              inputValue = field.value;
            }

            const appliedOptions = optionsRequests[index].options.filter(
              (a) => Address.fromString(a.value).toString() !== field.value,
            );

            const showAddToAddressBook =
              canAddMember &&
              !fieldState.invalid &&
              AddressUtils.isValid(field.value) &&
              optionsRequests[index].isSuccess &&
              listContactsRequest.data &&
              !listContactsRequest.data
                .map((o) => Address.fromString(o.user.address).toString())
                .includes(
                  isB256(field.value)
                    ? Address.fromString(field.value).toString()
                    : field.value,
                );

            const handleClear = () => {
              field.onChange('');
              setValue(labelPath, '');
            };

            return (
              <HStack
                align="start"
                spacing={2}
                position="relative"
                width="100%"
              >
                <FormControl isInvalid={fieldState.invalid} flex="1">
                  <Box position="relative">
                    <Autocomplete
                      label={`Recipient ${index + 1} address`}
                      ariaLabel={`Autocomplete Recipient Address ${index + 1}`}
                      value={inputValue}
                      onChange={field.onChange}
                      onInputChange={async (value: string) => {
                        const result = { value, label: value };

                        if (value.startsWith('@')) {
                          const address = await fetchResolveAddress.handler(
                            value.split(' - ').at(0)!,
                          );

                          if (address) {
                            result.value = address;
                            result.label =
                              AddressBookUtils.formatForAutocomplete(
                                value,
                                address,
                              );
                          }
                        } else if (isB256(value)) {
                          const name = await fetchResolverName.handler(value);
                          if (name) {
                            result.label =
                              AddressBookUtils.formatForAutocomplete(
                                name,
                                value,
                              );
                          }
                          result.value = new Address(value).toB256();
                        }

                        field.onChange(result.value);
                        setValue(
                          `transactions.${index}.resolvedLabel`,
                          result.label,
                        );
                        return result;
                      }}
                      isLoading={
                        !optionsRequests[index].isSuccess ||
                        fetchResolveAddress.isLoading ||
                        fetchResolverName.isLoading
                      }
                      options={appliedOptions}
                      inView={inView}
                      clearable
                      optionsRef={optionRef}
                      variant="dark"
                    />
                    {field.value && (
                      <IconButton
                        aria-label="Clear"
                        icon={<CloseIcon boxSize={2.5} />}
                        size="xs"
                        variant="ghost"
                        position="absolute"
                        top="50%"
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
                        onClick={handleClear}
                      />
                    )}
                  </Box>
                  <FormHelperText color="error.500">
                    {fieldState.error?.message}
                  </FormHelperText>
                  <AddToAddressBook
                    visible={showAddToAddressBook}
                    onAdd={() => handleOpenDialog?.({ address: field.value })}
                  />
                </FormControl>
              </HStack>
            );
          }}
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
                                {assets.getAssetInfo(asset)?.slug}{' '}
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
          render={({ field, fieldState }) => {
            const usdEstimate = formatUsdEstimate(
              field.value,
              watch(`transactions.${index}.asset`),
            );
            const usdNumber = parseFloat(usdEstimate.replace(/[^\d.-]/g, ''));

            return (
              <HStack
                align="start"
                spacing={2}
                position="relative"
                width="100%"
              >
                <FormControl variant="floating" isInvalid={fieldState.invalid}>
                  <Box position="relative">
                    <AmountInput
                      placeholder=" "
                      value={isNFT ? '1' : field.value}
                      onFocus={() => {
                        if (field.value === '.00' || field.value === '0.00') {
                          field.value = '';
                        }
                      }}
                      onChange={field.onChange}
                      isInvalid={fieldState.invalid}
                      isDisabled={isNFT}
                    />
                    <FormLabel data-testid="transaction_amount">
                      Amount
                    </FormLabel>

                    <FormHelperText
                      pl={4}
                      color={fieldState.invalid ? 'error.500' : 'gray.400'}
                    >
                      {fieldState.error?.message ? (
                        <Text fontSize="sm" lineHeight="short">
                          {fieldState.error.message}
                        </Text>
                      ) : !isNFT ? (
                        <Text
                          fontSize="sm"
                          lineHeight="short"
                          color="grey.425"
                          opacity={usdNumber > 0 ? 1 : 0}
                        >
                          ~ {usdEstimate}
                        </Text>
                      ) : null}
                    </FormHelperText>

                    {!isNFT && (
                      <HStack
                        position="absolute"
                        top="35%"
                        right="0.75rem"
                        spacing={1}
                        zIndex={1}
                        bg="grey.825"
                        transform="translateY(-50%)"
                      >
                        <IconButton
                          aria-label="Clear"
                          icon={<CloseIcon boxSize={2.5} />}
                          size="xs"
                          variant="ghost"
                          color={'white'}
                          padding={4}
                          bg="grey.825"
                          _hover={{ bg: 'grey.825' }}
                          zIndex={1}
                          onClick={() => field.onChange('')}
                        />
                        <Button
                          size="xs"
                          bg="transparent"
                          border="1px solid "
                          borderColor="white"
                          borderRadius="md"
                          color={'white'}
                          fontWeight="bold"
                          pt={1}
                          _hover={{
                            bg: 'grey.900',
                          }}
                          _active={{
                            bg: 'grey.850',
                          }}
                          isDisabled={isFeeCalcLoading}
                          onClick={() => {
                            const max = getBalanceAvailable();
                            field.onChange(max);
                          }}
                        >
                          MAX
                        </Button>
                      </HStack>
                    )}
                  </Box>
                </FormControl>
              </HStack>
            );
          }}
        />
      </VStack>
    </>
  );
};

export default memo(RecipientFormField);
