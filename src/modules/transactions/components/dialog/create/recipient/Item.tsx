import { AccordionItem, HStack, Text } from '@chakra-ui/react';
import { memo } from 'react';
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
  hasEthForFee:boolean;
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
  ethAssetId
}: RecipientItemProps) => {
  const { watch, getFieldState } = useFormContext<ITransactionForm>();
  const {
    providerInstance,
    vaultDetails: {
      assets: { isNFTAsset },
    },
  } = useWorkspaceContext();
  const {
    handlers: { getResolverName },
  } = useBakoIDClient(providerInstance);
  const transaction = watch(`transactions.${index}`);
  const assetSlug = assets.getAssetInfo(transaction.asset)?.slug;
  const fieldState = getFieldState(`transactions.${index}`);
  let resolvedLabel = watch(`transactions.${index}.resolvedLabel`);

  if (resolvedLabel?.startsWith('@')) {
    resolvedLabel = resolvedLabel?.split(' ')[0];
  }
  const hasEmptyField = Object.entries(transaction)
    .filter(([key]) => key !== 'resolvedLabel')
    .some(([, value]) => value === '');

  const currentAmount = watch(`transactions.${index}.amount`);
  const isCurrentAmountZero = Number(currentAmount) === 0;

  const isDisabled = hasEmptyField || fieldState.invalid || isCurrentAmountZero;
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
    key={index}
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
