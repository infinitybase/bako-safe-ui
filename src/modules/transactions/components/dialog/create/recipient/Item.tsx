import { AccordionItem, HStack, Text } from '@chakra-ui/react';
import { memo, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

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
}: RecipientItemProps) => {
  const { watch, getFieldState } = useFormContext<ITransactionForm>();
  const { providerInstance } = useWorkspaceContext();
  const {
    handlers: { getResolverName },
  } = useBakoIDClient(providerInstance);
  const transaction = watch(`transactions.${index}`);
  const assetSlug = assets.getAssetInfo(transaction.asset)?.slug;
  const fieldState = getFieldState(`transactions.${index}`);

  const hasEmptyField = Object.values(transaction).some(
    (value) => value === '',
  );

  const currentAmount = watch(`transactions.${index}.amount`);
  const isCurrentAmountZero = Number(currentAmount) === 0;

  const isDisabled = hasEmptyField || fieldState.invalid || isCurrentAmountZero;

  const contact = useMemo(
    () =>
      nicks.find((nick) => nick.user.address === transaction.value)?.nickname,
    [nicks, transaction.value],
  );

  const resolverName = getResolverName(transaction.value);
  const recipientLabel =
    contact ?? resolverName ?? AddressUtils.format(transaction.value);

  return (
    <AccordionItem
      mb={6}
      borderWidth={1}
      borderColor="grey.925"
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
                isDisabled={isFirstField}
                onClick={() => {
                  onDelete(index);
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
                {transaction.amount} {assetSlug}
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
