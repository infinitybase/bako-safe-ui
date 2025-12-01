import { Accordion, HStack, Image, Span, Text } from 'bako-ui';
import { memo, useCallback, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { ListContactsResponse } from '@/modules/addressBook/services';
import { AddressUtils } from '@/modules/core';
import { useBakoIDClient } from '@/modules/core/hooks/bako-id';
import { parseURI } from '@/modules/core/utils/formatter';
import {
  ITransactionForm,
  UseCreateTransaction,
} from '@/modules/transactions/hooks';
import { UseVaultDetailsReturn } from '@/modules/vault';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

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
}: RecipientItemProps) => {
  const { getFieldState, control } = useFormContext<ITransactionForm>();
  const {
    providerInstance,
    vaultDetails: {
      assets: { isNFTAsset, nfts },
    },
  } = useWorkspaceContext();
  const {
    handlers: { getResolverName },
  } = useBakoIDClient(providerInstance);

  const transaction = useWatch({ control, name: `transactions.${index}` });

  const assetInfo = useMemo(
    () =>
      isNFTAsset(transaction?.asset || '')
        ? nfts?.find((nft) => nft.assetId === transaction?.asset)
        : assets.getAssetInfo(transaction?.asset || ''),
    [assets, nfts, isNFTAsset, transaction?.asset],
  );

  const assetSlug = useMemo(() => {
    if (!assetInfo) return undefined;
    return 'slug' in assetInfo && assetInfo.slug
      ? assetInfo.slug
      : assetInfo.symbol;
  }, [assetInfo]);

  const fieldState = getFieldState(`transactions.${index}`);

  const resolvedLabel = useMemo(() => {
    const label = transaction?.resolvedLabel;
    return label?.startsWith('@') ? label?.split(' ')[0] : label;
  }, [transaction]);

  const hasEmptyField = useMemo(() => {
    return Object.entries(transaction || {})
      .filter(([key]) => key !== 'resolvedLabel')
      .some(([, value]) => value === '');
  }, [transaction]);

  const isCurrentAmountZero = useMemo(
    () => Number(transaction?.amount || 0) === 0,
    [transaction?.amount],
  );

  const isDisabled = useMemo(
    () => hasEmptyField || fieldState.invalid || isCurrentAmountZero,
    [hasEmptyField, fieldState.invalid, isCurrentAmountZero],
  );

  const contact = useMemo(
    () =>
      nicks.find((nick) => nick.user.address === transaction?.value)?.nickname,
    [nicks, transaction?.value],
  );

  const resolverName = getResolverName(transaction?.value || '');

  const recipientLabel = useMemo(() => {
    if (resolvedLabel?.startsWith('@')) {
      return resolvedLabel;
    }
    return (
      contact ?? resolverName ?? AddressUtils.format(transaction?.value || '')
    );
  }, [contact, resolverName, transaction?.value, resolvedLabel]);

  const isNFT = useMemo(
    () => isNFTAsset(transaction?.asset || ''),
    [isNFTAsset, transaction?.asset],
  );

  const handleCloseAccordion = useCallback(
    () => accordion.close(),
    [accordion],
  );

  const assetLogo = useMemo(() => {
    if (!assetInfo) return undefined;
    if ('icon' in assetInfo && assetInfo.icon) {
      return assetInfo.icon;
    }
    if ('image' in assetInfo && assetInfo.image) {
      return assetInfo.image;
    }
    return assetInfo.metadata?.image || assetInfo.metadata?.['image:png'];
  }, [assetInfo]);

  console.log(assetInfo);

  return (
    <Accordion.Item
      value={index.toString()}
      my={3}
      borderRadius="8px"
      bg="bg.muted"
    >
      <TransactionAccordion.Item
        title={`Recipient ${index + 1}`}
        assetLogo={
          <Image
            src={parseURI(assetLogo || '')}
            width="36px"
            height="36px"
            borderRadius="lg"
          />
        }
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
            <Text fontSize="xs" color="textSecondary" mt={2}>
              <Span color="textPrimary">
                {isNFT ? 'NFT' : transaction?.amount} {isNFT ? '' : assetSlug}
              </Span>{' '}
              to <Span color="textPrimary"> {recipientLabel}</Span>
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
    </Accordion.Item>
  );
};

export default memo(RecipientItem);
