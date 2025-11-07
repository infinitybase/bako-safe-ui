import type {
  AddressType,
  CallResult,
  ChainName,
  CoinTransactionRequestInput,
  CoinTransactionRequestOutput,
  InputContract,
  Operation,
  OutputContract,
  OutputContractCreated,
  Receipt,
  TransactionRequest,
  TransactionRequestInput,
  TransactionRequestLike,
  TransactionResult,
  TransactionResultReceipt,
  TransactionSummary,
} from 'fuels';
import { BN, OperationName, ReceiptType } from 'fuels';

type ParsedReceiptData = {
  indent: number;
  arrow: string;
  type: number;
  data: TransactionResultReceipt;
};

export enum TxCategory {
  SEND = 'send',
  RECEIVE = 'receive',
  CONTRACTCALL = 'contractcall',
  SCRIPT = 'script',
  PREDICATE = 'predicate',
  CONTRACTCREATED = 'contractcreated',
  ROUNDEDTRIP = 'roundedtrip',
}

export type TxRecipientAddress = {
  address: string;
  type: AddressType;
};

export type TxRequest = TransactionRequestLike;
export type TxSimulateResult = CallResult;
export type TxInput = TransactionRequestInput;
export type TxInputCoin = CoinTransactionRequestInput;
export type TxInputContract = InputContract;
export type TxOutputCoin = CoinTransactionRequestOutput;
export type TxOutputContract = OutputContract;
export type TxOutputContractCreated = OutputContractCreated;

export type TransactionCursor = {
  address: string;
  size: number;
  providerUrl: string;
  endCursor: string;
};

export enum OperationDirection {
  to = 'To',
  from = 'From',
  unknown = 'Unknown',
}

export type ContractCallMetadata = {
  depth?: number;
};

export type SimplifiedAddress = {
  chain: ChainName | undefined;
  address: string;
  type: number; // 0 for contract, 1 for account
};

export type SimplifiedAsset = {
  amount: BN;
  assetId: string;
}

export type SimplifiedOperation = {
  type: TxCategory;
  from: SimplifiedAddress;
  to: SimplifiedAddress;
  isFromCurrentAccount?: boolean;
  isToCurrentAccount?: boolean;
  assets?: Array<SimplifiedAsset>;
  assetsToFrom?: Array<SimplifiedAsset>;
  metadata: ContractCallMetadata;
  receipts?: Receipt[];
  operations?: SimplifiedOperation[];
};

export type SimplifiedFee = {
  total: BN;
  network: BN;
  tip?: BN;
  gasUsed?: BN;
  gasPrice?: BN;
};

export type CategorizedOperations = {
  mainOperations: SimplifiedOperation[];
  intermediateContractCalls: SimplifiedOperation[];
  notRelatedToCurrentAccount: SimplifiedOperation[];
};

export type SimplifiedTransaction = {
  id: string;
  operations: SimplifiedOperation[];
  categorizedOperations: CategorizedOperations;
  fee: SimplifiedFee;
};

export interface AssetFlow {
  assetId: string;
  amount: BN;
  from: string;
  to: string;
}

function getOperationType(operation: Operation): TxCategory {
  const { name } = operation;

  switch (name) {
    case OperationName.transfer:
      return operation.to ? TxCategory.SEND : TxCategory.RECEIVE;
    case OperationName.contractCall:
      return TxCategory.CONTRACTCALL;
    case OperationName.contractCreated:
      return TxCategory.CONTRACTCREATED;
    default:
      return TxCategory.SEND;
  }
}

function parseReceipts(receipts: Receipt[]) {
  try {
    if (!receipts) return [];
    let indent = 0;
    const flow = [];
    for (const [index, item] of receipts.entries()) {
      const type = item.type;
      const previousItem = receipts[index - 1] || {};
      if (
        previousItem.type !== ReceiptType.Return &&
        type === ReceiptType.ScriptResult
      )
        indent = 0;
      const arrow = `${'-'.repeat(indent + 1)}>`;
      flow.push({ indent, arrow, type, data: item });
      if ([ReceiptType.Call, ReceiptType.Return].includes(type)) indent++;
      if ([ReceiptType.ReturnData].includes(type) && indent > 0) indent--;
    }
    return flow;
  } catch (error) {
    console.error('Error parsing receipts', error);
    return [];
  }
}

function transformOperation(
  operation: Operation,
  currentAccount?: string,
  parsedReceipts?: ParsedReceiptData[],
): SimplifiedOperation {
  const { from, to, assetsSent = [] } = operation;

  const operationReceipt = (operation as Operation & { receipts?: Receipt[] })
    .receipts?.[0]; // Needed while fuels types are not updated

  const operationType = getOperationType(operation);
  const baseOperation = {
    type: operationType,
    from: from ? { address: from.address, type: from.type } : undefined,
    to: to ? { address: to.address, type: to.type } : undefined,
    isFromCurrentAccount: currentAccount
      ? from?.address.toLowerCase() === currentAccount.toLowerCase()
      : false,
    isToCurrentAccount: currentAccount
      ? to?.address.toLowerCase() === currentAccount.toLowerCase()
      : false,

    receipts: operationReceipt ? [operationReceipt] : undefined,
    metadata: {
      depth: 0,
    },
  } as SimplifiedOperation;

  if (parsedReceipts && baseOperation.receipts) {
    baseOperation.metadata.depth = getOperationDepth(
      baseOperation,
      parsedReceipts,
    );
  }

  if (assetsSent.length > 0) {
    baseOperation.assets = assetsSent.map((asset) => ({
      amount: new BN(asset.amount),
      assetId: asset.assetId,
    }));
  }

  return baseOperation;
}

function transformOperations(
  summary: TransactionSummary,
  currentAccount?: string,
  parsedReceipts?: ParsedReceiptData[],
): SimplifiedOperation[] {
  if (!summary.operations) return [];

  const operations = summary.operations.map((op) => {
    return transformOperation(op, currentAccount, parsedReceipts);
  });

  return operations;
}

function getOperationDepth(
  operation: SimplifiedOperation,
  parsedReceipts: ParsedReceiptData[],
) {
  let depth = 0;

  // biome-ignore lint/suspicious/noExplicitAny: Type mismatch, id is sometimes available.
  const receiptIndex = parsedReceipts.findIndex((r: any) =>
    operation.receipts?.some(
      // biome-ignore lint/suspicious/noExplicitAny: Type mismatch, id is sometimes available.
      (operationReceipt: any) => operationReceipt.id === r.data.id,
    ),
  );

  if (receiptIndex !== -1) {
    depth = parsedReceipts[receiptIndex].indent;
  }
  return depth;
}

function toBNSafe(value?: string | number | BN | null, decimals = 9): BN {
  try {
    if (!value) return new BN(0);

    if (typeof value === 'string') {
      // Se for hexadecimal
      if (/^0x[0-9a-fA-F]+$/.test(value)) {
        return new BN(value.replace(/^0x/, ''), 16);
      }

      // Se for decimal (ex: "0.000016774")
      if (value.includes('.')) {
        const [whole, fraction = ''] = value.split('.');
        const cleanFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
        return new BN(whole + cleanFraction);
      }

      // Se for número como string
      if (/^\d+$/.test(value)) {
        return new BN(value, 10);
      }

      console.warn('Invalid BN string:', value);
      return new BN(0);
    }

    return new BN(value);
  } catch (err) {
    console.error('BN Conversion Error:', err, value);
    return new BN(0);
  }
}

export function simplifyTransaction(
  summary?: TransactionSummary | TransactionResult,
  request?: TransactionRequest,
  currentAccount?: string,
): SimplifiedTransaction | undefined {
  if (!summary) return undefined;
  const parsedReceipts = parseReceipts(summary.receipts);
  const operations = transformOperations(
    summary,
    currentAccount,
    parsedReceipts,
  );

  const categorizedOperations = categorizeOperationsV2(operations);

  const simplifiedTransaction = {
    id: summary.id,
    operations,
    categorizedOperations,
    fee: {
      total: toBNSafe(summary?.fee),
      network: toBNSafe(summary?.fee).sub(toBNSafe(request?.tip)),
      tip: toBNSafe(request?.tip),
      gasUsed: toBNSafe(summary?.gasUsed),
      gasPrice: new BN(0),
    },
  };
  return simplifiedTransaction;
}

function groupOpsFromCurrentAccountToContract(
  operations: SimplifiedOperation[],
): Record<string, SimplifiedOperation[]> {
  const groupedFromAccountToContract = operations
    .filter((op) => {
      const isRootContractCall =
        op.type === TxCategory.CONTRACTCALL && op.metadata.depth === 0;
      const isTransfer = op.type === TxCategory.SEND && op.to.type === 0;

      return op.isFromCurrentAccount && (isRootContractCall || isTransfer);
    })
    .reduce(
      (acc, op) => {
        return {
          // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
          ...acc,
          [op.from.address]: [...(acc[op.from.address] || []), op],
        };
      },
      {} as Record<string, SimplifiedOperation[]>,
    );

  return groupedFromAccountToContract;
}

function groupOpsFromContractToCurrentAccount(
  operations: SimplifiedOperation[],
): Record<string, SimplifiedOperation[]> {
  const groupedFromContractToAccount = operations
    .filter(
      (op) =>
        op.isToCurrentAccount &&
        op.type === TxCategory.SEND &&
        op.from.type === 0,
    )
    .reduce(
      (acc, op) => {
        return {
          // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
          ...acc,
          [op.from.address]: [...(acc[op.from.address] || []), op],
        };
      },
      {} as Record<string, SimplifiedOperation[]>,
    );

  return groupedFromContractToAccount;
}

function onlySumAssets(
  operations?: SimplifiedOperation[],
): Record<string, BN> {
  const assets: Record<string, BN> = {};

  for (const op of operations || []) {
    if (!op.assets?.length) continue;

    for (const asset of op.assets) {
      const { assetId, amount } = asset;
      assets[assetId] = (assets[assetId] || new BN(0)).add(amount);
    }
  }

  return assets;
}

function categorizeOperationsV2(inputOperations: SimplifiedOperation[]) {
  const intermediateContractCalls = [];
  const notRelatedToCurrentAccount = [];
  const remainingOps = [];

  for (const op of inputOperations) {
    if (op.type === TxCategory.CONTRACTCALL && (op.metadata.depth || 0) > 0) {
      intermediateContractCalls.push(op);
    } else if (!op.isFromCurrentAccount && !op.isToCurrentAccount) {
      notRelatedToCurrentAccount.push(op);
    } else {
      remainingOps.push(op);
    }
  }

  const mainOperations = getMainOperations(remainingOps);

  return {
    mainOperations,
    intermediateContractCalls,
    notRelatedToCurrentAccount,
  };
}

function getMainOperations(
  operations: SimplifiedOperation[],
): SimplifiedOperation[] {
  const groupedFromAccountToContract =
    groupOpsFromCurrentAccountToContract(operations);
  const groupedFromContractToAccount =
    groupOpsFromContractToCurrentAccount(operations);

  const mainOperations: SimplifiedOperation[] = [];

  for (const [fromAccount, opsFromAccount] of Object.entries(
    groupedFromAccountToContract,
  )) {
    const contractAddress = opsFromAccount[0].to.address;
    const opsToCurrentAccount = groupedFromContractToAccount[contractAddress];

    const assetsFromTo = Object.entries(onlySumAssets(opsFromAccount)).map(
      ([assetId, amount]) => ({ assetId, amount }),
    );
    const assetsToFrom = Object.entries(onlySumAssets(opsToCurrentAccount)).map(
      ([assetId, amount]) => ({ assetId, amount }),
    );

    const hasAssetsComingBack = assetsToFrom.some((a) => a.amount.gt(0));

    const isContractCallSendingFunds = opsFromAccount.some((op) => {
      const hasAssets = Object.values(onlySumAssets([op])).some((a) => a.gt(0));
      return op.type === TxCategory.CONTRACTCALL && hasAssets;
    });
    const isTransfer = opsFromAccount.some((op) => op.type === TxCategory.SEND);
    const isTypeContractCall = isContractCallSendingFunds || !isTransfer;
    const baseOperation = {
      type: isTypeContractCall ? TxCategory.CONTRACTCALL : TxCategory.SEND,
      from: {
        address: fromAccount,
        type: 1,
      },
      to: {
        address: contractAddress,
        type: 0,
      },
      isFromCurrentAccount: true,
      isToCurrentAccount: false,
      assets: assetsFromTo,
      metadata: {
        depth: 0,
      },
    };

    if (hasAssetsComingBack) {
      const mainOperation: SimplifiedOperation = {
        ...baseOperation,
        from: { ...baseOperation.from, chain: undefined },
        to: { ...baseOperation.to, chain: undefined },
        assetsToFrom,
        operations: [...opsFromAccount, ...opsToCurrentAccount],
      };
      mainOperations.push(mainOperation);
    } else {
      const mainOperation: SimplifiedOperation = {
        ...baseOperation,
        from: { ...baseOperation.from, chain: undefined },
        to: { ...baseOperation.to, chain: undefined },
        operations: [...opsFromAccount],
      };
      mainOperations.push(mainOperation);
    }
  }

  const transferOperationsNotGrouped = operations.filter((op) => {
    if (op.type !== TxCategory.SEND) return false;

    const isAlreadyGrouped = mainOperations.find((mainOp) => {
      const isFromSameAccount = mainOp.from.address === op.from.address;
      const isToSameAccount = mainOp.to.address === op.to.address;

      const isSendingBack =
        mainOp.to.address === op.from.address &&
        mainOp.from.address === op.to.address;

      return (isFromSameAccount && isToSameAccount) || isSendingBack;
    });
    return !isAlreadyGrouped;
  });
  if (transferOperationsNotGrouped.length > 0) {
    // @TODO: group transfers
    if (transferOperationsNotGrouped.length === 1) {
      mainOperations.push(...transferOperationsNotGrouped);
    } else {
      const groupedEqualTransfers = transferOperationsNotGrouped.reduce(
        (acc, op) => {
          return {
            // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
            ...acc,
            [`${op.from.address}-${op.to.address}`]: [
              ...(acc[op.from.address + op.to.address] || []),
              op,
            ],
          };
        },
        {} as Record<string, SimplifiedOperation[]>,
      );

      for (const [, ops] of Object.entries(groupedEqualTransfers)) {
        const assetsFromTo = Object.entries(onlySumAssets(ops)).map(
          ([assetId, amount]) => ({ assetId, amount }),
        );

        const groupedTransferOperation = {
          ...ops[0],
          assets: assetsFromTo,
          operations: [...ops],
          metadata: {
            depth: 0,
          },
        };

        mainOperations.push(groupedTransferOperation);
      }
    }
  }

  return mainOperations;
}
