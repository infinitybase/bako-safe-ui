import {
  Accordion,
  AccordionItem,
  Button,
  Center,
  CircularProgress,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { Address, bn, isB256 } from 'fuels';
import { useMemo } from 'react';
import { Controller } from 'react-hook-form';

import { AmountInput, Autocomplete, UserAddIcon } from '@/components';
import {
  AddToAddressBook,
  CreateContactDialog,
  useAddressBookAutocompleteOptions,
} from '@/modules/addressBook';
import {
  AddressUtils,
  AssetSelect,
  delay,
  NativeAssetId,
} from '@/modules/core';
import { useBakoIDClient } from '@/modules/core/hooks/bako-id';
import {
  useAssetSelectOptions,
  UseCreateTransaction,
} from '@/modules/transactions/hooks';
import { UseVaultDetailsReturn } from '@/modules/vault';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import { AddressBookUtils } from '@/utils';

import { TransactionAccordion } from './accordion';

interface TransactionAccordionProps {
  form: UseCreateTransaction['form'];
  nicks: UseCreateTransaction['nicks'];
  assets: UseVaultDetailsReturn['assets'];
  accordion: UseCreateTransaction['accordion'];
  transactions: UseCreateTransaction['transactionsFields'];
  isFeeCalcLoading: boolean;
  getBalanceAvailable: UseCreateTransaction['getBalanceAvailable'];
}

interface TransctionFormFieldProps {
  form: UseCreateTransaction['form'];
  index: number;
  assets: UseVaultDetailsReturn['assets'];
  isFeeCalcLoading: boolean;
  getBalanceAvailable: UseCreateTransaction['getBalanceAvailable'];
}

const TransactionFormField = (props: TransctionFormFieldProps) => {
  const { form, assets, index, isFeeCalcLoading, getBalanceAvailable } = props;

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
  } = useWorkspaceContext();
  const balanceAvailable = getBalanceAvailable();
  const {
    handlers: { fetchResolverName, fetchResolveAddress },
  } = useBakoIDClient(providerInstance);

  const setResolverAndHandle = (resolver?: string, handle?: string) => {
    form.setValue('resolver', resolver);
    form.setValue('handle', handle);

    return;
  };

  const { optionsRequests, optionRef } = useAddressBookAutocompleteOptions({
    workspaceId: workspaceId!,
    includePersonal: !userInfos.onSingleWorkspace,
    contacts: listContactsRequest.data!,
    fields: form.watch('transactions')!,
    errors: form.formState.errors.transactions,
    isUsingTemplate: false,
    isFirstLoading: false,
    dynamicCurrentIndex: index,
    canRepeatAddresses: true,
    setResolverAndHandle,
  });

  const recipients = form.watch('transactions') ?? [];
  const asset = recipients?.[index].asset;

  const isNFT = useMemo(() => isNFTAsset(asset), [asset, isNFTAsset]);

  const { assetsOptions } = useAssetSelectOptions({
    currentAsset: asset,
    assets: assets.assets,
    nfts: assets.nfts,
    recipients,
    getBalanceAvailable,
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

            return (
              <FormControl isInvalid={fieldState.invalid}>
                <Autocomplete
                  value={
                    form.watch(`transactions.${index}.resolvedLabel`) ||
                    field.value
                  }
                  label={`Recipient ${index + 1} address`}
                  ariaLabel={`Autocomplete Recipient Address ${index + 1}`}
                  onChange={field.onChange}
                  onInputChange={async (value: string) => {
                    const result = { value, label: value };
                    if (value.startsWith('@')) {
                      const address = await fetchResolveAddress.handler(
                        value.split(' - ').at(0)!,
                      );

                      if (address) {
                        result.value = address;
                        result.label = AddressBookUtils.formatForAutocomplete(
                          value,
                          address,
                        );
                        console.log('result.label:', result.label);
                      }
                    } else if (isB256(value)) {
                      const name = await fetchResolverName.handler(value);
                      if (name) {
                        result.label = AddressBookUtils.formatForAutocomplete(
                          name,
                          value,
                        );
                      }
                      result.value = new Address(value).toB256();
                    }

                    field.onChange(result.value);
                    form.setValue(
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
              options={assetsOptions}
              name={`transaction.${index}.asset`}
              value={field.value}
              onChange={(e) => {
                field.onChange(e);

                if (isNFTAsset(e)) {
                  form.setValue(`transactions.${index}.amount`, bn(1).format());
                  return;
                }

                if (isNFTAsset(field.value)) {
                  form.setValue(`transactions.${index}.amount`, '');
                }
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
                  id="transaction_amount"
                  placeholder=" "
                  value={isNFT ? '1' : field.value}
                  onChange={field.onChange}
                  isInvalid={fieldState.invalid}
                  isDisabled={isNFT}
                />
                <FormLabel color="gray">Amount</FormLabel>
                <FormHelperText>
                  {!isNFT && parseFloat(balanceAvailable) > 0 && asset && (
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

const TransactionAccordions = (props: TransactionAccordionProps) => {
  const {
    form,
    transactions,
    assets,
    accordion,
    nicks,
    isFeeCalcLoading,
    getBalanceAvailable,
  } = props;

  const {
    screenSizes: { isMobile },
    providerInstance,
    vaultDetails: {
      assets: { isNFTAsset },
    },
  } = useWorkspaceContext();

  const {
    handlers: { getResolverName },
  } = useBakoIDClient(providerInstance);

  // Logic to fix the button in the footer
  // const accordionHeight = () => {
  //   if (isMobile && isLargerThan900) return 500;
  //   if (isMobile && isLargerThan768) return 400;
  //   if (isMobile && isLargerThan660) return 220;
  //   if (isMobile && isLargerThan600) return 200;

  //   return 450;
  // };

  const isEth = NativeAssetId;
  const asset = assets.assets?.find((a) => a.assetId === isEth);
  const totalEth = asset?.amount ? bn(asset.amount).formatUnits() : 0;

  const { hasEthForFee } = useMemo(() => {
    let feeAlreadyAdded = false;

    const used = transactions.fields.reduce((acc, _, index) => {
      const transaction = form.watch(`transactions.${index}`);
      if (transaction.asset !== isEth) return acc;

      const amount = Number(transaction.amount || 0);
      let fee = 0;

      if (!feeAlreadyAdded) {
        fee = Number(transaction.fee || 0);
        feeAlreadyAdded = true;
      }

      return acc + amount + fee;
    }, 0);

    const hasEnough = Number(totalEth) >= Number(used.toFixed(9));

    return {
      totalEthUsed: used,
      hasEthForFee: hasEnough,
    };
  }, [transactions.fields, totalEth, form, isEth]);

  return (
    <Accordion
      index={accordion.index}
      overflowY="auto"
      pb={isMobile ? 10 : 0}
      maxH={450}
      pr={{ base: 1, sm: 0 }}
      sx={{
        '&::-webkit-scrollbar': {
          width: '5px',
          maxHeight: '330px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#2C2C2C',
          borderRadius: '30px',
          height: '10px',
        },
      }}
    >
      {transactions.fields.map((field, index) => {
        const transaction = form.watch(`transactions.${index}`);
        const assetSlug = assets.getAssetInfo(transaction.asset)?.slug;
        const fieldState = form.getFieldState(`transactions.${index}`);
        let resolvedLabel = form.watch(`transactions.${index}.resolvedLabel`);

        if (resolvedLabel?.startsWith('@')) {
          resolvedLabel = resolvedLabel?.split(' ')[0];
        }

        const hasEmptyField = Object.entries(transaction)
          .filter(([key]) => key !== 'resolvedLabel')
          .some(([, value]) => value === '');

        const currentAmount = form.watch(`transactions.${index}.amount`);
        const isCurrentAmountZero = Number(currentAmount) === 0;

        const isDisabled =
          hasEmptyField || fieldState.invalid || isCurrentAmountZero;

        const contact = nicks.find(
          (nick) => nick.user.address === transaction.value,
        )?.nickname;

        const resolverName = getResolverName(transaction.value);
        let recipientLabel =
          contact ?? resolverName ?? AddressUtils.format(transaction.value);

        if (resolvedLabel?.startsWith('@')) {
          recipientLabel = resolvedLabel;
        }

        const isNFT = isNFTAsset(transaction.asset);

        return (
          <AccordionItem
            key={field.id}
            mb={6}
            borderWidth={1}
            borderColor={
              !hasEthForFee &&
              transaction.asset === isEth &&
              !isCurrentAmountZero
                ? 'red.500'
                : 'grey.925'
            }
            borderRadius={10}
            backgroundColor="dark.950"
          >
            <TransactionAccordion.Item
              title={`Recipient ${index + 1}`}
              actions={
                <TransactionAccordion.Actions>
                  <HStack spacing={4}>
                    <TransactionAccordion.EditAction
                      onClick={() => accordion.open(index)}
                    />
                    <TransactionAccordion.DeleteAction
                      isDisabled={props.transactions.fields.length === 1}
                      onClick={() => {
                        transactions.remove(index);
                        accordion.close();
                      }}
                    />
                  </HStack>
                  <TransactionAccordion.ConfirmAction
                    onClick={() => accordion.close()}
                    isDisabled={isDisabled}
                    isLoading={!isCurrentAmountZero ? isFeeCalcLoading : false}
                  />
                </TransactionAccordion.Actions>
              }
              resume={
                !hasEmptyField && (
                  <Text fontSize="sm" color="grey.500" mt={2}>
                    <b>
                      {isNFT ? 'NFT' : transaction.amount}{' '}
                      {isNFT ? '' : assetSlug}
                    </b>{' '}
                    to <b> {recipientLabel}</b>
                  </Text>
                )
              }
            >
              <TransactionFormField
                index={index}
                form={form}
                assets={assets}
                isFeeCalcLoading={isFeeCalcLoading}
                getBalanceAvailable={getBalanceAvailable}
              />
            </TransactionAccordion.Item>
          </AccordionItem>
        );
      })}
      <Center mt={6} flexDirection="column" w="full">
        {!hasEthForFee ? (
          <Text
            color="error.500"
            fontSize="sm"
            w="full"
            textAlign="center"
            mt={2}
          >
            Insufficient funds for gas
          </Text>
        ) : (
          <Tooltip
            label="All available assets have been used."
            isDisabled={!form.allAssetsUsed}
            hasArrow
            placement="top"
          >
            <Button
              w="full"
              leftIcon={<UserAddIcon />}
              variant="primary"
              bgColor="grey.200"
              border="none"
              _hover={{
                opacity: 0.8,
              }}
              _disabled={{
                cursor: 'not-allowed',
                opacity: 0.6,
              }}
              isDisabled={form.allAssetsUsed}
              onClick={() => {
                transactions.append({
                  amount: '',
                  asset: NativeAssetId,
                  value: '',
                });
                delay(() => accordion.open(transactions.fields.length), 100);
              }}
            >
              Add more recipients
            </Button>
          </Tooltip>
        )}
      </Center>
    </Accordion>
  );
};

export { TransactionAccordions };
