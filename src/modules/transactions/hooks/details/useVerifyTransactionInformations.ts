import { TransactionStatus, TransactionType } from 'bakosafe';
import { TransactionUI } from '../../components/TransactionCard/Details';
import { TransactionWithVault } from '../../services';
import { IFuelTransactionNames } from '@/modules/dapp/services';
import { Address, bn } from 'fuels';
import { useGetTokenInfos } from '@/modules';

const useVerifyTransactionInformations = (
  transaction: TransactionUI | TransactionWithVault,
) => {
  const mainOperation = transaction?.summary?.operations?.[0];
  mainOperation?.to?.address;

  const isFromConnector = transaction.summary?.type === 'connector';
  const isDeploy = transaction.type === TransactionType.TRANSACTION_CREATE;
  const isDeposit = transaction.type === TransactionType.DEPOSIT;
  const isContract =
    (mainOperation?.name as unknown as IFuelTransactionNames) ===
    IFuelTransactionNames.CONTRACT_CALL;

  const hasToken = !!mainOperation?.assetsSent?.length;
  const isPending = transaction.status === TransactionStatus.AWAIT_REQUIREMENTS;

  const contractAddress = isContract
    ? Address.fromB256(mainOperation?.to?.address ?? '').toString()
    : '';
  const contractAmount = bn(transaction.txData.inputs[1]?.['amount']).format();
  const contractAssetId = transaction.txData.inputs[1]?.['assetId'];

  const contractAssetInfo = useGetTokenInfos({
    assetId: contractAssetId,
    amount: contractAmount,
  });

  return {
    mainOperation,
    isFromConnector,
    isDeploy,
    isDeposit,
    isContract,
    hasToken,
    isPending,
    contractAddress,
    contractAssetInfo,
  };
};

export { useVerifyTransactionInformations };
