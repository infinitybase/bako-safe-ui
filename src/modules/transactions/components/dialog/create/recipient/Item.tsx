import { AccordionItem, HStack, Text } from '@chakra-ui/react';
import { memo, useCallback, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { ListContactsResponse } from '@/modules/addressBook/services';
import { AddressUtils } from '@/modules/core';
import { useBakoIDClient } from '@/modules/core/hooks/bako-id';
import {
  ITransactionForm,
  UseCreateTransaction,
} from '@/modules/transactions/hooks';
import { UseVaultDetailsReturn } from '@/modules/vault';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { TransactionAccordion } from '../accordion';
import { Recipient } from './index';

interface RecipientItemProps {
  index: number;
  assets: UseVaultDetailsReturn['assets'];
  nicks: ListContactsResponse;
  isFirstField: boolean;
  onDelete: (index: number) => void;
  accordion: UseCreateTransaction['accordion'];
  isFeeCalcLoading: boolean;
  getBalanceAvailable: UseCreateTransaction['getBalanceAvailable'];
  hasEthForFee: boolean;
  ethAssetId: string | undefined;
}

const RecipientItem = ({
  index,
  assets,
  nicks,
  isFirstField,
  onDelete,
  accordion,
  isFeeCalcLoading,
  getBalanceAvailable,
  hasEthForFee,
  ethAssetId,
}: RecipientItemProps) => {
  const { getFieldState, control } = useFormContext<ITransactionForm>();
  const {
    providerInstance,
    vaultDetails: {
      assets: { isNFTAsset },
    },
  } = useWorkspaceContext();
  const {
    handlers: { getResolverName },
  } = useBakoIDClient(providerInstance);

  const transaction = useWatch({ control, name: `transactions.${index}` });

  const assetSlug = useMemo(
    () => assets.getAssetInfo(transaction.asset)?.slug,
    [assets, transaction.asset],
  );

  const fieldState = getFieldState(`transactions.${index}`);

  const resolvedLabel = useMemo(() => {
    const label = transaction.resolvedLabel;
    return label?.startsWith('@') ? label?.split(' ')[0] : label;
  }, [transaction]);

  const hasEmptyField = useMemo(() => {
    return Object.entries(transaction)
      .filter(([key]) => key !== 'resolvedLabel')
      .some(([, value]) => value === '');
  }, [transaction]);

  const isCurrentAmountZero = useMemo(
    () => Number(transaction.amount) === 0,
    [transaction.amount],
  );

  const isDisabled = useMemo(
    () => hasEmptyField || fieldState.invalid || isCurrentAmountZero,
    [hasEmptyField, fieldState.invalid, isCurrentAmountZero],
  );

  const contact = useMemo(
    () =>
      nicks.find((nick) => nick.user.address === transaction.value)?.nickname,
    [nicks, transaction.value],
  );

  const resolverName = getResolverName(transaction.value);

  const recipientLabel = useMemo(() => {
    if (resolvedLabel?.startsWith('@')) {
      return resolvedLabel;
    }
    return contact ?? resolverName ?? AddressUtils.format(transaction.value);
  }, [contact, resolverName, transaction.value, resolvedLabel]);

  const isNFT = useMemo(
    () => isNFTAsset(transaction.asset),
    [isNFTAsset, transaction.asset],
  );

  const handleCloseAccordion = useCallback(
    () => accordion.close(),
    [accordion],
  );

  return (
    <AccordionItem
      value={index.toString()}
      mb={6}
      borderWidth={1}
      borderColor={
        !hasEthForFee &&
        transaction.asset === ethAssetId &&
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
            <HStack gap={4}>
              <TransactionAccordion.EditAction
                onClick={() => accordion.open(index)}
              />
              <TransactionAccordion.DeleteAction
                disabled={isFirstField}
                onClick={() => {
                  onDelete(index);
                  handleCloseAccordion();
                }}
              />
            </HStack>
            <TransactionAccordion.ConfirmAction
              onClick={() => handleCloseAccordion()}
              disabled={isDisabled}
              loading={!isCurrentAmountZero ? isFeeCalcLoading : false}
            />
          </TransactionAccordion.Actions>
        }
        resume={
          !hasEmptyField && (
            <Text fontSize="sm" color="grey.500" mt={2}>
              <b>
                {isNFT ? 'NFT' : transaction.amount} {isNFT ? '' : assetSlug}
              </b>{' '}
              to <b> {recipientLabel}</b>
            </Text>
          )
        }
      >
        <Recipient.Form
          index={index}
          assets={assets}
          isFeeCalcLoading={isFeeCalcLoading}
          getBalanceAvailable={getBalanceAvailable}
        />
      </TransactionAccordion.Item>
    </AccordionItem>
  );
};

export default memo(RecipientItem);
