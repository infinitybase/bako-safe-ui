import {
  Accordion,
  Card,
  CardRootProps,
  Flex,
  HStack,
  Icon,
  Separator,
  Text,
  VStack,
} from 'bako-ui';
import { memo, useMemo } from 'react';

import { useWorkspaceContext } from '@/modules';

import { useDetailsDialog } from '../../hooks/details';
import { useVerifyTransactionInformations } from '../../hooks/details/useVerifyTransactionInformations';
import { TransactionWithVault } from '../../services/types';
import { getTransactionIconComponent, transactionStatus } from '../../utils';
import { TransactionCard } from '../TransactionCard';
import { AssetsIcon } from '../TransactionCard/AssetsIcon';
import { DetailsDialog } from '../TransactionCard/DetailsDialog';
import { Amount } from './Amount';

interface TransactionCardMobileProps extends CardRootProps {
  transaction: TransactionWithVault;
  account: string;
  isSigner: boolean;
  callBack?: () => void;
}

const TransactionCardMobile = memo((props: TransactionCardMobileProps) => {
  const {
    assetsMap,
    screenSizes: { isSmall, isLitteSmall },
  } = useWorkspaceContext();
  const { transaction, account, isSigner, ...rest } = props;
  const { isOpen, onOpen, onOpenChange } = useDetailsDialog();

  const {
    isFromConnector,
    isDeploy,
    isDeposit,
    isContract,
    isLiquidStake,
    isBridge,
    isFromCLI,
    isSwap,
  } = useVerifyTransactionInformations(transaction);

  const IconComponent = useMemo(
    () =>
      getTransactionIconComponent({
        isDeploy,
        isFromConnector,
        isDeposit,
        isLiquidStake,
        isBridge,
        isFromCLI,
        isSwap,
      }),
    [
      isDeploy,
      isFromConnector,
      isDeposit,
      isFromCLI,
      isLiquidStake,
      isBridge,
      isSwap,
    ],
  );

  const status = useMemo(
    () =>
      transactionStatus({
        ...transaction,
        account,
      }),
    [transaction, account],
  );
  const {
    isSigned,
    isCompleted,
    isDeclined,
    isReproved,
    isCanceled,
    isPendingProvider,
    isError,
  } = status;

  const awaitingAnswer = useMemo(
    () =>
      !isSigned &&
      !isDeclined &&
      !isCompleted &&
      !isReproved &&
      transaction &&
      !isCanceled &&
      !isPendingProvider &&
      !isError,
    [
      isSigned,
      isDeclined,
      isCompleted,
      isReproved,
      transaction,
      isCanceled,
      isPendingProvider,
      isError,
    ],
  );

  const showAmount = useMemo(() => {
    return transaction.assets.length > 0;
  }, [transaction.assets]);

  const transactionName = useMemo(() => {
    if (isBridge) {
      return 'Bridge';
    }
    return transaction.name;
  }, [isBridge, transaction.name]);

  const transactionDescription = useMemo(() => {
    if (transaction.assets.length === 0) {
      return null;
    }
    if (isBridge) {
      return transaction.name.split('Bridge ')[1] || `Bridge tokens`;
    }
    if (transaction.assets.length === 1) {
      const assetData =
        assetsMap[transaction.assets[0].assetId] || assetsMap.UNKNOWN;
      if (isDeposit) {
        return `Receive ${assetData.name} ${assetData.slug}`;
      }
      return `Send ${assetData.name} ${assetData.slug}`;
    }
    return `Send multi tokens`;
  }, [transaction.assets, transaction.name, isBridge, assetsMap, isDeposit]);

  const assetsIcon = useMemo(() => {
    if (isBridge) {
      const destination = transaction.resume?.bridge?.destinationToken;
      return transaction.assets.concat({
        assetId: destination?.assetId || '',
        amount: destination?.amount?.toString() || '0',
        to: destination?.to || '',
      });
    }
    return transaction.assets;
  }, [
    isBridge,
    transaction.assets,
    transaction.resume?.bridge?.destinationToken,
  ]);

  return (
    <Accordion.Item value={transaction.hash}>
      <DetailsDialog
        open={isOpen}
        onOpenChange={onOpenChange}
        transaction={transaction}
        status={status}
        isSigner={isSigner}
        callBack={props.callBack}
        isContract={isContract}
        TransactionIcon={IconComponent}
      />

      <Card.Root
        onClick={onOpen}
        variant="subtle"
        rounded="lg"
        bg="bg.panel"
        {...rest}
      >
        <Card.Body p={0}>
          <HStack alignItems="stretch" w="full">
            <Flex
              alignItems="center"
              justifyContent="center"
              bgColor="bg.muted"
              w="32px"
              borderRadius="8px 0 0 8px"
            >
              <Icon as={IconComponent} boxSize="16px" />
            </Flex>
            <VStack w="full" p={3}>
              <HStack justifyContent="space-between" w="full">
                <VStack alignItems="flex-start" w="full" gap={2}>
                  <Text
                    fontSize="xs"
                    color="textPrimary"
                    lineHeight="shorter"
                    fontWeight="medium"
                    maxW={{
                      base: isLitteSmall
                        ? '125px'
                        : isSmall
                          ? '175px'
                          : '275px',
                      sm: '375px',
                    }}
                    truncate
                  >
                    {transactionName}
                  </Text>

                  <HStack gap={2} alignItems="center">
                    <AssetsIcon
                      assets={assetsIcon}
                      assetsMap={assetsMap}
                      size={4}
                    />
                    {transactionDescription && (
                      <Text
                        fontSize="xs"
                        color="gray.400"
                        fontWeight="medium"
                        lineHeight="shorter"
                        truncate
                        lineClamp={1}
                      >
                        {transactionDescription}
                      </Text>
                    )}
                  </HStack>
                </VStack>

                {showAmount && <Amount assets={transaction.assets} />}
              </HStack>

              {!isCompleted && (
                <>
                  <Separator borderColor="gray.500" w="full" />

                  <HStack justifyContent="space-between" w="full">
                    <TransactionCard.Status
                      transaction={transaction}
                      status={status}
                      showDescription={false}
                    />

                    <TransactionCard.ActionsMobile
                      isPossibleToSign={awaitingAnswer}
                    />
                  </HStack>
                </>
              )}
            </VStack>
          </HStack>
        </Card.Body>
      </Card.Root>
    </Accordion.Item>
  );
});

TransactionCardMobile.displayName = 'TransactionCardMobile';

export { TransactionCardMobile };
