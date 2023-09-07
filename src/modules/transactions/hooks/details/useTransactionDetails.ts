import { FuelWalletLocked } from '@fuel-wallet/sdk';
import { Address } from 'fuels';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { GetPredicateResponse, useFuelAccount } from '@/modules';
import { NativeAssetId, SignatureUtils, useFuel } from '@/modules/core';
import { useTransactionDetailRequest } from '@/modules/transactions/hooks/details/useTransactionDetailRequest.ts';
import { useSignTransaction } from '@/modules/transactions/hooks/signature';
import { GetTransactionResponse } from '@/modules/transactions/services';
import { useVaultDetailsRequest } from '@/modules/vault';

/*
 * verifica o status de assinaturas
 * TODO: Refactor
 * */
const getTransacionData = (
  transaction: GetTransactionResponse,
  predicate: GetPredicateResponse,
  wallet: FuelWalletLocked,
) => {
  if (!transaction) return;

  const signers_done: (string | Address)[] = [];
  transaction?.witnesses?.map((item) => {
    const _signers = SignatureUtils.recoverSignerAddress(
      item,
      `${transaction.hash}`,
    );
    if (_signers) {
      signers_done.push(_signers.toString());
    }
  });
  const signers = JSON.parse(predicate.configurable).SIGNERS.filter(
    (item: string) => item != NativeAssetId.toString(),
  );

  const transfers = transaction.assets.map((item) => {
    return item;
  });

  const fuelRedirect = `https://fuellabs.github.io/block-explorer-v2/transaction/0x${
    transaction.hash
  }?providerUrl=${encodeURIComponent(predicate.network)}`;

  const currentWallet = wallet;

  const isSigner =
    signers.length > 0 &&
    signers.filter((item: any) => {
      return (
        Address.fromB256(item).toString() == currentWallet.address.toString()
      );
    }).length > 0;

  return {
    signers:
      signers.length > 0 &&
      signers.map((item: any) => {
        const account_string = Address.fromB256(item).toString();
        return {
          address: account_string,
          signed: signers_done.includes(account_string),
        };
      }),
    assigned:
      signers_done.length > 0 &&
      signers_done.filter(
        (item: any) => currentWallet.address.toString() == item,
      ).length > 0,
    transfers,
    minSigners:
      Number(JSON.parse(predicate.configurable).SIGNATURES_COUNT) || 0,
    totalSigners: signers_done.length || 0,
    isDone: transaction.status == 'DONE' || false,
    fuelRedirect,
    isSigner: isSigner,
  };
};

type TransactionData = ReturnType<typeof getTransacionData>;

const useTransactionDetails = () => {
  const navigate = useNavigate();
  const params = useParams<{ vaultId: string; transactionId: string }>();

  const [transactionData, setTransactionData] =
    useState<TransactionData | null>(null);

  const [fuel] = useFuel();
  const { account } = useFuelAccount();

  const transactionDetailRequest = useTransactionDetailRequest(
    params.transactionId!,
  );
  const vaultDetailsRequest = useVaultDetailsRequest(params.vaultId!);
  const signTransaction = useSignTransaction();

  useEffect(() => {
    const findTransactionData = async () => {
      const transacionData = getTransacionData(
        transactionDetailRequest.data!,
        vaultDetailsRequest.predicate!,
        await fuel.getWallet(account),
      );

      setTransactionData(transacionData);
    };

    findTransactionData();
  }, [
    account,
    fuel,
    transactionDetailRequest.data,
    vaultDetailsRequest.predicate,
  ]);

  return {
    params,
    navigate,
    transactionData,
    signTransaction: {
      sign: {
        isLoading: signTransaction.signMessageRequest.isLoading,
        execute: signTransaction.signMessageRequest.mutate,
      },
      request: signTransaction.request,
    },
    vaultDetailsRequest,
    transactionDetailRequest,
  };
};

export { useTransactionDetails };
