import { useBoolean } from '@chakra-ui/react';
import { BSAFEConnectorEvents, Vault } from 'bsafe';
import { TransactionRequestLike } from 'fuels';
import { useState } from 'react';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { useQueryParams } from '@/modules/auth/hooks';
import { useDidMountEffect, UserTypes, useSocket } from '@/modules/core/hooks';
import { useTransactionSummary } from '@/modules/dapp/hooks/useTransactionSummary';
import { TransactionService } from '@/modules/transactions/services';
const { ACCESS_TOKEN, ADDRESS } = CookieName;

export const useTransactionSocket = () => {
  const [confirmingTransaction, confirmingTransctionHandlers] = useBoolean();

  const { connect, emitMessage } = useSocket();
  const { sessionId, origin, name } = useQueryParams();
  const [vault, setVault] = useState<Vault>();
  const [FUELTransaction, setFUELTransaction] =
    useState<TransactionRequestLike>();
  const summary = useTransactionSummary();
  const [pendingTx, setPendingTx] = useState<boolean>(false);

  const callbacks: { [key: string]: (data: any) => void } = {
    // eslint-disable-next-line prettier/prettier
    message: async (params: any) => {
      const { type, data } = params;
      const { address, transaction } = data;
      // console.log('[TRANSACTION_REQUESTED]: ', {
      //   data,
      //   type,
      // });
      if (type === BSAFEConnectorEvents.TRANSACTION_SEND) {
        const bsafeVault = await Vault.create({
          predicateAddress: address,
          token: CookiesConfig.getCookie(ACCESS_TOKEN)!,
          address: CookiesConfig.getCookie(ADDRESS)!,
        });
        //console.log('[VAULT]: ', bsafeVault);
        summary.getTransactionSummary({
          providerUrl: bsafeVault.provider.url,
          transactionLike: transaction,
        });
        const { transactionsBlocked } =
          await TransactionService.getTransactionsSignaturePending([
            bsafeVault?.BSAFEVaultId,
          ]);
        setPendingTx(transactionsBlocked ?? false);
        setVault(bsafeVault);
        setFUELTransaction(transaction);
      }
    },
  };

  useDidMountEffect(() => {
    connect({
      username: sessionId!,
      param: UserTypes.POPUP_TRANSFER,
      sessionId: sessionId!,
      origin: origin!,
      callbacks,
    });
  }, [callbacks, connect, origin, sessionId]);

  const confirmTransaction = async () => {
    confirmingTransctionHandlers.on();

    const tx = await vault?.BSAFEIncludeTransaction(FUELTransaction!);
    //console.log('[CONFIRM_TRANSACTION]: ', FUELTransaction);
    //console.log('[TRANSACTION_TX]: ', tx);
    if (!tx) return;
    //console.log('[enviando mensagem]');
    emitMessage({
      event: BSAFEConnectorEvents.TRANSACTION_CREATED,
      content: {
        sessionId: sessionId!,
        address: CookiesConfig.getCookie(ADDRESS)!,
        origin: origin!,
        hash: tx.getHashTxId()!,
        operations: summary.transactionSummary?.operations ?? {},
      },
      to: `${sessionId!}:${origin!}`,
      callback: () => {
        confirmingTransctionHandlers.off();
        window.close();
      },
    });
    return;
  };

  const cancelTransaction = () => window.close();

  const init = () => {
    return;
  };

  return {
    init,
    vault,
    summary,
    FUELTransaction,
    confirmTransaction,
    pendingSignerTransactions: pendingTx,
    cancelTransaction,
    connection: {
      name,
      origin,
    },
    confirmingTransaction,
  };
};
