import { ITransactionResume, TransactionStatus } from 'bakosafe';
import { bn } from 'fuels';

import {
  BridgeIcon,
  DownLeftArrowGreen,
  LiquidStakeIcon,
  SwapIcon,
  UpRightArrowYellow,
} from '@/components';
import { ContractIcon } from '@/components/icons/tx-contract';
import { DeployIcon } from '@/components/icons/tx-deploy';

import { ITransaction } from '../core/hooks/bakosafe/utils/types';
import {
  AssetModel,
  TransactionStatusWithOnOffRamp,
  WitnessStatus,
} from '../core/models';
import { NativeAssetId } from '../core/utils';

const { REJECTED, DONE, PENDING, CANCELED } = WitnessStatus;

export interface TransactionStatusParams {
  account: string;
  resume: ITransactionResume;
  status: TransactionStatus | TransactionStatusWithOnOffRamp;
}

/* TODO: Fix this to use bako safe SDK */
export const transactionStatus = ({
  resume,
  account,
  ...transaction
}: TransactionStatusParams) => {
  const { requiredSigners, totalSigners, witnesses } = resume;
  const minSigners = requiredSigners;
  const vaultMembersCount = totalSigners;
  const signatureCount =
    witnesses.filter((w) => w.status === WitnessStatus.DONE).length ?? 0;
  const witness = witnesses?.find((t) => t.account === account);
  const howManyDeclined =
    witnesses.filter((w) => w.status === WitnessStatus.REJECTED).length ?? 0;

  return {
    isCompleted:
      signatureCount >= minSigners ||
      transaction.status === TransactionStatus.SUCCESS,
    isDeclined: witness?.status === REJECTED,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    isSigned: [DONE, CANCELED].includes(witness?.status),
    isPending: witness?.status !== PENDING,
    isReproved: vaultMembersCount - howManyDeclined < minSigners,
    isError: transaction.status === TransactionStatus.FAILED,
    isCanceled: transaction.status === TransactionStatus.CANCELED,
    isPendingProvider:
      transaction.status === TransactionStatusWithOnOffRamp.PENDING_PROVIDER,
  };
};

export interface WaitingSignaturesParams {
  account: string;
  transactions: ITransaction[];
}

export const waitingSignatures = ({
  account,
  transactions,
}: WaitingSignaturesParams) => {
  return transactions.filter((transaction) => {
    const { isCompleted, isSigned, isDeclined, isReproved } = transactionStatus(
      {
        resume: transaction.resume,
        account,
        status: transaction.status,
      },
    );

    return !isSigned && !isDeclined && !isCompleted && !isReproved;
  }).length;
};

export const sumEthAsset = (assets: AssetModel[]) =>
  assets
    .filter((a) => a.assetId === NativeAssetId)
    .reduce((total, asset) => total.add(bn.parseUnits(asset.amount)), bn(0))
    .format();

export const expectedCommonErrorMessage = 'not enough coins to fit the target';

export const generateTransactionName = () => {
  let transactionName = 'Transaction #';
  for (let i = 0; i < 5; i++) {
    const randomInt = Math.floor(Math.random() * 10);
    transactionName += randomInt.toString();
  }
  return transactionName;
};

export const getTransactionIconComponent = ({
  isDeploy,
  isFromConnector,
  isFromCLI,
  isDeposit,
  isSwap,
  isLiquidStake,
  isBridge,
}: {
  isDeploy: boolean;
  isFromConnector: boolean;
  isFromCLI: boolean;
  isDeposit: boolean;
  isSwap: boolean;
  isLiquidStake: boolean;
  isBridge: boolean;
}) => {
  if (isSwap) return SwapIcon;
  if (isDeploy) return DeployIcon;
  if (isLiquidStake) return LiquidStakeIcon;
  if (isBridge) return BridgeIcon;
  if (isFromConnector || isFromCLI) return ContractIcon;
  if (isDeposit) return DownLeftArrowGreen;
  return UpRightArrowYellow;
};
