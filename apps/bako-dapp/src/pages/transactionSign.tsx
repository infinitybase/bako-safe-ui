// import { useQueryParams } from '@app/modules/auth';
// import { Dialog } from '@bako-safe/ui';

// import { DappTransactionWrapper } from '../components/transaction/wrapper';
// import { useTransactionSocket } from '../hooks';

// const TransactionSign = () => {
//   const { transactionId, transactionHash } = useQueryParams();
//   const {
//     validAt,
//     vault,
//     summary,
//     sign: { handler, cancel, isLoading },
//   } = useTransactionSocket();

//   const SignTransactionButton = () => (
//     <Dialog.PrimaryAction
//       size="md"
//       isLoading={isLoading}
//       onClick={() => handler(transactionId!, transactionHash!)}
//       fontWeight={700}
//       fontSize={14}
//     >
//       Sign
//     </Dialog.PrimaryAction>
//   );

//   return (
//     <DappTransactionWrapper
//       title="Sign transaction"
//       validAt={validAt}
//       vault={vault}
//       pendingSignerTransactions={false}
//       summary={summary}
//       primaryActionButton={<SignTransactionButton />}
//       primaryActionLoading={isLoading}
//       cancel={cancel}
//     />
//   );
// };

// export { TransactionSign };
